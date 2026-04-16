import type { AddressWithoutCoordsWithCompany } from './address';
import type { CustomField } from './customfield';
import type { Item } from './item';

export interface SalesOrder {
  salesorder_id: string;
  is_viewed_in_mail: boolean;
  mail_first_viewed_time: string;
  mail_last_viewed_time: string;
  documents: any[];
  zcrm_potential_id: string;
  zcrm_potential_name: string;
  salesorder_number: string;
  date: Date;
  offline_created_date_with_time: string;
  tracking_url: string;
  has_discount: boolean;
  status: string;
  color_code: string;
  current_sub_status_id: string;
  current_sub_status: string;
  sub_statuses: any[];
  shipment_date: string;
  reference_number: string;
  customer_id: string;
  customer_name: string;
  contact_persons: any[];
  contact_persons_associated: any[];
  contact_person_details: ContactPersonDetail[];
  source: string;
  contact_category: string;
  exceptions: any[];
  has_shipping_address: boolean;
  currency_id: string;
  currency_code: string;
  currency_symbol: string;
  exchange_rate: number;
  is_discount_before_tax: boolean;
  discount_type: string;
  estimate_id: string;
  delivery_method: string;
  delivery_method_id: string;
  vat_treatment: string;
  is_inclusive_tax: boolean;
  tax_rounding: string;
  tax_override_preference: string;
  tds_override_preference: string;
  order_status: string;
  invoiced_status: string;
  paid_status: string;
  shipped_status: string;
  sales_channel: string;
  sales_channel_formatted: string;
  account_identifier: string;
  integration_id: string;
  is_dropshipped: boolean;
  is_backordered: boolean;
  is_manually_fulfilled: boolean;
  can_manually_fulfill: boolean;
  has_qty_cancelled: boolean;
  shipping_details: ShippingDetails;
  created_by_email: string;
  created_by_name: string;
  branch_id: string;
  branch_name: string;
  location_id: string;
  location_name: string;
  total_quantity: number;
  line_items: LineItem[];
  entity_tags: string;
  submitter_id: string;
  approver_id: string;
  submitted_date: string;
  submitted_by: string;
  submitted_by_name: string;
  submitted_by_email: string;
  submitted_by_photo_url: string;
  price_precision: number;
  is_emailed: boolean;
  has_unconfirmed_line_item: boolean;
  picklists: any[];
  purchaseorders: any[];
  locations: Location[];
  billing_address_id: string;
  billing_address: AddressWithoutCoordsWithCompany;
  shipping_address_id: string;
  shipping_address: AddressWithoutCoordsWithCompany;
  is_test_order: boolean;
  notes: string;
  terms: string;
  payment_terms: number;
  payment_terms_label: string;
  payment_terms_id: string;
  custom_fields: CustomField[];
  custom_field_hash: CustomFieldHash;
  template_id: string;
  template_name: string;
  page_width: string;
  page_height: string;
  orientation: string;
  template_type: string;
  created_time: string;
  last_modified_time: string;
  created_by_id: string;
  created_date: Date;
  last_modified_by_id: string;
  attachment_name: string;
  can_send_in_mail: boolean;
  salesperson_id: string;
  salesperson_name: string;
  merchant_id: string;
  merchant_name: string;
  pickup_location_id: string;
  beat_id: string;
  beat_number: string;
  journey_plan_id: string;
  discount: number;
  discount_applied_on_amount: number;
  is_adv_tracking_in_package: boolean;
  shipping_charge_taxes: any[];
  lock_details: LockDetails;
  locked_actions: any[];
  custom_locks: CustomLock[];
  system_locks: any[];
  shipping_charge_tax_id: string;
  shipping_charge_tax_name: string;
  shipping_charge_tax_type: string;
  shipping_charge_tax_percentage: string;
  shipping_charge_tax: string;
  bcy_shipping_charge_tax: string;
  shipping_charge_exclusive_of_tax: number;
  shipping_charge_inclusive_of_tax: number;
  shipping_charge_tax_formatted: string;
  shipping_charge_exclusive_of_tax_formatted: string;
  shipping_charge_inclusive_of_tax_formatted: string;
  shipping_charge: number;
  bcy_shipping_charge: number;
  adjustment: number;
  bcy_adjustment: number;
  adjustment_description: string;
  roundoff_value: number;
  transaction_rounding_type: string;
  rounding_mode: string;
  bcy_rounding_mode: string;
  sub_total: number;
  bcy_sub_total: number;
  sub_total_inclusive_of_tax: number;
  sub_total_exclusive_of_discount: number;
  discount_total: number;
  bcy_discount_total: number;
  discount_percent: number;
  tax_total: number;
  bcy_tax_total: number;
  total: number;
  computation_type: string;
  bcy_total: number;
  taxes: Tax[];
  tds_calculation_type: string;
  packages: any[];
  so_cycle_preference: SoCyclePreference;
  invoices: any[];
  can_show_kit_return: boolean;
  is_kit_partial_return: boolean;
  salesreturns: any[];
  payments: any[];
  creditnotes: any[];
  refunds: any[];
  contact: Contact;
  balance: number;
  approvers_list: any[];
  is_scheduled_for_quick_shipment_create: boolean;
  allow_quick_shipment: boolean;
}

