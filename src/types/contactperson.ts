import type { CustomField } from './customfield';

export interface ContactPerson {
  contact_id: string;
  contact_person_id: string;
  zcrm_contact_id: string;
  salutation: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  photo_url: string;
  mobile_country_code: string;
  mobile_code_formatted: string;
  department: string;
  designation: string;
  skype: string;
  fax: string;
  is_primary_contact: boolean;
  is_added_in_portal: boolean;
  can_invite: boolean;
  created_time: string;
  updated_time: string;
  contactperson_custom_fields: CustomField[];
  communication_preference: CommunicationPreference;
}

export type ListContactPerson = Omit<
  ContactPerson,
  | 'zcrm_contact_id'
  | 'photo_url'
  | 'mobile_country_code'
  | 'mobile_code_formatted'
  | 'is_added_in_portal'
  | 'can_invite'
  | 'updated_time'
  | 'communication_preference'
> & {
  contact_name?: string;
  currency_code?: string;
};

export interface CommunicationPreference {
  is_email_enabled: boolean;
}
