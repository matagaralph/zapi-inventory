export interface CustomField {
  field_id?: string;
  customfield_id?: string;
  show_in_store?: boolean;
  show_in_portal?: boolean;
  is_active?: boolean;
  index?: number;
  label?: string;
  show_on_pdf?: boolean;
  edit_on_portal?: boolean;
  edit_on_store?: boolean;
  api_name: string;
  show_in_all_pdf?: boolean;
  value_formatted?: string;
  search_entity?: string;
  data_type?: string;
  placeholder?: string;
  value: string;
  is_dependent_field?: boolean;
}
