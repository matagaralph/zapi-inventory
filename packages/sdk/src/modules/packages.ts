import type {
  BulkPrintPackagesQuery,
  CreatePackageRequest,
  CreatePackageQuery,
  CreatePackageResponse,
  GetPackageResponse,
  ListPackagesQuery,
  ListPackagesResponse,
  UpdatePackageRequest,
  UpdatePackageResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class Packages {
  constructor(private readonly http: HTTPClient) {}

  async list(params?: ListPackagesQuery): Promise<ListPackagesResponse['packagea']> {
    const { packagea } = await this.http.get<ListPackagesResponse>({
      path: ['packages'],
      query: { ...params },
    })
    return packagea
  }

  async create(
    data: CreatePackageRequest,
    params: CreatePackageQuery
  ): Promise<CreatePackageResponse['package']> {
    const { package: pkg } = await this.http.post<CreatePackageResponse>({
      path: ['packages'],
      query: params,
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

  async bulkPrint(params: BulkPrintPackagesQuery): Promise<void> {
    await this.http.get({
      path: ['packages', 'print'],
      query: params,
    })
  }
}
