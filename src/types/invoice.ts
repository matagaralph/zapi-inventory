import type { AddressWithoutCoordsWithCompany, AddressWithoutId } from './address';
import type { Item } from './item';

export interface Invoice {
  invoice_id: string;
  channel_invoice_id: string;
  account_identifier: string;
  invoice_number: string;
  date: string;
  due_date: string;
  issued_date: string;
  offline_created_date_with_time: string;
  customer_id: string;
  customer_name: string;
  customer_custom_fields: any[];
  customer_custom_field_hash: CustomFieldHash;
  email: string;
  currency_id: string;
  invoice_source: string;
  currency_code: string;
  currency_symbol: string;
  currency_name_formatted: string;
  status: string;
  unprocessed_payment_amount: number;
  custom_fields: any[];
  custom_field_hash: CustomFieldHash;
  recurring_invoice_id: string;
  is_last_child_invoice: boolean;
  payment_terms: number;
  payment_terms_label: string;
  payment_terms_id: string;
  invoice_installments: any[];
  early_payment_discount_percentage: number;
  early_payment_discount_due_days: string;
  early_payment_discount_amount: number;
  payment_reminder_enabled: boolean;
  payment_made: number;
  zcrm_potential_id: string;
  zcrm_potential_name: string;
  reference_number: string;
  is_early_payment_discount_applicable: boolean;
  lock_details: LockDetails;
  locked_actions: any[];
  custom_locks: CustomLock[];
  system_locks: any[];
  can_show_kit_return: boolean;
  is_kit_partial_return: boolean;
  line_items: LineItem[];
  total_retention_amount: number;
  retention_items: any[];
  retention_override_preference: string;
  exchange_rate: number;
  is_autobill_enabled: boolean;
  inprocess_transaction_present: boolean;
  allow_partial_payments: boolean;
  price_precision: number;
  sub_total: number;
  tax_total: number;
  total_taxable_amount: number;
  discount_total: number;
  discount_percent: number;
  discount: number;
  discount_applied_on_amount: number;
  discount_type: string;
  discount_account_id: string;
  discount_account_name: string;
  tax_override_preference: string;
  tds_override_preference: string;
  is_discount_before_tax: boolean;
  adjustment: number;
  adjustment_description: string;
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
  shipping_charge_account_id: string;
  shipping_charge_account_name: string;
  shipping_charge: number;
  bcy_shipping_charge: number;
  bcy_adjustment: number;
  bcy_sub_total: number;
  bcy_discount_total: number;
  bcy_tax_total: number;
  bcy_total: number;
  total: number;
  balance: number;
  write_off_amount: number;
  roundoff_value: number;
  transaction_rounding_type: string;
  rounding_mode: string;
  bcy_rounding_mode: string;
  is_inclusive_tax: boolean;
  sub_total_inclusive_of_tax: number;
  tax_reg_no: string;
  contact_category: string;
  vat_treatment: string;
  tax_rounding: string;
  taxes: Tax[];
  shipping_charge_taxes: any[];
  exceptions: any[];
  filed_in_vat_return_id: string;
  filed_in_vat_return_name: string;
  filed_in_vat_return_type: string;
  tds_calculation_type: string;
  can_send_invoice_sms: boolean;
  payment_expected_date: string;
  payment_discount: number;
  stop_reminder_until_payment_expected_date: boolean;
  last_payment_date: string;
  ach_supported: boolean;
  ach_payment_initiated: boolean;
  payment_options: PaymentOptions;
  reader_offline_payment_initiated: boolean;
  contact_persons: any[];
  contact_persons_associated: any[];
  attachment_name: string;
  documents: any[];
  computation_type: string;
  deliverychallans: any[];
  branch_id: string;
  branch_name: string;
  location_id: string;
  location_name: string;
  merchant_id: string;
  merchant_name: string;
  ecomm_operator_id: string;
  ecomm_operator_name: string;
  salesorder_id: string;
  salesorder_number: string;
  salesorders: any[];
  shipping_bills: any[];
  contact_persons_details: ContactPersonsDetail[];
  contact: Contact;
  salesperson_id: string;
  salesperson_name: string;
  is_emailed: boolean;
  reminders_sent: number;
  last_reminder_sent_date: string;
  next_reminder_date_formatted: string;
  is_viewed_by_client: boolean;
  client_viewed_time: string;
  submitter_id: string;
  approver_id: string;
  submitted_date: string;
  submitted_by: string;
  submitted_by_name: string;
  submitted_by_email: string;
  submitted_by_photo_url: string;
  template_id: string;
  template_name: string;
  template_type: string;
  notes: string;
  terms: string;
  billing_address: AddressWithoutId;
  shipping_address: AddressWithoutCoordsWithCompany;
  invoice_url: string;
  subject_content: string;
  can_send_in_mail: boolean;
  created_time: string;
  last_modified_time: string;
  created_date: string;
  created_by_id: string;
  created_by_name: string;
  last_modified_by_id: string;
  page_width: string;
  page_height: string;
  orientation: string;
  is_backorder: string;
  sales_channel: string;
  color_code: string;
  current_sub_status_id: string;
  current_sub_status: string;
  sub_statuses: any[];
  estimate_id: string;
  is_client_review_settings_enabled: boolean;
  unused_retainer_payments: number;
  credits_applied: number;
  tax_amount_withheld: number;
  schedule_time: string;
  no_of_copies: number;
  show_no_of_copies: boolean;
  customer_default_billing_address: AddressWithoutId;
  includes_package_tracking_info: boolean;
  approvers_list: any[];
  qr_code: QrCode;
  exchange_invoices: any[];
}

