import type { ApiClient } from '../client';
import type {
  ContactPersonResponse,
  CreateContactPersonRequest,
  CreateContactPersonResponse,
  GetContactPersonResponse,
  ListContactPersonsResponse,
  UpdateContactPersonRequest,
  UpdateContactPersonResponse,
} from '../types/contactperson';

export class ContactPersonModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List contact persons for a specific contact.
   */
  async list(
    contactId: string,
    opts?: { limit?: number }
  ): Promise<ListContactPersonsResponse['contact_persons']> {
    return this.client.getList({
      path: ['contacts', contactId, 'contactpersons'],
      limit: opts?.limit,
      extractor: (res: ListContactPersonsResponse) => res.contact_persons ?? [],
    });
  }

  /**
   * Create a contact person.
   */
  async create(
    contactPerson: CreateContactPersonRequest
  ): Promise<ContactPersonResponse[]> {
    const res = await this.client.post<CreateContactPersonResponse>({
      path: ['contacts', 'contactpersons'],
      body: contactPerson,
    });
    return res.contact_person ?? [];
  }

  /**
   * Get a contact person.
   */
  async get(
    contactId: string,
    contactPersonId: string
  ): Promise<GetContactPersonResponse['contact_person']> {
    const res = await this.client.get<GetContactPersonResponse>({
      path: ['contacts', contactId, 'contactpersons', contactPersonId],
    });
    return res.contact_person;
  }

  /**
   * Update a contact person.
   */
  async update(
    contactPersonId: string,
    contactPerson: UpdateContactPersonRequest
  ): Promise<ContactPersonResponse[]> {
    const res = await this.client.put<UpdateContactPersonResponse>({
      path: ['contacts', 'contactpersons', contactPersonId],
      body: contactPerson,
    });
    return res.contact_person ?? [];
  }

  /**
   * Delete a contact person.
   */
  delete(contactPersonId: string): Promise<void> {
    return this.client.delete({
      path: ['contacts', 'contactpersons', contactPersonId],
    });
  }

  /**
   * Mark as primary contact person.
   */
  markAsPrimary(contactPersonId: string): Promise<void> {
    return this.client.post({
      path: ['contacts', 'contactpersons', contactPersonId, 'primary'],
    });
  }
}
