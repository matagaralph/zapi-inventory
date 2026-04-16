import type { HttpClient } from '@/client';
import { MODULES } from '@/core/constants';
import type { Package } from '@/types/package';

export class PackageResource {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  async get(contactId: string): Promise<Package> {
    const res = await this.http.get<{ package: Package }>({
      path: [MODULES.PACKAGE.PATH, contactId],
    });
    return res[MODULES.PACKAGE.RESPONSE_KEY.SINGULAR];
  }

  delete(packageId: string) {
    return this.http.delete({
      path: [MODULES.PACKAGE.RESPONSE_KEY.SINGULAR, packageId],
    });
  }
}
