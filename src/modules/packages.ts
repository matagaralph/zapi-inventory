import type { ApiClient } from '../client';
import type {
  CreatingPackageRequest,
  CreatingPackageResponse,
  ListAllPackagesResponse,
  RetrievingPackageResponse,
  UpdatingPackageRequest,
  UpdatingPackageResponse,
  DeletingPackageResponse,
  BulkPrintPackagesResponse,
} from '../types/package';

export class PackageModule {
  constructor(private client: ApiClient) {}

  async list(opts?: {
    limit: number;
  }): Promise<ListAllPackagesResponse['packages']> {
    return this.client.getList({
      path: ['packages'],
      limit: opts?.limit,
      extractor: (res: ListAllPackagesResponse) => res.packages ?? [],
    });
  }

  async create(
    data: CreatingPackageRequest
  ): Promise<CreatingPackageResponse['package']> {
    const res = await this.client.post<CreatingPackageResponse>({
      path: ['packages'],
      body: data,
    });
    return res.package;
  }

  async get(packageId: string): Promise<RetrievingPackageResponse['package']> {
    const res = await this.client.get<RetrievingPackageResponse>({
      path: ['packages', packageId],
    });
    return res.package;
  }

  async update(
    packageId: string,
    data: UpdatingPackageRequest
  ): Promise<UpdatingPackageResponse['package']> {
    const res = await this.client.put<UpdatingPackageResponse>({
      path: ['packages', packageId],
      body: data,
    });
    return res.package;
  }

  async delete(packageId: string): Promise<DeletingPackageResponse> {
    return this.client.delete({
      path: ['packages', packageId],
    });
  }

  async bulkPrint(params: {
    package_ids: string;
  }): Promise<BulkPrintPackagesResponse> {
    return this.client.get({
      path: ['packages', 'bulkprint'],
      params,
    });
  }
}
