import type { CreateSalesOrderRequest, CustomShippingAddress } from '@zapi-inventory/typegen'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { apiRequests, createZohoFetch, json } from '../../test/fetch.ts'
import { MODULE_INVENTORY } from '../../test/module-inventory.ts'
import { zAPI } from '../client.ts'

type OperationResult = object | string | undefined
type Operation = (...args: string[]) => Promise<OperationResult>

// Only used to drive every operation generically. The arguments are placeholders, so the
// parameter types the guard claims are never relied upon beyond "callable".
function isOperation(value: unknown): value is Operation {
  return typeof value === 'function'
}

function createInventory(body = json({})) {
  const zohoFetch = createZohoFetch(() => body.clone())
  const inventory = zAPI({
    client: { id: 'client-id', secret: 'client-secret' },
    orgId: 'org-id',
    refreshToken: 'refresh-token',
    fetch: zohoFetch.fetch,
  })
  return { inventory, requests: zohoFetch.requests }
}

function resourceEntries(inventory: ReturnType<typeof zAPI>) {
  return Object.entries(MODULE_INVENTORY).map(([name, operations]) => {
    const resource = Object.entries<unknown>(inventory).find(([key]) => key === name)?.[1]
    return { name, operations, resource }
  })
}

describe('module inventory', () => {
  const { inventory } = createInventory()

  test.each(resourceEntries(inventory))(
    '$name keeps every operation',
    ({ resource, operations }) => {
      expect(resource).toBeTypeOf('object')
      expect(Object.keys(Object(resource)).sort()).toEqual(operations)
    }
  )

  test('covers all 543 operations', () => {
    const total = Object.values(MODULE_INVENTORY).reduce((sum, ops) => sum + ops.length, 0)
    expect(total).toBe(543)
  })
})

