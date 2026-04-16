import type { HttpClient } from '@/client';
import { MODULES } from '@/core/constants';
import type { Contact, CreateContact } from '@/types/contact';

export class ContactResource {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  async get(contactId: string): Promise<Contact> {
    const res = await this.http.get<{ contact: Contact }>({
      path: [MODULES.CONTACT.PATH, contactId],
    });
    return res[MODULES.CONTACT.RESPONSE_KEY.SINGULAR];
  }

  async create(contact: CreateContact): Promise<Contact> {
    const res = await this.http.post<{ contact: Contact }>({
      path: [MODULES.CONTACT.PATH],
      body: contact,
    });
    return res[MODULES.CONTACT.RESPONSE_KEY.SINGULAR];
  }

  async update(contactId: string, contact: CreateContact): Promise<Contact> {
    const res = await this.http.put<{ contact: Contact }>({
      path: [MODULES.CONTACT.PATH, contactId],
      body: contact,
    });
    return res[MODULES.CONTACT.RESPONSE_KEY.SINGULAR];
  }

  async delete(contactId: string) {
    return this.http.delete({
      path: [MODULES.CONTACT.PATH, contactId],
    });
  }
}
