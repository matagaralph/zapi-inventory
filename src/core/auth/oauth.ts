import xior, { isXiorError } from 'xior';

import { SDKException } from '@/core/exception.ts';

import type { TokenStore } from './store/token-store.ts';
import type { Token } from './token.ts';

const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  orgId: string;
  accountsUrl: string;
  store: TokenStore;
}

export class OAuthToken implements Token {
  private accessToken: string | null = null;
  private expiresAt: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(private readonly config: OAuthConfig) {}

  async getAccessToken(): Promise<string> {
    if (
      this.accessToken &&
      this.expiresAt &&
      Date.now() < this.expiresAt - TOKEN_EXPIRY_BUFFER_MS
    ) {
      return this.accessToken;
    }

    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this.resolveToken();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async resolveToken(): Promise<string> {
    const { clientId, orgId, store } = this.config;

    const stored = await store.findToken(clientId, orgId);
    if (
      stored?.accessToken &&
      stored.expiresAt &&
      Date.now() < stored.expiresAt - TOKEN_EXPIRY_BUFFER_MS
    ) {
      this.accessToken = stored.accessToken;
      this.expiresAt = stored.expiresAt;
      return stored.accessToken;
    }

    return this.refresh();
  }

  private async refresh(): Promise<string> {
    const { clientId, clientSecret, refreshToken, orgId, accountsUrl, store } = this.config;

    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    });

    let data: Record<string, unknown>;

    try {
      const res = await xior.post<Record<string, unknown>>(accountsUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      data = res.data;
    } catch (err) {
      if (isXiorError(err)) throw SDKException.fromXiorError(err);
      throw err;
    }

    if (typeof data.access_token !== 'string') {
      throw new SDKException('Token refresh failed');
    }

    const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 3600;
    const expiresAt = Date.now() + expiresIn * 1000;

    await store.saveToken({
      accessToken: data.access_token,
      refreshToken,
      expiresAt,
      clientId,
      orgId,
    });

    this.accessToken = data.access_token;
    this.expiresAt = expiresAt;

    return data.access_token;
  }

  async remove(): Promise<boolean> {
    await this.config.store.deleteToken(this.config.clientId, this.config.orgId);
    this.accessToken = null;
    this.expiresAt = null;
    return true;
  }
}