describe('every operation', () => {
  const cases = Object.entries(MODULE_INVENTORY).flatMap(([name, operations]) =>
    operations.map((operation) => ({ label: `${name}.${operation}`, name, operation }))
  )

  test.each(cases)(
    '$label sends one authenticated, organisation-scoped API request',
    async ({ name, operation }) => {
      const { inventory, requests } = createInventory()
      const resource = Object.entries<unknown>(inventory).find(([key]) => key === name)?.[1]
      const method = Object.entries<unknown>(Object(resource)).find(
        ([key]) => key === operation
      )?.[1]
      if (!isOperation(method)) throw new Error(`${name}.${operation} is not a function`)

      await method('arg-1', 'arg-2', 'arg-3', 'arg-4')

      const sent = apiRequests(requests)
      expect(sent).toHaveLength(1)
      const url = new URL(sent[0]?.url ?? '')
      expect(url.origin + url.pathname).toMatch(/^https:\/\/www\.zohoapis\.com\/inventory\/v1\//)
      expect(url.searchParams.get('organization_id')).toBe('org-id')
      expect(sent[0]?.headers.get('authorization')).toBe('Zoho-oauthtoken access-token')
    }
  )
})

/**
 * The vendored Zoho specs named these response root keys wrongly (`sales_order`,
 * `shipment_order`, `purchase_order`, `purchase_receive` and the typo `packagea`), so the SDK
 * read a key Zoho never sends and these operations always resolved to `undefined`.
 *
 * @see https://www.zoho.com/inventory/api/v1/salesorders/#create-a-sales-order
 * @see https://www.zoho.com/inventory/api/v1/shipmentorders/#create-a-shipment-order
 * @see https://www.zoho.com/inventory/api/v1/packages/#list-all-packages
 * @see https://www.zoho.com/inventory/api/v1/purchaseorders/#create-a-purchase-order
 * @see https://www.zoho.com/inventory/api/v1/purchasereceives/#create-a-purchase-receive
 */
describe('response root keys Zoho actually sends', () => {
  const cases = [
    { name: 'salesorders', operation: 'create', key: 'salesorder' },
    { name: 'salesorders', operation: 'update', key: 'salesorder' },
    { name: 'shipmentorders', operation: 'create', key: 'shipmentorder' },
    { name: 'shipmentorders', operation: 'get', key: 'shipmentorder' },
    { name: 'packages', operation: 'list', key: 'packages' },
    { name: 'purchaseorders', operation: 'create', key: 'purchaseorder' },
    { name: 'purchaseorders', operation: 'get', key: 'purchaseorder' },
    { name: 'purchaseorders', operation: 'update', key: 'purchaseorder' },
    { name: 'purchasereceives', operation: 'create', key: 'purchasereceive' },
    { name: 'purchasereceives', operation: 'get', key: 'purchasereceive' },
    { name: 'purchasereceives', operation: 'update', key: 'purchasereceive' },
  ].map((entry) => ({ ...entry, label: `${entry.name}.${entry.operation}` }))

  test.each(cases)('$label unwraps $key', async ({ name, operation, key }) => {
    const payload = { id: `${name}-1` }
    const { inventory } = createInventory(json({ code: 0, message: 'success', [key]: payload }))
    const resource = Object.entries<unknown>(inventory).find(([entry]) => entry === name)?.[1]
    const method = Object.entries<unknown>(Object(resource)).find(
      ([entry]) => entry === operation
    )?.[1]
    if (!isOperation(method)) throw new Error(`${name}.${operation} is not a function`)

    await expect(method('arg-1', 'arg-2', 'arg-3')).resolves.toEqual(payload)
  })
})

describe('response extraction', () => {
  test('salesorders.list unwraps the salesorders array', async () => {
    const { inventory, requests } = createInventory(
      json({ code: 0, salesorders: [{ salesorder_id: '1' }], page_context: { page: 1 } })
    )

    await expect(inventory.salesorders.list({ page: 1 })).resolves.toEqual([{ salesorder_id: '1' }])
    expect(apiRequests(requests)[0]?.method).toBe('GET')
  })

  test('salesorders.get unwraps the salesorder object', async () => {
    const { inventory, requests } = createInventory(json({ salesorder: { salesorder_id: '7' } }))

    await expect(inventory.salesorders.get('7')).resolves.toEqual({ salesorder_id: '7' })
    expect(new URL(apiRequests(requests)[0]?.url ?? '').pathname).toBe(
      '/inventory/v1/salesorders/7'
    )
  })

  test('salesorders.create posts the body with query params and unwraps salesorder', async () => {
    const { inventory, requests } = createInventory(json({ salesorder: { salesorder_id: '9' } }))

    await expect(
      inventory.salesorders.create(
        { customer_id: 'c-1', line_items: [] },
        { ignore_auto_number_generation: false }
      )
    ).resolves.toEqual({ salesorder_id: '9' })

    const [request] = apiRequests(requests)
    expect(request?.method).toBe('POST')
    expect(new URL(request?.url ?? '').searchParams.get('ignore_auto_number_generation')).toBe(
      'false'
    )
    expect(await request?.json()).toEqual({ customer_id: 'c-1', line_items: [] })
  })

  /**
   * Dropshipping orders ship to the end customer, not to an address saved on the contact. Zoho
   * accepts a one-off address in `custom_shipping_address`, but its spec omits the field.
   */
  test('salesorders.create accepts an optional custom_shipping_address for dropshipping', async () => {
    expectTypeOf<CreateSalesOrderRequest['custom_shipping_address']>().toEqualTypeOf<
      CustomShippingAddress | undefined
    >()
    expectTypeOf<CustomShippingAddress>().toEqualTypeOf<{
      attention: string
      company_name?: string
      address: string
      street2?: string
      city: string
      state?: string
      zip: string
      country: string
      phone?: string
    }>()

    const { inventory, requests } = createInventory(json({ salesorder: { salesorder_id: '9' } }))
    const address: CustomShippingAddress = {
      attention: 'Anna Schmidt',
      company_name: 'Schmidt GmbH',
      address: 'Leopoldstraße 12',
      street2: '3. OG',
      city: 'München',
      state: 'BY',
      zip: '80802',
      country: 'Germany',
      phone: '+49 89 1234567',
    }

    await inventory.salesorders.create({
      customer_id: 'c-1',
      line_items: [],
      custom_shipping_address: address,
    })

    expect(await apiRequests(requests)[0]?.json()).toEqual({
      customer_id: 'c-1',
      line_items: [],
      custom_shipping_address: address,
    })
  })

  test('salesorders.markAsConfirmed posts to the status path and resolves to undefined', async () => {
    const { inventory, requests } = createInventory(json({ code: 0, message: 'confirmed' }))

    await expect(inventory.salesorders.markAsConfirmed('5')).resolves.toBeUndefined()
    expect(new URL(apiRequests(requests)[0]?.url ?? '').pathname).toBe(
      '/inventory/v1/salesorders/5/status/confirmed'
    )
  })

  test('salesorders.bulkConfirm resolves to the whole response', async () => {
    const response = { code: 0, message: 'done', data: [] }
    const { inventory } = createInventory(json(response))

    await expect(inventory.salesorders.bulkConfirm({ salesorder_ids: '1,2' })).resolves.toEqual(
      response
    )
  })

  test('shipmentorders.create and purchaseorders.list unwrap their root keys', async () => {
    const shipment = createInventory(json({ shipmentorder: { shipment_id: 's-1' } }))
    const purchase = createInventory(json({ purchaseorders: [{ purchaseorder_id: 'p-1' }] }))

    await expect(
      shipment.inventory.shipmentorders.create('so-1', 'pk-1', {
        shipment_number: 'SH-1',
        date: '2026-01-01',
        delivery_method: 'Courier',
        tracking_number: 'TRK-1',
      })
    ).resolves.toEqual({ shipment_id: 's-1' })
    const url = new URL(apiRequests(shipment.requests)[0]?.url ?? '')
    expect(url.searchParams.get('salesorder_id')).toBe('so-1')
    expect(url.searchParams.get('package_ids')).toBe('pk-1')
    await expect(purchase.inventory.purchaseorders.list()).resolves.toEqual([
      { purchaseorder_id: 'p-1' },
    ])
  })

  test('items.uploadImage sends the image as multipart form data', async () => {
    const { inventory, requests } = createInventory(json({ code: 0 }))

    await inventory.items.uploadImage('1', new Blob(['png-bytes'], { type: 'image/png' }))

    const file = (await apiRequests(requests)[0]?.formData())?.get('image')
    expect(file instanceof Blob ? await file.text() : undefined).toBe('png-bytes')
  })

  test('items.getImage resolves to the downloaded Blob', async () => {
    const { inventory } = createInventory(
      new Response(new Uint8Array([1, 2, 3]), { headers: { 'content-type': 'image/jpeg' } })
    )

    const image = await inventory.items.getImage('1', true)

    expect(image).toBeInstanceOf(Blob)
    expect(new Uint8Array(await image.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]))
  })

  test('internal.getCountries defaults the language and unwraps results', async () => {
    const { inventory, requests } = createInventory(json({ results: [{ country_code: 'ZA' }] }))

    await expect(inventory.internal.getCountries()).resolves.toEqual([{ country_code: 'ZA' }])
    const url = new URL(apiRequests(requests)[0]?.url ?? '')
    expect(url.pathname).toBe('/inventory/v1/meta/countries')
    expect(url.searchParams.get('languagecode')).toBe('en')
  })

  test('internal.getReportMetadata requests response_option 2 and unwraps page_context', async () => {
    const { inventory, requests } = createInventory(json({ page_context: { page: 3 } }))

    await expect(
      inventory.internal.getReportMetadata(['salesorders'], { filter_by: 'Status.All' })
    ).resolves.toEqual({ page: 3 })
    const url = new URL(apiRequests(requests)[0]?.url ?? '')
    expect(url.pathname).toBe('/inventory/v1/salesorders')
    expect(url.searchParams.get('filter_by')).toBe('Status.All')
    expect(url.searchParams.get('response_option')).toBe('2')
  })
})
