import { execFileSync } from 'node:child_process'
import { copyFile, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'
import type { BuildOptions } from 'esbuild'
import { build } from 'esbuild'

const root = join(import.meta.dirname, '..')
const repoRoot = join(root, '..', '..')
const entrypoint = join(root, 'src', 'index.ts')
const outdir = join(root, 'dist')
const typesOutdir = join(outdir, 'types')
const typegenRoot = join(root, '..', 'typegen')
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc')

// npm looks for README/LICENSE next to package.json (for the npm page) and won't reach up to
// the repo root, so a workspace package that only lives at the root publishes with neither. A
// copy also goes into dist/ so the built output is self-contained on its own.
async function copyPackageMetadata(): Promise<void> {
  const readme = join(repoRoot, 'README.md')
  const license = join(repoRoot, 'LICENSE')

  await Promise.all([
    copyFile(readme, join(root, 'README.md')),
    copyFile(license, join(root, 'LICENSE')),
    copyFile(readme, join(outdir, 'README.md')),
    copyFile(license, join(outdir, 'LICENSE')),
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

function runTsc(project: string): void {
  execFileSync(process.execPath, [tsc, '-p', project], { stdio: 'inherit' })
}

await rm(outdir, { force: true, recursive: true })

// The SDK has no runtime dependencies, so marking packages external only ever affects the
// type-only typegen workspace, whose imports are erased before bundling.
const commonOptions = {
  entryPoints: [entrypoint],
  bundle: true,
  packages: 'external',
  platform: 'neutral',
  target: 'es2022',
  minify: true,
  logLevel: 'warning',
} satisfies BuildOptions

await Promise.all([
  build({ ...commonOptions, format: 'esm', outfile: join(outdir, 'index.mjs') }),
  build({ ...commonOptions, format: 'cjs', outfile: join(outdir, 'index.cjs') }),
])

runTsc(join(typegenRoot, 'tsconfig.build.json'))
runTsc(join(root, 'tsconfig.build.json'))
await rewriteDeclarations()
await copyPackageMetadata()
