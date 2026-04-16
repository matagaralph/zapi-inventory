import { HttpClient } from '@/client/index.ts';

import { OAuthToken } from './auth/oauth.ts';
import { FileTokenStore } from './auth/store/file-store.ts';
import type { TokenStore } from './auth/store/token-store.ts';
import { ContactResource } from './modules/contact.ts';
import { ItemResource } from './modules/item.ts';
import { PackageResource } from './modules/package.ts';
import { SalesOrderResource } from './modules/salesorder.ts';
import { ShipmentOrderResource } from './modules/shipmentorder.ts';

type DC = 'com' | 'eu' | 'in' | 'com.au' | 'jp' | 'ca' | 'com.cn' | 'sa';

export interface SDKConfig {
  client: { id: string; secret: string };
  orgId: string;
  refreshToken: string;
  dc?: DC;
  timeout?: number;
  store?: TokenStore;
}

export class ZohoInventory {
  private readonly auth: OAuthToken;

  readonly http: HttpClient;
  readonly items: ItemResource;
  readonly contacts: ContactResource;
  readonly packages: PackageResource;
  readonly salesorders: SalesOrderResource;
  readonly shipmentorders: ShipmentOrderResource;

  constructor(config: SDKConfig) {
    const tld = config.dc ?? 'com';
    const store = config.store ?? new FileTokenStore();
    const apiUrl = `https://www.zohoapis.${tld}/inventory/v1`;
    const accountsUrl = `https://accounts.zoho.${tld}/oauth/v2/token`;

    this.auth = new OAuthToken({
      clientId: config.client.id,
      clientSecret: config.client.secret,
      refreshToken: config.refreshToken,
      orgId: config.orgId,
      accountsUrl,
      store,
    });

    this.http = new HttpClient(apiUrl, {
      timeout: config.timeout,
      authInterceptor: async (reqConfig) => {
        const token = await this.auth.getAccessToken();
        reqConfig.headers ??= {};
        reqConfig.headers['Authorization'] = `Zoho-oauthtoken ${token}`;
        reqConfig.params ??= {};
        reqConfig.params['organization_id'] = config.orgId;
        return reqConfig;
      },
    });

    this.items = new ItemResource(this.http);
    this.contacts = new ContactResource(this.http);
    this.packages = new PackageResource(this.http);
    this.salesorders = new SalesOrderResource(this.http);
    this.shipmentorders = new ShipmentOrderResource(this.http);
  }
}
