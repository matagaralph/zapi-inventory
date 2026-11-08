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

/**
 * Zoho Inventory brings to you, the feature "Packages" with which you can create and assign package slip numbers to the line items in your sales orders and keep track of your packages when they are shipped.
 */
export function createPackages(http: HTTPClient) {
  return {
    async list(params?: ListPackagesQuery): Promise<ListPackagesResponse['packages']> {
      const { packages } = await http.get<ListPackagesResponse>({
        path: ['packages'],
        query: { ...params },
      })
      return packages
    },

    async create(
      data: CreatePackageRequest,
      params: CreatePackageQuery
    ): Promise<CreatePackageResponse['package']> {
      const { package: pkg } = await http.post<CreatePackageResponse>({
        path: ['packages'],
        query: params,
        body: data,
      })
      return pkg
    },

    async get(packageId: string): Promise<GetPackageResponse['package']> {
      const { package: pkg } = await http.get<GetPackageResponse>({
        path: ['packages', packageId],
      })
      return pkg
    },

    async update(
      packageId: string,
      data: UpdatePackageRequest
    ): Promise<UpdatePackageResponse['package']> {
      const { package: pkg } = await http.put<UpdatePackageResponse>({
        path: ['packages', packageId],
        body: data,
      })
      return pkg
    },

    async delete(packageId: string): Promise<void> {
      await http.delete({ path: ['packages', packageId] })
    },

    async bulkPrint(params: BulkPrintPackagesQuery): Promise<void> {
      await http.get({
        path: ['packages', 'print'],
        query: params,
      })
    },
  }
}

export type Packages = ReturnType<typeof createPackages>
