import type { CustomField } from './customfield';
import type { PackageDetails } from './index';

export interface Item {
  item_id: string;
  has_attribute_options: boolean;
  name: string;
  sku: string;
  brand: string;
  manufacturer: string;
  category_id: string;
  category_name: string;
  product_subtype: string;
  purpose_of_use: string;
  item_code: any;
  image_name: string;
  image_type: string;
  status: string;
  source: string;
  is_linked_with_zohocrm: boolean;
  zcrm_product_id: string;
  crm_owner_id: string;
  unit: string;
  unit_id: string;
  unit_group_id: string;
  unit_group_name: string;
  unit_conversions: UnitConversion[];
  default_sales_unit_conversion_id: string;
  default_purchase_unit_conversion_id: string;
  description: string;
  rate: number;
  account_id: string;
  account_name: string;
  tax_id: string;
  tax_name: string;
  tax_percentage: number;
  tax_type: string;
  tax_status: string;
  tax_groups_details: string;
  tax_country_code: string;
  tax_information: string;
  purchase_tax_id: string;
  purchase_tax_name: string;
  purchase_tax_information: string;
  is_default_tax_applied: boolean;
  purchase_tax_percentage: number;
  purchase_tax_type: string;
  associated_template_id: string;
  documents: any[];
  purchase_description: string;
  sales_tax_rule_id: string;
  sales_tax_rule_name: string;
  purchase_tax_rule_id: string;
  purchase_tax_rule_name: string;
  pricebook_rate: number;
  pricing_scheme: string;
  price_brackets: any[];
  default_price_brackets: DefaultPriceBracket[];
  sales_rate: number;
  purchase_rate: number;
  sales_margin: string;
  purchase_account_id: string;
  purchase_account_name: string;
  inventory_account_id: string;
  inventory_account_name: string;
  created_time: string;
  offline_created_date_with_time: string;
  last_modified_time: string;
  tags: any[];
  can_be_sold: boolean;
  can_be_purchased: boolean;
  track_inventory: boolean;
  item_type: string;
  product_type: string;
  inventory_valuation_method: string;
  is_returnable: boolean;
  reorder_level: string;
  minimum_order_quantity: string;
  maximum_order_quantity: string;
  vendor_id: string;
  vendor_name: string;
  asset_value: string;
  lock_details: LockDetails;
  locked_actions: any[];
  locked_fields: any;
  custom_locks: CustomLock[];
  system_locks: any[];
  custom_fields?: CustomField[];
  custom_field_hash: any;
  track_serial_number: boolean;
  track_batch_number: boolean;
  is_storage_location_enabled: boolean;
  is_fulfillable: boolean;
  upc: string;
  ean: string;
  isbn: string;
  part_number: string;
  is_combo_product: boolean;
  combo_type: string;
  image_sync_in_progress: boolean;
  sales_channels: any[];
  locations: Location[];
  preferred_vendors: any[];
  package_details: PackageDetails;
  is_modifier_item: boolean;
  integration_references: any[];
}
export interface CustomLock {
  locked_fields: any;
  locked_actions: any[];
  lock_details: LockDetails;
}

export interface LockDetails {
  can_lock: boolean;
}

export interface DefaultPriceBracket {
  start_quantity: number;
  end_quantity: number;
  pricebook_rate: number;
}

export interface Location {
  location_id: string;
  location_name: string;
  status: string;
  is_primary: boolean;
  is_primary_location: boolean;
  is_item_mapped: boolean;
  location_stock_on_hand: number;
  initial_stock: number;
  initial_stock_rate: number;
  location_asset_value: number;
  location_available_stock: number;
  location_actual_available_stock: number;
  location_committed_stock: number;
  location_actual_committed_stock: number;
  location_available_for_sale_stock: number;
  location_actual_available_for_sale_stock: number;
  location_quantity_in_transit: number;
  serial_numbers: any[];
  batches: any[];
  storages: any[];
  is_storage_location_enabled: boolean;
  default_storage: string;
  is_general_location: boolean;
  sales_channels: any[];
}

export interface UnitConversion {
  unit_conversion_id: string;
  target_unit_id: string;
  target_unit: string;
  quantity_decimal_place: number;
  conversion_rate: number;
}

export type CreateItem = Pick<Item, 'name' | 'sku'> & Partial<Omit<Item, 'name' | 'sku'>>;
export type UpdateItem = Pick<Item, 'name'> & Partial<Omit<Item, 'name'>>;

export type ListItem = Omit<
  Item,
  | 'has_attribute_options'
  | 'item_code'
  | 'unit_id'
  | 'unit_group_id'
  | 'unit_group_name'
  | 'unit_conversions'
  | 'default_sales_unit_conversion_id'
  | 'default_purchase_unit_conversion_id'
  | 'tax_id'
  | 'tax_name'
  | 'tax_percentage'
  | 'tax_type'
  | 'tax_status'
  | 'tax_groups_details'
  | 'tax_country_code'
  | 'tax_information'
  | 'purchase_tax_id'
  | 'purchase_tax_name'
  | 'purchase_tax_information'
  | 'is_default_tax_applied'
  | 'purchase_tax_percentage'
  | 'purchase_tax_type'
  | 'associated_template_id'
  | 'documents'
  | 'sales_tax_rule_id'
  | 'sales_tax_rule_name'
  | 'purchase_tax_rule_id'
  | 'purchase_tax_rule_name'
  | 'pricebook_rate'
  | 'pricing_scheme'
  | 'price_brackets'
  | 'default_price_brackets'
  | 'sales_rate'
  | 'sales_margin'
  | 'inventory_account_id'
  | 'inventory_account_name'
  | 'offline_created_date_with_time'
  | 'crm_owner_id'
  | 'vendor_id'
  | 'vendor_name'
  | 'asset_value'
  | 'lock_details'
  | 'locked_actions'
  | 'locked_fields'
  | 'custom_locks'
  | 'system_locks'
  | 'custom_fields'
  | 'custom_field_hash'
  | 'image_sync_in_progress'
  | 'sales_channels'
  | 'locations'
  | 'preferred_vendors'
  | 'package_details'
  | 'is_modifier_item'
  | 'integration_references'
> & {
  item_name?: string;
  has_attachment?: boolean;
  image_document_id?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: number;
  weight_unit?: string;
  dimension_unit?: string;
  dimensions_with_unit?: string;
  weight_with_unit?: string;
};

export type ItemDetail = Item & {
  tax_name_formatted?: string;
  purchase_account_name?: string;
  stock_on_hand?: number;
  available_stock?: number;
  actual_available_stock?: number;
  committed_stock?: number;
  actual_committed_stock?: number;
  available_for_sale_stock?: number;
  actual_available_for_sale_stock?: number;
  image_document_id?: string;
};
