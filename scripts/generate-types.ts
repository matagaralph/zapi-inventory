#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'src', 'generated');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'types');

const DEEP_REQUIRED_TYPE = `
type DeepRequired<T> = T extends object 
  ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> } 
  : T;
`;

function normalizeModuleName(file: string): string {
  return file.replace('.d.ts', '').split(/[-_]/g).join('');
}

function toPascalCase(raw: string): string {
  return raw
    .replace(/-a-/g, '-')
    .replace(/-an-/g, '-')
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

function isStandardError(content: string, key: string): boolean {
  const regex = new RegExp(`"${key}"\\s*:\\s*({[\\s\\S]*?});?`);
  const match = content.match(regex);

  if (!match) return false;

  let body = match[1];
  body = body.replace(/\/\*[\s\S]*?\*\//g, '');
  body = body.replace(/\/\/.*/g, '');
  body = body.replace(/\s/g, '');

  const validSignatures = new Set([
    '{readonlycode?:number;readonlymessage?:string;}',
    '{readonlymessage?:string;readonlycode?:number;}',
    '{readonlycode:number;readonlymessage:string;}',
    '{readonlymessage:string;readonlycode:number;}',
  ]);

  return validSignatures.has(body);
}

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

    if (finalName.endsWith('Response')) {
      if (isStandardError(content, raw)) {
        continue;
      }
      out.push(
        `export type ${finalName} = DeepRequired<${alias}['schemas']['${raw}']>;`
      );
    } else {
      out.push(`export type ${finalName} = ${alias}['schemas']['${raw}'];`);
    }
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
      DEEP_REQUIRED_TYPE,
      ...exports,
      '',
    ].join('\n');

    fs.writeFileSync(outFile, final);
    console.log('Generated:', outFile);
  }

  console.log('Done.');
}

generate();
