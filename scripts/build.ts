import { $ } from 'bun';
import { rmSync, existsSync, mkdirSync } from 'fs';

async function build() {
  console.log('Cleaning dist directory.');
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true });
  }
  mkdirSync('dist', { recursive: true });

  console.log('Building ESM bundle.');
  await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'node',
    format: 'esm',
    minify: true,
    splitting: false,
  });

  console.log('Building CJS bundle.');
  await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'node',
    format: 'cjs',
    minify: true,
    naming: '[dir]/index.cjs',
  });

  // Build modules if they exist
  if (existsSync('src/modules')) {
    console.log('Building modules.');
    await Bun.build({
      entrypoints: ['./src/modules/index.ts'],
      outdir: './dist/modules',
      target: 'node',
      format: 'esm',
      minify: true,
    });

    console.log('Building modules (CJS).');
    await Bun.build({
      entrypoints: ['./src/modules/index.ts'],
      outdir: './dist/modules',
      target: 'node',
      format: 'cjs',
      minify: true,
      naming: '[dir]/index.cjs',
      splitting: false,
    });
  }

  const GENERATED_SRC = 'src/generated';
  const GENERATED_DIST = 'dist/generated';

  if (existsSync(GENERATED_SRC)) {
    console.log(`Copying ${GENERATED_SRC} to ${GENERATED_DIST}.`);
    // Use the native shell 'cp -r' command, which is guaranteed to work
    // consistently in the Bun shell environment.
    await $`cp -r ${GENERATED_SRC} ${GENERATED_DIST}`;
  }

  console.log('Generating declarations.');
  await $`bun x tsc --emitDeclarationOnly`;

  console.log('✅ Build complete!');
}

build().catch(console.error);