export type ListSalesOrder = Pick<
  SalesOrder,
  | 'salesorder_id'
  | 'zcrm_potential_id'
  | 'zcrm_potential_name'
  | 'customer_name'
  | 'customer_id'
  | 'salesorder_number'
  | 'reference_number'
  | 'date'
  | 'shipment_date'
  | 'currency_id'
  | 'currency_code'
  | 'source'
  | 'total'
  | 'bcy_total'
  | 'status'
  | 'order_status'
  | 'invoiced_status'
  | 'paid_status'
  | 'shipped_status'
  | 'sales_channel'
  | 'sales_channel_formatted'
  | 'color_code'
  | 'current_sub_status_id'
  | 'current_sub_status'
  | 'branch_id'
  | 'location_id'
  | 'location_name'
  | 'pickup_location_id'
  | 'salesperson_name'
  | 'is_dropshipped'
  | 'is_backordered'
  | 'is_manually_fulfilled'
  | 'is_scheduled_for_quick_shipment_create'
  | 'created_time'
  | 'last_modified_time'
  | 'is_emailed'
  | 'balance'
  | 'delivery_method'
  | 'delivery_method_id'
  | 'is_viewed_in_mail'
  | 'mail_first_viewed_time'
  | 'mail_last_viewed_time'
> & {
  email?: string;
  company_name?: string;
  quantity?: number;
  quantity_invoiced?: number;
  quantity_packed?: number;
  quantity_shipped?: number;
  order_fulfillment_type?: string;
  total_invoiced_amount?: number;
  shipment_days?: string;
  due_by_days?: string;
  due_in_days?: string;
  delivery_date?: string;
  has_attachment?: boolean;
  tags?: any[];
  cf_source?: string;
  cf_source_unformatted?: string;
};

export interface Contact {
  customer_balance: number;
  credit_limit: number;
  unused_customer_credits: number;
  is_credit_limit_migration_completed: boolean;
}

export interface ContactPersonDetail {
  phone: string;
  mobile: string;
  last_name: string;
  contact_person_id: string;
  first_name: string;
  email: string;
}

export interface CustomFieldHash {
  cf_source: string;
  cf_source_unformatted: string;
}

export interface CustomLock {
  locked_fields: ShippingDetails;
  locked_actions: any[];
  lock_details: LockDetails;
}

export interface LockDetails {
  can_lock: boolean;
}

export interface ShippingDetails {}

type ItemReference = Pick<
  Item,
  | 'item_id'
  | 'sku'
  | 'name'
  | 'description'
  | 'item_type'
  | 'product_type'
  | 'image_name'
  | 'image_type'
  | 'unit'
  | 'unit_group_id'
  | 'is_returnable'
  | 'is_combo_product'
  | 'combo_type'
  | 'track_serial_number'
  | 'track_batch_number'
  | 'is_modifier_item'
