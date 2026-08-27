import type {
  BulkPrintPackagesResponse,
  CreatePackageRequest,
  CreatePackageResponse,
  GetPackageResponse,
  ListPackagesResponse,
  UpdatePackageRequest,
  UpdatePackageResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Packages {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListPackagesResponse['packagea']> {
    const { packagea } = await this.http.get<ListPackagesResponse>({
      path: ['packages'],
      query: { ...params },
    })
    return packagea
  }

  async create(
    salesorderId: string,
    data: CreatePackageRequest
  ): Promise<CreatePackageResponse['package']> {
    const { package: pkg } = await this.http.post<CreatePackageResponse>({
      path: ['packages'],
      query: { salesorder_id: salesorderId },
      body: data,
    })
    return pkg
  }

  async get(packageId: string): Promise<GetPackageResponse['package']> {
    const { package: pkg } = await this.http.get<GetPackageResponse>({
      path: ['packages', packageId],
    })
    return pkg
  }

  async update(
    packageId: string,
    data: UpdatePackageRequest
  ): Promise<UpdatePackageResponse['package']> {
    const { package: pkg } = await this.http.put<UpdatePackageResponse>({
      path: ['packages', packageId],
      body: data,
    })
    return pkg
  }

  async delete(packageId: string): Promise<void> {
    await this.http.delete({ path: ['packages', packageId] })
  }

  async bulkPrint(packageIds: string): Promise<BulkPrintPackagesResponse> {
    return this.http.get<BulkPrintPackagesResponse>({
      path: ['packages', 'print'],
      query: { package_ids: packageIds },
    })
  }
}
