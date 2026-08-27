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
const VERB_ALIASES: Record<string, string> = {
  create: 'Create',
  creating: 'Create',
  retrieve: 'Get',
  retrieving: 'Get',
  get: 'Get',
  getting: 'Get',
  update: 'Update',
  updating: 'Update',
  updated: 'Update',
  delete: 'Delete',
  deleting: 'Delete',
  list: 'List',
}

function aliasNameFor(schemaKey: string): string {
  const tokens = schemaKey.split(/[-_]/).filter((t) => t.length > 0 && !STOPWORDS.has(t))
  return tokens
    .map((token, i) => {
      if (i === 0 && VERB_ALIASES[token]) return VERB_ALIASES[token]
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

const specFiles = (await readdir(specsDir)).filter((f) => f.endsWith('.yml')).sort()

const moduleNames: string[] = []
// tracks which module claimed each alias, so cross-domain collisions disambiguate the same way every run
const globalAliasOwners = new Map<string, string>()

for (const file of specFiles) {
  const specPath = join(specsDir, file)
  const moduleName = basename(file, '.yml')
  const namespace = toNamespace(moduleName)

  const ast = await openapiTS(Bun.pathToFileURL(specPath))
  await Bun.write(join(generatedDir, `${moduleName}.ts`), astToString(ast))

  const schemaKeys = extractStructuralSchemaKeys(ast)
  const localAliasOwners = new Map<string, string>()
  const entries: Array<{ alias: string; schemaKey: string }> = []

  for (const schemaKey of schemaKeys) {
    let alias = aliasNameFor(schemaKey)

    if (localAliasOwners.has(alias) && localAliasOwners.get(alias) !== schemaKey) {
      const disambiguated = `${alias}_${entries.length}`
      console.warn(
        `[typegen] ${moduleName}: "${schemaKey}" collides with "${localAliasOwners.get(alias)}" as "${alias}", using "${disambiguated}"`
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

    localAliasOwners.set(alias, schemaKey)
    globalAliasOwners.set(alias, moduleName)
    entries.push({ alias, schemaKey })
  }

  const body = entries
    .map(({ alias, schemaKey }) => `export type ${alias} = components["schemas"]["${schemaKey}"];`)
    .join('\n')

  const contents = `import type { components } from "../generated/${moduleName}.ts";\n\n${body}\n`
  await Bun.write(join(typesDir, `${moduleName}.ts`), contents)

  moduleNames.push(moduleName)
  console.log(`generated ${moduleName}.ts (${entries.length} types)`)
}

moduleNames.sort()

const typesBarrel = moduleNames.map((name) => `export * from "./${name}.ts";`).join('\n') + '\n'
await Bun.write(join(typesDir, 'index.ts'), typesBarrel)

await Bun.write(join(import.meta.dir, 'src', 'index.ts'), 'export * from "./types/index.ts";\n')

console.log('generated src/types/index.ts and src/index.ts')
