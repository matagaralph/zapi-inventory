import { ApiClient } from '../client';
import type { ServiceConfig } from '../client/types';
import { BillModule } from './bills';
import { CompositeItemModule } from './compositeitems';
import { ContactModule } from './contacts';
import { ContactPersonModule } from './contactpersons';
import { CreditNoteModule } from './creditnotes';
import { CurrencyModule } from './curriencies';
import { CustomerPaymentModule } from './customerpayments';
import { InvoiceModule } from './invoices';
import { ItemModule } from './items';
import { ItemAdjustmentModule } from './itemadjustments';
import { ItemGroupModule } from './itemgroups';
import { LocationModule } from './locations';
import { OrganizationModule } from './organizations';
import { PackageModule } from './packages';
import { PriceListModule } from './pricelists';
import { PurchaseOrderModule } from './purchaseorders';
import { PurchaseReceiveModule } from './purchasereceives';
import { RetainerInvoiceModule } from './retainer-invoices';
import { SalesOrderModule } from './salesorders';
import { SalesReturnModule } from './salesreturns';
import { ShipmentOrderModule } from './shipmentorders';
import { TaxModule } from './taxes';
import { TransferOrderModule } from './transferorders';
import { UserModule } from './users';
import { VendorCreditModule } from './vendorcredits';

export class ZohoInventory {
  /** Direct access to the underlying API client. Useful for crafting custom requests when the SDK lacks a wrapper. */
  public readonly apiClient: ApiClient;

  public readonly bills: BillModule;
  public readonly compositeitems: CompositeItemModule;
  public readonly contacts: ContactModule;
  public readonly contactpersons: ContactPersonModule;
  public readonly creditnotes: CreditNoteModule;
  public readonly currencies: CurrencyModule;
  public readonly customerpayments: CustomerPaymentModule;
  public readonly invoices: InvoiceModule;
  public readonly itemadjustments: ItemAdjustmentModule;
  public readonly itemgroup: ItemGroupModule;
  public readonly items: ItemModule;
  public readonly locations: LocationModule;
  public readonly organizations: OrganizationModule;
  public readonly packages: PackageModule;
  public readonly pricelists: PriceListModule;
  public readonly purchaseorders: PurchaseOrderModule;
  public readonly purchasereceives: PurchaseReceiveModule;
  public readonly retainerinvoices: RetainerInvoiceModule;
  public readonly salesorders: SalesOrderModule;
  public readonly salesreturns: SalesReturnModule;
  public readonly shipmentorders: ShipmentOrderModule;
  public readonly taxes: TaxModule;
  public readonly transferorders: TransferOrderModule;
  public readonly users: UserModule;
  public readonly vendorcredits: VendorCreditModule;

  constructor(config: ServiceConfig) {
    this.apiClient = new ApiClient(config);

    this.bills = new BillModule(this.apiClient);
    this.compositeitems = new CompositeItemModule(this.apiClient);
    this.contacts = new ContactModule(this.apiClient);
    this.contactpersons = new ContactPersonModule(this.apiClient);
    this.creditnotes = new CreditNoteModule(this.apiClient);
    this.currencies = new CurrencyModule(this.apiClient);
    this.customerpayments = new CustomerPaymentModule(this.apiClient);
    this.invoices = new InvoiceModule(this.apiClient);
    this.itemadjustments = new ItemAdjustmentModule(this.apiClient);
    this.itemgroup = new ItemGroupModule(this.apiClient);
    this.items = new ItemModule(this.apiClient);
    this.locations = new LocationModule(this.apiClient);
    this.organizations = new OrganizationModule(this.apiClient);
    this.packages = new PackageModule(this.apiClient);
    this.pricelists = new PriceListModule(this.apiClient);
    this.purchaseorders = new PurchaseOrderModule(this.apiClient);
    this.purchasereceives = new PurchaseReceiveModule(this.apiClient);
    this.retainerinvoices = new RetainerInvoiceModule(this.apiClient);
    this.salesorders = new SalesOrderModule(this.apiClient);
    this.salesreturns = new SalesReturnModule(this.apiClient);
    this.shipmentorders = new ShipmentOrderModule(this.apiClient);
    this.taxes = new TaxModule(this.apiClient);
    this.transferorders = new TransferOrderModule(this.apiClient);
    this.users = new UserModule(this.apiClient);
    this.vendorcredits = new VendorCreditModule(this.apiClient);
  }
}
