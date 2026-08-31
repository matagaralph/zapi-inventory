import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { $ } from 'bun'

const root = join(import.meta.dir, '..')
const repoRoot = join(root, '..', '..')
const entrypoint = join(root, 'src', 'index.ts')
const outdir = join(root, 'dist')
const typesOutdir = join(outdir, 'types')
const typegenRoot = join(root, '..', 'typegen')

// npm looks for README/LICENSE next to package.json (for the npm page) and won't reach up to
// the repo root, so a workspace package that only lives at the root publishes with neither. A
// copy also goes into dist/ so the built output is self-contained on its own.
async function copyPackageMetadata(): Promise<void> {
  const readme = Bun.file(join(repoRoot, 'README.md'))
  const license = Bun.file(join(repoRoot, 'LICENSE'))

  await Promise.all([
    Bun.write(join(root, 'README.md'), readme),
    Bun.write(join(root, 'LICENSE'), license),
    Bun.write(join(outdir, 'README.md'), readme),
    Bun.write(join(outdir, 'LICENSE'), license),
  ])
}

async function declarationFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return declarationFiles(path)
      return entry.isFile() && entry.name.endsWith('.d.ts') ? [path] : []
    })
  )
  return files.flat()
}

function toSpecifier(path: string): string {
  const specifier = path.split('\\').join('/')
  return specifier.startsWith('.') ? specifier : `./${specifier}`
}

async function rewriteDeclarations(): Promise<void> {
  const files = await declarationFiles(typesOutdir)

  await Promise.all(
    files.map(async (file) => {
      const typegenSpecifier = toSpecifier(
        relative(dirname(file), join(typesOutdir, 'typegen', 'index.js'))
      )
      const source = await readFile(file, 'utf8')
      const rewritten = source
        .replaceAll("'@zapi-inventory/typegen'", `'${typegenSpecifier}'`)
        .replaceAll('"@zapi-inventory/typegen"', `"${typegenSpecifier}"`)
        .replaceAll(".ts'", ".js'")
        .replaceAll('.ts"', '.js"')

      if (rewritten !== source) {
        await writeFile(file, rewritten)
      }
    })
  )
}

await rm(outdir, { force: true, recursive: true })

const commonConfig = {
  entrypoints: [entrypoint],
  packages: 'external',
  target: 'node',
} satisfies Omit<Bun.BuildConfig, 'format' | 'outdir'>

const builds = [
  Bun.build({
    ...commonConfig,
    format: 'esm',
    naming: 'index.mjs',
    outdir,
  }),
  Bun.build({
    ...commonConfig,
    format: 'cjs',
    naming: 'index.cjs',
    outdir,
  }),
]

const results = await Promise.all(builds)
const logs = results.flatMap((result) => result.logs)

if (logs.length > 0) {
  for (const log of logs) console.error(log)
}

if (results.some((result) => !result.success)) {
  process.exit(1)
}

await $`bunx tsc -p ${join(typegenRoot, 'tsconfig.build.json')}`
await $`bunx tsc -p ${join(root, 'tsconfig.build.json')}`
await rewriteDeclarations()
await copyPackageMetadata()