interface Contact {
  customer_balance: number;
  credit_limit: number;
  unused_customer_credits: number;
  is_credit_limit_migration_completed: boolean;
}

interface ContactPersonsDetail {
  contact_person_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  is_primary_contact: boolean;
  photo_url: string;
}

export interface CustomFieldHash {}

export interface CustomLock {
  locked_fields: CustomFieldHash;
  locked_actions: any[];
  lock_details: LockDetails;
}

export interface LockDetails {
  can_lock: boolean;
}

export interface LineItem {
  line_item_id: string;
  item_id: string;
  sku: string;
  item_order: number;
  product_type: string;
  name: string;
  internal_name: string;
  description: string;
  discount_account_id: string;
  discount_account_name: string;
  unit: string;
  unit_group_id: string;
  unit_conversion_id: string;
  conversion_rate: number;
  base_unit_id: string;
  quantity: number;
  is_dropshipped_item: boolean;
  discount_amount: number;
  discount: string | number;
  discounts: any[];
  bcy_rate: number;
  rate: number;
  account_id: string;
  account_name: string;
  header_id: string;
  header_name: string;
  pricebook_id: string;
  tax_id: string;
  tax_name: string;
  tax_type: string;
  tax_percentage: number;
  item_total: number;
  item_custom_fields: any[];
  pricing_scheme: string;
  tags: any[];
  documents: any[];
  image_document_id: string;
  line_item_taxes: LineItemTax[];
  bill_id: string;
  bill_item_id: string;
  location_id: string;
  location_name: string;
  is_storage_location_enabled: boolean;
  stock_on_hand: string;
  available_stock: string;
  committed_stock: string;
  available_for_sale_stock: string;
  actual_available_stock: string;
  actual_committed_stock: string;
  actual_available_for_sale_stock: string;
  is_combo_product: boolean;
  combo_type: string;
  track_serial_number: boolean;
  track_batch_number: boolean;
  track_serial_for_package: boolean;
  track_batch_for_package: boolean;
  serial_numbers: any[];
  serial_number_details: any[];
  batches: any[];
  project_id: string;
  time_entry_ids: any[];
  expense_id: string;
  item_type: string;
  expense_receipt_name: string;
  sales_rate: number;
  purchase_rate: number | string;
  salesorder_item_id: string;
  cost_amount: number;
  markup_percent: number;
  package_details: PackageDetails;
  mapped_items: any[];
  is_modifier_item: boolean;
  line_item_category: string;
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
  weight: number | string;
  weight_unit: string;
  dimension_unit: string;
}

export interface PaymentOptions {
  payment_gateways: any[];
}

export interface QrCode {
  qr_source: string;
  is_qr_enabled: boolean;
  qr_value: string;
  qr_description: string;
}

export interface Tax {
  tax_amount: number;
  tax_name: string;
  tax_amount_formatted: string;
}

type InvoiceLineItem = Pick<Item, 'item_id'> &
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
    salesorder_item_id?: string;
    [key: string]: any;
  };

export type CreateInvoice = Pick<Invoice, 'customer_id' | 'invoice_number'> &
  Partial<Pick<Invoice, 'date' | 'billing_address' | 'template_id'>> & {
    line_items: InvoiceLineItem[];
    [key: string]: any;
  };
