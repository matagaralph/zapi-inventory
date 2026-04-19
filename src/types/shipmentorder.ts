import type { AddressWithoutCoordsWithCompany } from './address';
import type { CustomField } from './customfield';

export interface ShipmentOrder {
  salesorder_id: string;
  salesorder_number: string;
  salesorder_date: string;
  salesorder_fulfilment_status: string;
  sales_channel: string;
  sales_channel_formatted: string;
  package_id: string;
  package_number: string;
  shipment_id: string;
  shipment_number: string;
  date: string;
  shipping_date: string;
  delivery_method: string;
  delivery_method_id: string;
  tracking_number: string;
  tracking_link: string;
  expected_delivery_date: string;
  shipment_delivered_date: string;
  status: string;
  dimensions: Dimensions;
  weight: Weight;
  detailed_status: string;
  status_message: string;
  carrier: string;
  service: string;
  delivery_days: string;
  delivery_guarantee: boolean;
  total_quantity: number;
  customer_id: string;
  customer_name: string;
  email: string;
  phone: string;
  mobile: string;
  contact_persons: any[];
  created_by_id: string;
  last_modified_by_id: string;
  notes: string;
  terms: string;
  line_items: LineItem[];
  includes_picklist_tracking_info: boolean;
  is_emailed: boolean;
  custom_fields: any[];
  custom_field_hash: any;
  shipmentorder_custom_fields: CustomField[];
  billing_address: AddressWithoutCoordsWithCompany;
  shipping_address: AddressWithoutCoordsWithCompany;
  picklists: any[];
  template_id: string;
  template_name: string;
  template_type: string;
  created_time: string;
  last_modified_time: string;
  shipment_order: ShipmentOrderClass;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface LineItem {
  line_item_id: string;
  so_line_item_id: string;
  item_id: string;
  picklist_item_id: string;
  picklist_number: string;
  sku: string;
  name: string;
  description: string;
  salesorder_id: string;
  salesorder_number: string;
  item_order: number;
  item_type: ItemType;
  quantity: number;
  unit: string;
  base_unit_id: string;
  unit_conversion_id: string;
  conversion_rate: number;
  quantity_decimal_place: number;
  image_name: string;
  image_type: string;
  image_document_id: string;
  is_invoiced: boolean;
  item_custom_fields: any[];
  serial_numbers: any[];
  serial_number_details: any[];
  batches: Batch[];
  track_serial_number: boolean;
  track_batch_number: boolean;
  track_serial_for_package: boolean;
  track_batch_for_package: boolean;
  is_storage_location_enabled: boolean;
  location_id: string;
  location_name: LocationName;
  is_combo_product: boolean;
  combo_type: string;
  mapped_items: any[];
}

export interface Batch {
  batch_id: string;
  batch_number: string;
  manufacturer_batch_number: string;
  external_batch_number: string;
  batch_in_id: string;
  batch_out_id: string;
  internal_batch_number: string;
  balance_quantity: number;
  in_quantity: number;
  txn_unit_in_quantity: number;
  base_unit_in_quantity: number;
  out_quantity: number;
  txn_unit_out_quantity: number;
  base_unit_out_quantity: number;
  location_id: string;
  status: Status;
  status_formatted: StatusFormatted;
  storages: any[];
  batch_custom_fields: any[];
}

export enum Status {
  Active = 'active',
}

export enum StatusFormatted {
  Active = 'Active',
}

export enum ItemType {
  Inventory = 'inventory',
}

export enum LocationName {
  SocialEcosystemsAGWarehouse = 'Social Ecosystems AG (Warehouse)',
}

export enum Unit {
  Pcs = 'pcs',
}

export interface ShipmentOrderClass {
  shipment_id: string;
  shipment_number: string;
  shipping_date: string;
  delivery_method: string;
  delivery_method_id: string;
  notes: string;
  multipiece_shipments: any[];
  shipment_type: string;
  associated_packages: AssociatedPackage[];
  associated_packages_count: number;
  tracking_number: string;
  tracking_link: string;
  expected_delivery_date: string;
  shipment_delivered_date: string;
  status: string;
  shipment_status: string;
  shipment_sub_status: string;
  detailed_status: string;
  status_message: string;
  carrier: string;
  service: string;
  delivery_days: string;
  delivery_guarantee: boolean;
  shipment_rate: number;
  shipmentorder_custom_fields: any[];
  is_carrier_shipment: boolean;
  can_show_tracking: boolean;
  is_tracking_enabled: boolean;
  is_forms_available: boolean;
  source_id: string;
  source_name: string;
  tracking_statuses: TrackingStatus[];
}

export interface AssociatedPackage {
  package_id: string;
  package_number: string;
}

export interface TrackingStatus {
  id: string;
  reference_id: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  fax: string;
  email: string;
  notes: string;
  date: string;
  time: string;
  current_tracking_status: string;
  current_tracking_status_message: string;
}

export interface Weight {
  value: number;
  unit: string;
}

export type CreateShipmentOrder = Pick<
  ShipmentOrder,
  'delivery_method' | 'tracking_number' | 'date'
> &
  Partial<
    Pick<ShipmentOrder, 'notes' | 'tracking_link' | 'template_id' | 'shipmentorder_custom_fields'>
  > & {
    salesorder_id: string;
    package_ids: string;
    [key: string]: any;
  };
