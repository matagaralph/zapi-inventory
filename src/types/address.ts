export interface Address {
  address_id: string;
  attention: string;
  address: string;
  street2: string;
  city: string;
  state: string;
  state_code: string;
  zip: string;
  country: string;
  country_code: string;
  phone: string;
  fax: string;
  county?: string;
  latitude?: string;
  longitude?: string;
}

export type AddressWithoutId = Omit<Address, 'address_id'>;
export type AddressWithoutCoordsWithCompany = Omit<
  Address,
  'address_id' | 'longitude' | 'latitude'
> & {
  company_name: string;
};

export type CreateAddress = Partial<Omit<Address, 'address_id' | 'country_code'>>;
