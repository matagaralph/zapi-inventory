#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'src', 'generated');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'types');

function normalizeModuleName(file: string): string {
  return file.replace('.d.ts', '').split(/[-_]/g).join('');
}

function toPascalCase(raw: string): string {
  return raw
    .replace(/-a-/g, '-') // drop -a-
    .replace(/-an-/g, '-') // drop -an-
    .split(/[-_]/g)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

const PATTERNS = [
  {
    regex: /^([\w-]+)-request$/,
    name: (b: any) => `${toPascalCase(b)}Request`,
  },
  {
    regex: /^([\w-]+)-response$/,
    name: (b: any) => `${toPascalCase(b)}Response`,
  },
  { regex: /^([\w-]+)$/, name: (b: any) => toPascalCase(b) },
];

function processModuleFile(alias: string, content: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  const regex = /"([\w-]+)"\s*:/g;
  const keys = new Set<string>();

  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) keys.add(m[1]);

  for (const raw of keys) {
    if (raw === 'gendoc-attributes-schema') continue;

    let finalName: string | null = null;

    const cleaned = raw.replace(/-a-/g, '-').replace(/-an-/g, '-');

    for (const p of PATTERNS) {
      const match = cleaned.match(p.regex);
      if (!match) continue;
      //@ts-expect-error
      finalName = p.name(...match.slice(1));
      break;
    }

    if (!finalName) continue;
    if (seen.has(finalName)) continue;
    seen.add(finalName);

    out.push(`export type ${finalName} = ${alias}['schemas']['${raw}'];`);
  }

  return out;
}

function cleanOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) return;

  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.ts'));
  for (const f of files) {
    fs.unlinkSync(path.join(OUTPUT_DIR, f));
  }
}

function generate() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  cleanOutputDir();

  const files = fs
    .readdirSync(GENERATED_DIR)
    .filter((f) => f.endsWith('.d.ts'));

  for (const file of files) {
    const moduleName = normalizeModuleName(file);
    const alias = moduleName + 'Components';
    const modulePath = file.replace('.d.ts', '');

    const raw = fs.readFileSync(path.join(GENERATED_DIR, file), 'utf8');

    const exports = processModuleFile(alias, raw);

    const outFile = path.join(OUTPUT_DIR, `${moduleName}.ts`);

    const final = [
      `import type { components as ${alias} } from '../generated/${modulePath}';`,
      '',
      ...exports,
      '',
    ].join('\n');

    fs.writeFileSync(outFile, final);
    console.log('Generated:', outFile);
  }

  console.log('Done.');
}

generate();
