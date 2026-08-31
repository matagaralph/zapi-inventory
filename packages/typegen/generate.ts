import { mkdir, readdir } from 'node:fs/promises'
import { join, basename } from 'node:path'
import openapiTS, { astToString } from 'openapi-typescript'
import ts from 'typescript'

const specsDir = join(import.meta.dir, 'specs')
const generatedDir = join(import.meta.dir, 'src', 'generated')
const typesDir = join(import.meta.dir, 'src', 'types')

await mkdir(generatedDir, { recursive: true })
await mkdir(typesDir, { recursive: true })

const toNamespace = (name: string) =>
  name
    .replace(/[-_](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase())

// Zoho repeats this docs-renderer schema in every domain; it always aliases another schema we already export.
const IGNORED_SCHEMA_KEYS = new Set(['gendoc-attributes-schema'])

// Only object literals, schema aliases, and intersections are worth a top-level alias; primitives like batch_id aren't.
const STRUCTURAL_KINDS = new Set([
  ts.SyntaxKind.TypeLiteral,
  ts.SyntaxKind.IndexedAccessType,
  ts.SyntaxKind.IntersectionType,
])

const STOPWORDS = new Set(['a', 'an', 'the', 'all'])
const VERB_ALIASES = new Map([
  ['create', 'Create'],
  ['creating', 'Create'],
  ['retrieve', 'Get'],
  ['retrieving', 'Get'],
  ['get', 'Get'],
  ['getting', 'Get'],
  ['update', 'Update'],
  ['updating', 'Update'],
  ['updated', 'Update'],
  ['delete', 'Delete'],
  ['deleting', 'Delete'],
  ['list', 'List'],
])

function aliasNameFor(schemaKey: string): string {
  const tokens = schemaKey.split(/[-_]/).filter((t) => t.length > 0 && !STOPWORDS.has(t))
  return tokens
    .map((token, i) => {
      const verbAlias = i === 0 ? VERB_ALIASES.get(token) : undefined
      if (verbAlias) return verbAlias
      return token[0]!.toUpperCase() + token.slice(1)
    })
    .join('')
}

function propertyNameText(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text
  }
  return undefined
}

const RESPONSE_SCHEMA_SUFFIX = '-response'

function stripOptionalDeep<T extends ts.Node>(node: T): T {
  function visit(n: ts.Node): ts.Node {
    const visited = ts.visitEachChild(n, visit, undefined)
    if (ts.isPropertySignature(visited) && visited.questionToken) {
      return ts.factory.updatePropertySignature(
        visited,
        visited.modifiers,
        visited.name,
        undefined,
        visited.type
      )
    }
    return visited
  }
  // SAFETY: visit() only rewrites PropertySignature nodes in place and returns every other
  // node unchanged, so the root node's kind (and thus its shape T) is always preserved.
  return ts.visitNode(node, visit) as T
}

// Zoho's spec never marks response fields required, even ones always present, so every
// response type comes out fully optional and painful to consume. Since request bodies genuinely
// do use `required:` where it matters, only schemas named "*-response" are forced non-optional.
function requireResponseFields(ast: readonly ts.Node[]): ts.Node[] {
  return ast.map((node) => {
    if (!ts.isInterfaceDeclaration(node) || node.name.text !== 'components') return node

    const newMembers = node.members.map((member) => {
      if (
        !ts.isPropertySignature(member) ||
        propertyNameText(member.name) !== 'schemas' ||
        !member.type ||
        !ts.isTypeLiteralNode(member.type)
      ) {
        return member
      }

      const newSchemaMembers = member.type.members.map((schemaMember) => {
        if (!ts.isPropertySignature(schemaMember) || !schemaMember.type) return schemaMember
        const key = propertyNameText(schemaMember.name)
        if (!key?.endsWith(RESPONSE_SCHEMA_SUFFIX)) return schemaMember

        return ts.factory.updatePropertySignature(
          schemaMember,
          schemaMember.modifiers,
          schemaMember.name,
          schemaMember.questionToken,
          stripOptionalDeep(schemaMember.type)
        )
      })

      const newSchemasType = ts.factory.updateTypeLiteralNode(
        member.type,
        ts.factory.createNodeArray(newSchemaMembers)
      )
      return ts.factory.updatePropertySignature(
        member,
        member.modifiers,
        member.name,
        member.questionToken,
        newSchemasType
      )
    })

    return ts.factory.updateInterfaceDeclaration(
      node,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      newMembers
    )
  })
}

// The SDK hand-writes its own request functions against `components` and `operations`;
// `paths` (every route keyed by URL, duplicating what `operations` already types) is never
// referenced and would otherwise ship dead weight in the published declaration files.
function dropUnusedPathsInterface(ast: readonly ts.Node[]): ts.Node[] {
  return ast.filter((node) => !ts.isInterfaceDeclaration(node) || node.name.text !== 'paths')
}

function extractStructuralSchemaKeys(ast: readonly ts.Node[]): string[] {
  const keys: string[] = []

  for (const node of ast) {
    if (!ts.isInterfaceDeclaration(node) || node.name.text !== 'components') continue

    const schemasProp = node.members.find(
      (m): m is ts.PropertySignature =>
        ts.isPropertySignature(m) && propertyNameText(m.name) === 'schemas'
    )
    if (!schemasProp?.type || !ts.isTypeLiteralNode(schemasProp.type)) continue

    for (const schemaMember of schemasProp.type.members) {
      if (!ts.isPropertySignature(schemaMember) || !schemaMember.name || !schemaMember.type)
        continue
      const key = propertyNameText(schemaMember.name)
      if (!key || IGNORED_SCHEMA_KEYS.has(key)) continue
      if (STRUCTURAL_KINDS.has(schemaMember.type.kind)) keys.push(key)
    }
  }

  return keys
}

