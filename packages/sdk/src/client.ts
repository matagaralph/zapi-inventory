import { createOAuthToken } from './auth/oauth.ts'
import type { TokenStore } from './auth/token-store.ts'
import type { FetchFunction } from './http.ts'
import { createHTTPClient } from './http.ts'
import { createBatches } from './modules/batches.ts'
import { createBills } from './modules/bills.ts'
import { createCompositeItems } from './modules/compositeitems.ts'
import { createContactPersons } from './modules/contact-persons.ts'
import { createContacts } from './modules/contacts.ts'
import { createCreditNotes } from './modules/credit-notes.ts'
import { createCurrencies } from './modules/currency.ts'
import { createCustomerPayments } from './modules/customer-payments.ts'
import { createDeliveryChallans } from './modules/delivery-challans.ts'
import { createInventoryAdjustments } from './modules/inventoryadjustments.ts'
import { createInventoryCounts } from './modules/inventorycounting.ts'
import { createInternal } from './modules/internal.ts'
import { createInvoices } from './modules/invoices.ts'
import { createItemGroups } from './modules/itemgroups.ts'
import { createItems } from './modules/items.ts'
import { createLandedCosts } from './modules/landedcosts.ts'
import { createLocations } from './modules/locations.ts'
import { createMoveOrders } from './modules/moveorders.ts'
import { createOrganizations } from './modules/organizations.ts'
import { createPackages } from './modules/packages.ts'
import { createPicklists } from './modules/picklists.ts'
import { createPriceLists } from './modules/pricelists.ts'
import { createPurchaseOrders } from './modules/purchaseorders.ts'
import { createPurchaseReceives } from './modules/purchasereceives.ts'
import { createPutaways } from './modules/putaways.ts'
import { createReplenishment } from './modules/replenishment.ts'
import { createReportingTags } from './modules/reporting-tags.ts'
import { createRetainerInvoices } from './modules/retainer-invoices.ts'
import { createSalesOrders } from './modules/salesorders.ts'
import { createSalesReturns } from './modules/salesreturns.ts'
import { createSerialNumbers } from './modules/serialnumbers.ts'
import { createShipmentOrders } from './modules/shipmentorders.ts'
import { createStorageLocations } from './modules/storagelocations.ts'
import { createTasks } from './modules/tasks.ts'
import { createTaxes } from './modules/taxes.ts'
import { createTransferOrders } from './modules/transferorders.ts'
import { createUnitsOfMeasurement } from './modules/unit_of_measurement.ts'
import { createUsers } from './modules/users.ts'
import { createVendorCredits } from './modules/vendor-credits.ts'

export type ZohoDataCenter = 'com' | 'eu' | 'in' | 'com.au' | 'jp' | 'ca' | 'com.cn' | 'sa'

/** Configuration for {@link zAPI}. */
export interface ZAPIOptions {
  /** OAuth client credentials from the Zoho Developer Console. */
  client: { id: string; secret: string }
  /** The Zoho Inventory organisation ID every request is scoped to. */
  orgId: string
  /** A permanent OAuth 2.0 refresh token, exchanged for short-lived access tokens. */
  refreshToken: string
  /** The Zoho data centre to use. Defaults to `com`. */
  dc?: ZohoDataCenter
  /**
   * Milliseconds before an API request or token refresh is aborted. Defaults to `10000`, and `0`
   * disables the timeout.
   */
  timeout?: number
  /**
   * How many times a failed API request is retried, one second apart. `429` responses are
   * retried for every method, but `5xx` responses only for `GET`, `PUT` and `DELETE`. Defaults to
   * `3`, and `0` disables retries.
   */
  retryTimes?: number
  /** Persists access tokens. Defaults to a store private to this client, kept in memory. */
  store?: TokenStore
  /**
   * The `fetch` implementation used for both API and OAuth requests. Defaults to
   * `globalThis.fetch`.
   */
  fetch?: FetchFunction
}

/** @deprecated Use {@link ZAPIOptions}. */
export type ZohoInventoryOptions = ZAPIOptions

function apiUrl(dc: ZohoDataCenter): string {
  return `https://www.zohoapis.${dc}/inventory/v1`
}

function accountsUrl(dc: ZohoDataCenter): string {
  return `https://accounts.zoho.${dc}/oauth/v2/token`
}

/**
 * Creates a Zoho Inventory client. Each client owns its own HTTP client, token cache and
 * in-flight token refresh, so several clients can run side by side without sharing state.
 *
 * @example
 * ```ts
 * const inventory = zAPI({
 *   client: { id: 'client-id', secret: 'client-secret' },
 *   orgId: 'organisation-id',
 *   refreshToken: 'refresh-token',
 * })
 *
 * const orders = await inventory.salesorders.list()
 * ```
 */
export function zAPI(options: ZAPIOptions) {
  const dc = options.dc ?? 'com'

  const auth = createOAuthToken({
    clientId: options.client.id,
    clientSecret: options.client.secret,
    refreshToken: options.refreshToken,
    orgId: options.orgId,
    accountsUrl: accountsUrl(dc),
    store: options.store,
    fetch: options.fetch,
    timeout: options.timeout,
  })

  const http = createHTTPClient(apiUrl(dc), {
    timeout: options.timeout,
    retryTimes: options.retryTimes,
    fetch: options.fetch,
    authInterceptor: async (config) => {
      config.headers['Authorization'] = `Zoho-oauthtoken ${await auth.getAccessToken()}`
      config.params['organization_id'] = options.orgId
      return config
    },
  })

  return {
    /** Sends requests to endpoints the SDK does not wrap yet. */
    http,
    batches: createBatches(http),
    bills: createBills(http),
    compositeitems: createCompositeItems(http),
    contactpersons: createContactPersons(http),
    contacts: createContacts(http),
    creditnotes: createCreditNotes(http),
    currencies: createCurrencies(http),
    customerpayments: createCustomerPayments(http),
    deliverychallans: createDeliveryChallans(http),
    inventoryadjustments: createInventoryAdjustments(http),
    inventorycounts: createInventoryCounts(http),
    internal: createInternal(http),
    invoices: createInvoices(http),
    itemgroups: createItemGroups(http),
    items: createItems(http),
    landedcosts: createLandedCosts(http),
    locations: createLocations(http),
    moveorders: createMoveOrders(http),
    organizations: createOrganizations(http),
    packages: createPackages(http),
    picklists: createPicklists(http),
    pricelists: createPriceLists(http),
    purchaseorders: createPurchaseOrders(http),
    purchasereceives: createPurchaseReceives(http),
    putaways: createPutaways(http),
    replenishment: createReplenishment(http),
    reportingtags: createReportingTags(http),
    retainerinvoices: createRetainerInvoices(http),
    salesorders: createSalesOrders(http),
    salesreturns: createSalesReturns(http),
    serialnumbers: createSerialNumbers(http),
    shipmentorders: createShipmentOrders(http),
    storagelocations: createStorageLocations(http),
    tasks: createTasks(http),
    taxes: createTaxes(http),
    transferorders: createTransferOrders(http),
    unitsofmeasurement: createUnitsOfMeasurement(http),
    users: createUsers(http),
    vendorcredits: createVendorCredits(http),
  }
}

/** A Zoho Inventory client created by {@link zAPI}. */
export type ZAPI = ReturnType<typeof zAPI>
