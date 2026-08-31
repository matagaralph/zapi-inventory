import type {
  BundlingHistoryResponse,
  CreateAssembliesQuery,
  CreateBundleRequest,
  CreateBundleResponse,
  CreateCompositeItemRequest,
  CreateCompositeItemResponse,
  GetBundleResponse,
  GetCompositeItemResponse,
  ListAssembliesQuery,
  ListCompositeItemsQuery,
  ListCompositeItemsResponse,
  MarkAssemblyAsBuiltResponse,
  MarkAssemblyAsConfirmedResponse,
  UpdateAssemblyQuery,
  UpdateBundleRequest,
  UpdateBundleResponse,
  UpdateCompositeItemRequest,
  UpdateCompositeItemResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'
import type { PartialBy } from '../utils.ts'

export class CompositeItems {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListCompositeItemsQuery
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

  async markAsActive(compositeItemId: string): Promise<void> {
    await this.http.post({
      path: ['compositeitems', compositeItemId, 'active'],
    })
  }

  async markAsInactive(compositeItemId: string): Promise<void> {
    await this.http.post({
      path: ['compositeitems', compositeItemId, 'inactive'],
    })
  }

  async uploadImage(compositeItemId: string, image: Blob): Promise<void> {
    const body = new FormData()
    body.append('image', image)
    await this.http.post({
      path: ['compositeitems', compositeItemId, 'image'],
      body,
    })
  }

  async deleteImage(compositeItemId: string): Promise<void> {
    await this.http.delete({ path: ['compositeitems', compositeItemId, 'image'] })
  }

  async listAssemblies(params: ListAssembliesQuery): Promise<BundlingHistoryResponse['bundles']> {
    const { bundles } = await this.http.get<BundlingHistoryResponse>({
      path: ['bundles'],
      query: params,
    })
    return bundles
  }

  // reference_number is only mandatory when params.ignore_auto_number_generation is true;
  // otherwise Zoho auto-generates it. Zoho's spec always marks it required, so it's relaxed here.
  async createAssembly(
    data: PartialBy<CreateBundleRequest, 'reference_number'>,
    params?: CreateAssembliesQuery
  ): Promise<CreateBundleResponse> {
    return this.http.post<CreateBundleResponse>({
      path: ['bundles'],
      query: params,
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
    params?: UpdateAssemblyQuery
  ): Promise<UpdateBundleResponse['bundle']> {
    const { bundle } = await this.http.put<UpdateBundleResponse>({
      path: ['bundles', bundleId],
      query: params,
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