const ORG_ID_QUERY_PARAM = 'organization_id'

// organization_id is always present but is injected by the SDK's auth layer on every request,
// not something a caller ever supplies. An operation whose only query param is organization_id
// has nothing worth a Query type at all.
function hasExtraQueryParams(operationType: ts.TypeNode): boolean {
  if (!ts.isTypeLiteralNode(operationType)) return false

  const parametersProp = operationType.members.find(
    (m): m is ts.PropertySignature =>
      ts.isPropertySignature(m) && propertyNameText(m.name) === 'parameters'
  )
  if (!parametersProp?.type || !ts.isTypeLiteralNode(parametersProp.type)) return false

  const queryProp = parametersProp.type.members.find(
    (m): m is ts.PropertySignature =>
      ts.isPropertySignature(m) && propertyNameText(m.name) === 'query'
  )
  if (!queryProp?.type || !ts.isTypeLiteralNode(queryProp.type)) return false

  return queryProp.type.members.some((m) => {
    const key = ts.isPropertySignature(m) ? propertyNameText(m.name) : undefined
    return key !== undefined && key !== ORG_ID_QUERY_PARAM
  })
}

function extractQueryableOperationIds(ast: readonly ts.Node[]): string[] {
  const ids: string[] = []

  for (const node of ast) {
    if (!ts.isInterfaceDeclaration(node) || node.name.text !== 'operations') continue

    for (const member of node.members) {
      if (!ts.isPropertySignature(member) || !member.type) continue
      const id = propertyNameText(member.name)
      if (id && hasExtraQueryParams(member.type)) ids.push(id)
    }
  }

  return ids
}

const specFiles = (await readdir(specsDir)).filter((f) => f.endsWith('.yml')).sort()

const moduleNames: string[] = []
// tracks which module claimed each alias, so cross-domain collisions disambiguate the same way every run
const globalAliasOwners = new Map<string, string>()

function resolveAlias(
  candidate: string,
  key: string,
  moduleName: string,
  namespace: string,
  localAliasOwners: Map<string, string>,
  collisionCounts: Map<string, number>
): string {
  let alias = candidate

  if (localAliasOwners.has(alias) && localAliasOwners.get(alias) !== key) {
    const seed = (collisionCounts.get(candidate) ?? 0) + 1
    collisionCounts.set(candidate, seed)
    const disambiguated = `${alias}_${seed}`
    console.warn(
      `[typegen] ${moduleName}: "${key}" collides with "${localAliasOwners.get(alias)}" as "${alias}", using "${disambiguated}"`
    )
    alias = disambiguated
  }

  const owner = globalAliasOwners.get(alias)
  if (owner && owner !== moduleName) {
    const disambiguated = `${namespace}${alias}`
    console.warn(
      `[typegen] ${moduleName}: "${alias}" already used by "${owner}", using "${disambiguated}"`
    )
    alias = disambiguated
  }

  localAliasOwners.set(alias, key)
  globalAliasOwners.set(alias, moduleName)
  return alias
}

for (const file of specFiles) {
  const specPath = join(specsDir, file)
  const moduleName = basename(file, '.yml')
  const namespace = toNamespace(moduleName)

  const ast = dropUnusedPathsInterface(
    requireResponseFields(await openapiTS(Bun.pathToFileURL(specPath)))
  )
  await Bun.write(join(generatedDir, `${moduleName}.ts`), astToString(ast))

  const localAliasOwners = new Map<string, string>()
  const collisionCounts = new Map<string, number>()

  const entries = extractStructuralSchemaKeys(ast).map((schemaKey) => ({
    alias: resolveAlias(
      aliasNameFor(schemaKey),
      schemaKey,
      moduleName,
      namespace,
      localAliasOwners,
      collisionCounts
    ),
    schemaKey,
  }))

  const queryEntries = extractQueryableOperationIds(ast).map((operationId) => ({
    alias: resolveAlias(
      `${aliasNameFor(operationId)}Query`,
      operationId,
      moduleName,
      namespace,
      localAliasOwners,
      collisionCounts
    ),
    operationId,
  }))

  const body = entries
    .map(({ alias, schemaKey }) => `export type ${alias} = components["schemas"]["${schemaKey}"];`)
    .join('\n')

  const queryBody = queryEntries
    .map(
      ({ alias, operationId }) =>
        `export type ${alias} = Omit<operations["${operationId}"]["parameters"]["query"], "organization_id">;`
    )
    .join('\n')

  const importedTypes = queryEntries.length > 0 ? 'components, operations' : 'components'
  const contents = [
    `import type { ${importedTypes} } from "../generated/${moduleName}.ts";`,
    '',
    body,
    ...(queryEntries.length > 0 ? ['', queryBody] : []),
    '',
  ].join('\n')
  await Bun.write(join(typesDir, `${moduleName}.ts`), contents)

  moduleNames.push(moduleName)
  console.log(
    `generated ${moduleName}.ts (${entries.length} types, ${queryEntries.length} query types)`
  )
}

moduleNames.sort()

const typesBarrel = moduleNames.map((name) => `export * from "./${name}.ts";`).join('\n') + '\n'
await Bun.write(join(typesDir, 'index.ts'), typesBarrel)

await Bun.write(join(import.meta.dir, 'src', 'index.ts'), 'export * from "./types/index.ts";\n')

console.log('generated src/types/index.ts and src/index.ts')
