export const MODULES = {
  SALES_ORDER: {
    PATH: 'salesorders',
    RESPONSE_KEY: {
      SINGULAR: 'salesorder',
      PLURAL: 'salesorders',
    },
  },
  ITEM: {
    PATH: 'items',
    RESPONSE_KEY: {
      SINGULAR: 'item',
      PLURAL: 'items',
    },
  },
  CONTACT: {
    PATH: 'contacts',
    RESPONSE_KEY: {
      SINGULAR: 'contact',
      PLURAL: 'contacts',
    },
  },
  CONTACT_PERSON: {
    PATH: 'contact_persons',
    RESPONSE_KEY: {
      SINGULAR: 'contact_person',
      PLURAL: 'contact_persons',
    },
  },
  SHIPMENT_ORDER: {
    PATH: 'shipmentorders',
    RESPONSE_KEY: {
      SINGULAR: 'shipmentorder',
      PLURAL: 'shipmentorders',
    },
  },
  PACKAGE: {
    PATH: 'packages',
    RESPONSE_KEY: {
      SINGULAR: 'package',
      PLURAL: 'packages',
    },
  },
} as const;
