import { OAuthToken } from './auth/oauth.ts'
import type { TokenStore } from './auth/token-store.ts'
import { HTTPClient } from './http.ts'
import { Batches } from './modules/batches.ts'
import { Bills } from './modules/bills.ts'
import { CompositeItems } from './modules/compositeitems.ts'
import { ContactPersons } from './modules/contact-persons.ts'
import { Contacts } from './modules/contacts.ts'
import { CreditNotes } from './modules/credit-notes.ts'
import { Currencies } from './modules/currency.ts'
import { CustomerPayments } from './modules/customer-payments.ts'
import { DeliveryChallans } from './modules/delivery-challans.ts'
import { InventoryAdjustments } from './modules/inventoryadjustments.ts'
import { InventoryCounts } from './modules/inventorycounting.ts'
import { Invoices } from './modules/invoices.ts'
import { ItemGroups } from './modules/itemgroups.ts'
import { Items } from './modules/items.ts'
import { LandedCosts } from './modules/landedcosts.ts'
import { Locations } from './modules/locations.ts'
import { MoveOrders } from './modules/moveorders.ts'
import { Organizations } from './modules/organizations.ts'
import { Packages } from './modules/packages.ts'
import { Picklists } from './modules/picklists.ts'
import { PriceLists } from './modules/pricelists.ts'
import { PurchaseOrders } from './modules/purchaseorders.ts'
import { PurchaseReceives } from './modules/purchasereceives.ts'
import { Putaways } from './modules/putaways.ts'
import { Replenishment } from './modules/replenishment.ts'
import { ReportingTags } from './modules/reporting-tags.ts'
import { RetainerInvoices } from './modules/retainer-invoices.ts'
import { SalesOrders } from './modules/salesorders.ts'
import { SalesReturns } from './modules/salesreturns.ts'
import { SerialNumbers } from './modules/serialnumbers.ts'
import { ShipmentOrders } from './modules/shipmentorders.ts'
import { StorageLocations } from './modules/storagelocations.ts'
import { Tasks } from './modules/tasks.ts'
import { Taxes } from './modules/taxes.ts'
import { TransferOrders } from './modules/transferorders.ts'
import { UnitsOfMeasurement } from './modules/unit_of_measurement.ts'
import { Users } from './modules/users.ts'
import { VendorCredits } from './modules/vendor-credits.ts'

export interface ReportMetadata {
  page: number
  per_page: number
  total: string
  total_pages: number
  report_name: string
  applied_filter: string
  sort_column: string
  sort_order: string
}

export type ZohoDataCenter = 'com' | 'eu' | 'in' | 'com.au' | 'jp' | 'ca' | 'com.cn' | 'sa'

export interface ZohoInventoryOptions {
  client: { id: string; secret: string }
  orgId: string
  refreshToken: string
  dc?: ZohoDataCenter
  timeout?: number
  store?: TokenStore
}

function apiUrl(dc: ZohoDataCenter): string {
  return `https://www.zohoapis.${dc}/inventory/v1`
}

function accountsUrl(dc: ZohoDataCenter): string {
  return `https://accounts.zoho.${dc}/oauth/v2/token`
}

export class ZohoInventory {
  private readonly auth: OAuthToken

  readonly http: HTTPClient
  readonly batches: Batches
  readonly bills: Bills
  readonly compositeItems: CompositeItems
  readonly contactPersons: ContactPersons
  readonly contacts: Contacts
  readonly creditNotes: CreditNotes
  readonly currencies: Currencies
  readonly customerPayments: CustomerPayments
  readonly deliveryChallans: DeliveryChallans
  readonly inventoryAdjustments: InventoryAdjustments
  readonly inventoryCounts: InventoryCounts
  readonly invoices: Invoices
  readonly itemGroups: ItemGroups
  readonly items: Items
  readonly landedCosts: LandedCosts
  readonly locations: Locations
  readonly moveOrders: MoveOrders
  readonly organizations: Organizations
  readonly packages: Packages
  readonly picklists: Picklists
  readonly priceLists: PriceLists
  readonly purchaseOrders: PurchaseOrders
  readonly purchaseReceives: PurchaseReceives
  readonly putaways: Putaways
  readonly replenishment: Replenishment
  readonly reportingTags: ReportingTags
  readonly retainerInvoices: RetainerInvoices
  readonly salesOrders: SalesOrders
  readonly salesReturns: SalesReturns
  readonly serialNumbers: SerialNumbers
  readonly shipmentOrders: ShipmentOrders
  readonly storageLocations: StorageLocations
  readonly tasks: Tasks
  readonly taxes: Taxes
  readonly transferOrders: TransferOrders
  readonly unitsOfMeasurement: UnitsOfMeasurement
  readonly users: Users
  readonly vendorCredits: VendorCredits

