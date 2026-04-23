import { defineConfig } from 'vite-plus';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    dts: {
      tsgo: true,
    },
    unbundle: true,
    exports: true,
    sourcemap: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    singleQuote: true,
    sortImports: true,
    semi: true,
    sortPackageJson: true,
    printWidth: 100,
  },
});
