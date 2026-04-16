import type { Address, AddressWithoutCoordsWithCompany } from './address';
import type { CustomField } from './customfield';

export interface Contact {
  contact_id: string;
  contact_name: string;
  company_name: string;
  contact_tax_information: string;
  first_name: string;
  last_name: string;
  designation: string;
  department: string;
  website: string;
  is_bcy_only_contact: boolean;
  is_credit_limit_migration_completed: boolean;
  language_code: string;
  language_code_formatted: string;
  contact_salutation: string;
  email: string;
  phone: string;
  mobile: string;
  photo_url: string;
  invited_by: string;
  portal_status: string;
  is_client_review_asked: boolean;
  has_transaction: boolean;
  contact_type: string;
  customer_sub_type: string;
  contact_relation_type: string;
  owner_id: string;
  owner_name: string;
  source: string;
  documents: any[];
  twitter: string;
  facebook: string;
  is_crm_customer: boolean;
  is_linked_with_zohocrm: boolean;
  primary_contact_id: string;
  zcrm_vendor_id: string;
  crm_owner_id: string;
  payment_terms: number;
  payment_terms_label: string;
  payment_terms_id: string;
  credit_limit_exceeded_amount: number;
  currency_id: string;
  lock_details: LockDetails;
  locked_actions: any[];
  custom_locks: CustomLock[];
  system_locks: any[];
  currency_code: string;
  currency_symbol: string;
  price_precision: number;
  exchange_rate: string;
  can_show_customer_ob: boolean;
  can_show_vendor_ob: boolean;
  branch_id: string;
  branch_name: string;
  location_id: string;
  location_name: string;
  opening_balance_amount: number;
  opening_balance_amount_bcy: string;
  outstanding_ob_receivable_amount: number;
  outstanding_ob_payable_amount: number;
  outstanding_receivable_amount: number;
  outstanding_receivable_amount_bcy: number;
  outstanding_payable_amount: number;
  outstanding_payable_amount_bcy: number;
  unused_credits_receivable_amount: number;
  unused_credits_receivable_amount_bcy: number;
  unused_credits_payable_amount: number;
  unused_credits_payable_amount_bcy: number;
  unused_retainer_payments: number;
  status: string;
  payment_reminder_enabled: boolean;
  is_sms_enabled: boolean;
  is_consent_agreed: boolean;
  consent_date: string;
  is_client_review_settings_enabled: boolean;
  custom_fields?: CustomField[];
  custom_field_hash: CustomFieldHash;
  tax_id: string;
  tax_name: string;
  tax_percentage: string;
  tax_rule_id: string;
  tax_rule_name: string;
  tax_reg_label: string;
  vat_treatment: string;
  tax_reg_no: string;
  contact_category: string;
  sales_channel: string;
  ach_supported: boolean;
  portal_receipt_count: number;
  opening_balances: any[];
  entity_address_id: string;
  billing_address: Address;
  shipping_address: Address;
  contact_persons: ContactPerson[];
  addresses: Address[];
  pricebook_id: string;
  pricebook_name: string;
  default_templates: DefaultTemplates;
  associated_with_square: boolean;
  cards: any[];
  checks: any[];
  upi_mandates: any[];
  bank_accounts: any[];
  vpa_list: any[];
  notes: string;
  created_time: string;
  created_date: string;
  created_by_name: string;
  created_by_id: string;
  last_modified_by_id: string;
  last_modified_time: string;
  tags: any[];
  zohopeople_client_id: string;
  siret_number: string;
  company_id: string;
  label_for_company_id: string;
  vendor_currency_summaries: VendorCurrencySummary[];
  approvers_list: any[];
  submitted_date: string;
  submitted_by: string;
  submitted_by_name: string;
  submitted_by_email: string;
  submitted_by_photo_url: string;
  submitter_id: string;
  approver_id: string;
  integration_references: any[];
}