  constructor(options: ZohoInventoryOptions) {
    const dc = options.dc ?? 'com'

    this.auth = new OAuthToken({
      clientId: options.client.id,
      clientSecret: options.client.secret,
      refreshToken: options.refreshToken,
      orgId: options.orgId,
      accountsUrl: accountsUrl(dc),
      store: options.store,
    })

    this.http = new HTTPClient(apiUrl(dc), {
      timeout: options.timeout,
      authInterceptor: async (config) => {
        config.headers['Authorization'] = `Zoho-oauthtoken ${await this.auth.getAccessToken()}`
        config.params['organization_id'] = options.orgId
        return config
      },
    })

    this.batches = new Batches(this.http)
    this.bills = new Bills(this.http)
    this.compositeItems = new CompositeItems(this.http)
    this.contactPersons = new ContactPersons(this.http)
    this.contacts = new Contacts(this.http)
    this.creditNotes = new CreditNotes(this.http)
    this.currencies = new Currencies(this.http)
    this.customerPayments = new CustomerPayments(this.http)
    this.deliveryChallans = new DeliveryChallans(this.http)
    this.inventoryAdjustments = new InventoryAdjustments(this.http)
    this.inventoryCounts = new InventoryCounts(this.http)
    this.invoices = new Invoices(this.http)
    this.itemGroups = new ItemGroups(this.http)
    this.items = new Items(this.http)
    this.landedCosts = new LandedCosts(this.http)
    this.locations = new Locations(this.http)
    this.moveOrders = new MoveOrders(this.http)
    this.organizations = new Organizations(this.http)
    this.packages = new Packages(this.http)
    this.picklists = new Picklists(this.http)
    this.priceLists = new PriceLists(this.http)
    this.purchaseOrders = new PurchaseOrders(this.http)
    this.purchaseReceives = new PurchaseReceives(this.http)
    this.putaways = new Putaways(this.http)
    this.replenishment = new Replenishment(this.http)
    this.reportingTags = new ReportingTags(this.http)
    this.retainerInvoices = new RetainerInvoices(this.http)
    this.salesOrders = new SalesOrders(this.http)
    this.salesReturns = new SalesReturns(this.http)
    this.serialNumbers = new SerialNumbers(this.http)
    this.shipmentOrders = new ShipmentOrders(this.http)
    this.storageLocations = new StorageLocations(this.http)
    this.tasks = new Tasks(this.http)
    this.taxes = new Taxes(this.http)
    this.transferOrders = new TransferOrders(this.http)
    this.unitsOfMeasurement = new UnitsOfMeasurement(this.http)
    this.users = new Users(this.http)
    this.vendorCredits = new VendorCredits(this.http)
  }

  /**
   * Retrieves report-level metadata for a paginated resource, including
   * pagination details and report context (name, filter, sort order).
   *
   * @experimental
   * @param path - The API path segments for the target resource.
   * @param params - Optional query parameters to include in the request.
   * @returns The report metadata extracted from the response's `page_context`.
   */
  async getReportMetadata(
    path: string[],
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ReportMetadata> {
    const response = await this.http.get<{ page_context: ReportMetadata }>({
      path,
      query: {
        ...params,
        response_option: 2,
      },
    })

    return response.page_context
  }
}
