import type {
  BundlingHistoryResponse,
  CreateBundleRequest,
  CreateBundleResponse,
  CreateCompositeItemRequest,
  CreateCompositeItemResponse,
  GetBundleResponse,
  GetCompositeItemResponse,
  ListCompositeItemsResponse,
  MarkAsActiveResponse,
  MarkAsInactiveResponse,
  MarkAssemblyAsBuiltResponse,
  MarkAssemblyAsConfirmedResponse,
  UpdateBundleRequest,
  UpdateBundleResponse,
  UpdateCompositeItemRequest,
  UpdateCompositeItemResponse,
  UploadCompositeItemImageResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class CompositeItems {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListCompositeItemsResponse['composite_items']> {
    const { composite_items } = await this.http.get<ListCompositeItemsResponse>({
      path: ['compositeitems'],
      query: params,
    })
    return composite_items
  }

  async create(
    data: CreateCompositeItemRequest
  ): Promise<CreateCompositeItemResponse['composite_item']> {
    const { composite_item } = await this.http.post<CreateCompositeItemResponse>({
      path: ['compositeitems'],
      body: data,
    })
    return composite_item
  }

  async get(compositeItemId: string): Promise<GetCompositeItemResponse> {
    return this.http.get<GetCompositeItemResponse>({ path: ['compositeitems', compositeItemId] })
  }

  async update(
    compositeItemId: string,
    data: UpdateCompositeItemRequest
  ): Promise<UpdateCompositeItemResponse['composite_item']> {
    const { composite_item } = await this.http.put<UpdateCompositeItemResponse>({
      path: ['compositeitems', compositeItemId],
      body: data,
    })
    return composite_item
  }

  async delete(compositeItemId: string): Promise<void> {
    await this.http.delete({ path: ['compositeitems', compositeItemId] })
  }

  async markAsActive(compositeItemId: string): Promise<MarkAsActiveResponse> {
    return this.http.post<MarkAsActiveResponse>({
      path: ['compositeitems', compositeItemId, 'active'],
    })
  }

  async markAsInactive(compositeItemId: string): Promise<MarkAsInactiveResponse> {
    return this.http.post<MarkAsInactiveResponse>({
      path: ['compositeitems', compositeItemId, 'inactive'],
    })
  }

  async uploadImage(
    compositeItemId: string,
    image: Blob
  ): Promise<UploadCompositeItemImageResponse> {
    const body = new FormData()
    body.append('image', image)
    return this.http.post<UploadCompositeItemImageResponse>({
      path: ['compositeitems', compositeItemId, 'image'],
      body,
    })
  }

  async deleteImage(compositeItemId: string): Promise<void> {
    await this.http.delete({ path: ['compositeitems', compositeItemId, 'image'] })
  }

  async listAssemblies(
    compositeItemId: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<BundlingHistoryResponse['bundles']> {
    const { bundles } = await this.http.get<BundlingHistoryResponse>({
      path: ['bundles'],
      query: { composite_item_id: compositeItemId, ...params },
    })
    return bundles
  }

  async createAssembly(
    data: CreateBundleRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<CreateBundleResponse> {
    return this.http.post<CreateBundleResponse>({
      path: ['bundles'],
      query: { ignore_auto_number_generation: ignoreAutoNumberGeneration },
      body: data,
    })
  }

  async getAssembly(bundleId: string): Promise<GetBundleResponse['bundle']> {
    const { bundle } = await this.http.get<GetBundleResponse>({ path: ['bundles', bundleId] })
    return bundle
  }

  async updateAssembly(
    bundleId: string,
    data: UpdateBundleRequest,
    ignoreAutoNumberGeneration?: boolean
  ): Promise<UpdateBundleResponse['bundle']> {
    const { bundle } = await this.http.put<UpdateBundleResponse>({
      path: ['bundles', bundleId],
      query: { ignore_auto_number_generation: ignoreAutoNumberGeneration },
      body: data,
    })
    return bundle
  }

  async deleteAssembly(bundleId: string): Promise<void> {
    await this.http.delete({ path: ['bundles', bundleId] })
  }

  async markAssemblyAsBuilt(bundleId: string): Promise<MarkAssemblyAsBuiltResponse['bundle']> {
    const { bundle } = await this.http.post<MarkAssemblyAsBuiltResponse>({
      path: ['bundles', bundleId, 'bundled'],
    })
    return bundle
  }

  async markAssemblyAsConfirmed(
    bundleId: string
  ): Promise<MarkAssemblyAsConfirmedResponse['bundle']> {
    const { bundle } = await this.http.post<MarkAssemblyAsConfirmedResponse>({
      path: ['bundles', bundleId, 'confirmed'],
    })
    return bundle
  }
}
