import { existsSync } from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

import type { TokenStore, StoredToken } from './token-store.ts';

export class FileTokenStore implements TokenStore {
  private readonly path: string;
  private writeLock: Promise<void> = Promise.resolve();

  constructor(path: string = '.zoho-tokens.json') {
    this.path = path;
  }

  private async read(): Promise<StoredToken[]> {
    if (!existsSync(this.path)) return [];
    const raw = await readFile(this.path, 'utf-8');
    return JSON.parse(raw) as StoredToken[];
  }

  private async write(tokens: StoredToken[]): Promise<void> {
    const dir = dirname(this.path);
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
    await writeFile(this.path, JSON.stringify(tokens, null, 2), 'utf-8');
  }

  private withLock<T>(fn: () => Promise<T>): Promise<T> {
    let resolve!: () => void;
    const next = new Promise<void>((r) => (resolve = r));
    const result = this.writeLock.then(fn).finally(resolve);
    this.writeLock = next;
    return result;
  }

  async findToken(clientId: string, orgId: string): Promise<StoredToken | null> {
    const tokens = await this.read();
    return tokens.find((t) => t.clientId === clientId && t.orgId === orgId) ?? null;
  }

  async saveToken(token: StoredToken): Promise<void> {
    return this.withLock(async () => {
      const tokens = await this.read();
      const idx = tokens.findIndex((t) => t.clientId === token.clientId && t.orgId === token.orgId);
      if (idx >= 0) tokens[idx] = token;
      else tokens.push(token);
      await this.write(tokens);
    });
  }

  async deleteToken(clientId: string, orgId: string): Promise<void> {
    return this.withLock(async () => {
      const tokens = await this.read();
      await this.write(tokens.filter((t) => !(t.clientId === clientId && t.orgId === orgId)));
    });
  }
}
