export interface Address {
  address_id?: string;
  attention: string;
  address: string;
  street2?: string;
  city: string;
  state?: string;
  state_code?: string;
  zip: string;
  country: string;
  country_code?: string;
  phone?: string;
  fax?: string;
}

export type AddressWithoutId = Omit<Address, 'address_id'>;
export type AddressWithoutCoordsWithCompany = AddressWithoutId & {
  company_name: string;
};

export type AddressBasic = Pick<
  Address,
  'attention' | 'country' | 'address' | 'city' | 'state' | 'zip' | 'phone' | 'fax'
>;