export interface ContactPerson {
  contact_person_id: string;
  salutation: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  mobile_country_code: string;
  mobile_code_formatted: string;
  department: string;
  designation: string;
  skype: string;
  fax: string;
  photo_url: string;
  zcrm_contact_id: string;
  is_portal_mfa_enabled: boolean;
  is_added_in_portal: boolean;
  can_invite: boolean;
  is_primary_contact: boolean;
  is_portal_invitation_accepted: boolean;
  is_sms_enabled_for_cp: boolean;
  photo_document_url: string;
  photo_document_name: string;
  contactperson_custom_fields: any[];
  portal_enabled_via: string;
  communication_preference: CommunicationPreference;
}

export interface CommunicationPreference {
  is_email_enabled: boolean;
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

export interface DefaultTemplates {
  statement_template_id: string;
  statement_template_name: string;
  invoice_template_id: string;
  invoice_template_name: string;
  bill_template_id: string;
  bill_template_name: string;
  estimate_template_id: string;
  estimate_template_name: string;
  creditnote_template_id: string;
  creditnote_template_name: string;
  purchaseorder_template_id: string;
  purchaseorder_template_name: string;
  salesorder_template_id: string;
  salesorder_template_name: string;
  paymentthankyou_template_id: string;
  paymentthankyou_template_name: string;
  invoice_email_template_id: string;
  invoice_email_template_name: string;
  estimate_email_template_id: string;
  estimate_email_template_name: string;
  creditnote_email_template_id: string;
  creditnote_email_template_name: string;
  purchaseorder_email_template_id: string;
  purchaseorder_email_template_name: string;
  salesorder_email_template_id: string;
  salesorder_email_template_name: string;
  paymentthankyou_email_template_id: string;
  paymentthankyou_email_template_name: string;
  payment_remittance_email_template_id: string;
  payment_remittance_email_template_name: string;
}

export interface VendorCurrencySummary {
  currency_id: string;
  currency_code: string;
  currency_symbol: string;
  price_precision: number;
  is_base_currency: boolean;
  currency_name_formatted: string;
  outstanding_payable_amount: number;
  unused_credits_payable_amount: number;
}

export type CreateContact = Pick<Contact, 'contact_name' | 'contact_type'> &
  Partial<
    Pick<
      Contact,
      | 'company_name'
      | 'twitter'
      | 'notes'
      | 'website'
      | 'currency_id'
      | 'payment_terms'
      | 'language_code'
    >
  > & {
    shipping_address?: AddressWithoutCoordsWithCompany;
    billing_address?: AddressWithoutCoordsWithCompany;
    [key: string]: any;
  };

export type ListContact = Pick<
  Contact,
  | 'contact_id'
  | 'contact_name'
  | 'company_name'
  | 'website'
  | 'language_code'
  | 'language_code_formatted'
  | 'contact_type'
  | 'status'
  | 'customer_sub_type'
  | 'source'
  | 'is_linked_with_zohocrm'
  | 'payment_terms'
  | 'payment_terms_id'
  | 'payment_terms_label'
  | 'currency_id'
  | 'twitter'
  | 'facebook'
  | 'currency_code'
  | 'outstanding_receivable_amount'
  | 'outstanding_receivable_amount_bcy'
  | 'outstanding_payable_amount'
  | 'outstanding_payable_amount_bcy'
  | 'unused_credits_receivable_amount'
  | 'unused_credits_receivable_amount_bcy'
  | 'unused_credits_payable_amount'
  | 'unused_credits_payable_amount_bcy'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'mobile'
  | 'portal_status'
  | 'created_time'
  | 'last_modified_time'
  | 'custom_fields'
  | 'custom_field_hash'
  | 'tags'
  | 'ach_supported'
> & {
  customer_name?: string;
  vendor_name?: string;
  contact_type_formatted?: string;
  portal_status_formatted?: string;
  created_time_formatted?: string;
  last_modified_time_formatted?: string;
  contactperson_custom_fields?: CustomField[];
  has_attachment?: boolean;
};