>;

export interface LineItem extends ItemReference {
  line_item_id: string;
  variant_id: string;
  product_id: string;
  line_item_category: string;
  attribute_name1: string;
  attribute_name2: string;
  attribute_name3: string;
  attribute_option_name1: string;
  attribute_option_name2: string;
  attribute_option_name3: string;
  attribute_option_data1: string;
  attribute_option_data2: string;
  attribute_option_data3: string;
  group_name: string;
  item_order: number;
  bcy_rate: number;
  rate: number;
  sales_rate: number;
  quantity: number;
  quantity_manuallyfulfilled: number;
  base_unit_id: string;
  unit_conversion_id: string;
  conversion_rate: number;
  pricebook_id: string;
  header_id: string;
  header_name: string;
  discount_amount: number;
  discount: number;
  discounts: any[];
  tax_id: string;
  tax_name: string;
  tax_type: string;
  tax_percentage: number;
  line_item_taxes: LineItemTax[];
  item_total: number;
  item_sub_total: number;
  line_item_type: string;
  is_invoiced: boolean;
  is_unconfirmed_product: boolean;
  tags: any[];
  image_document_id: string;
  document_id: string;
  item_custom_fields: any[];
  custom_field_hash: ShippingDetails;
  quantity_invoiced: number;
  quantity_packed: number;
  quantity_shipped: number;
  quantity_picked: number;
  quantity_backordered: number;
  quantity_dropshipped: number;
  quantity_cancelled: number;
  quantity_delivered: number;
  package_details: PackageDetails;
  quantity_invoiced_cancelled: number;
  quantity_returned: number;
  is_fulfillable: number;
  project_id: string;
  location_id: string;
  location_name: string;
  mapped_items: any[];
}

export interface LineItemTax {
  tax_id: string;
  tax_name: string;
  tax_amount: number;
  tax_percentage: number;
  tax_specific_type: string;
}

export interface PackageDetails {
  length: string;
  width: string;
  height: string;
  weight: number;
  weight_unit: string;
  dimension_unit: string;
}

export interface Location {
  location_id: string;
  location_name: string;
  status: string;
}

export interface SoCyclePreference {
  is_feature_enabled: boolean;
  socycle_status: string;
  can_create_invoice: boolean;
  can_create_package: boolean;
  can_create_shipment: boolean;
  shipment_preference: ShipmentPreference;
  invoice_preference: InvoicePreference;
}

export interface InvoicePreference {
  mark_as_sent: boolean;
  record_payment: boolean;
  payment_mode_id: string;
  payment_account_id: string;
}

export interface ShipmentPreference {
  default_carrier: string;
  send_notification: boolean;
  deliver_shipments: boolean;
}

export interface Tax {
  tax_amount: number;
  tax_name: string;
  tax_amount_formatted: string;
}

export type OrderLineItem = Pick<Item, 'item_id'> &
  Partial<
    Pick<
      Item,
      | 'rate'
      | 'custom_fields'
      | 'sku'
      | 'description'
      | 'tax_type'
      | 'tax_percentage'
      | 'tax_id'
      | 'name'
    >
  > & {
    quantity: number;
    discount?: number;
    [key: string]: any;
  };

export type CreateSalesOrder = Pick<SalesOrder, 'customer_id' | 'salesorder_number'> &
  Partial<
    Pick<
      SalesOrder,
      | 'date'
      | 'discount'
      | 'notes'
      | 'shipping_charge'
      | 'reference_number'
      | 'location_id'
      | 'shipment_date'
      | 'terms'
      | 'is_inclusive_tax'
      | 'billing_address_id'
      | 'shipping_address_id'
    >
  > & {
    line_items: OrderLineItem[];
    custom_shipping_address?: AddressWithoutCoordsWithCompany;
    [key: string]: any;
  };
