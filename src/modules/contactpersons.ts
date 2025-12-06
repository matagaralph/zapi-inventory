import type { ApiClient } from '../client';
import type {
  ContactPersonResponse,
  CreateContactPersonRequest,
  CreateContactPersonResponse,
  UpdateContactPersonRequest,
  UpdateContactPersonResponse,
  DeleteContactPersonResponse,
  ListContactPersonsResponse,
  GetContactPersonResponse,
  MarkAsPrimaryContactPersonResponse,
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
  async delete(contactPersonId: string): Promise<DeleteContactPersonResponse> {
    return this.client.delete<DeleteContactPersonResponse>({
      path: ['contacts', 'contactpersons', contactPersonId],
    });
  }

  /**
   * Mark as primary contact person.
   */
  async markAsPrimary(
    contactPersonId: string
  ): Promise<MarkAsPrimaryContactPersonResponse> {
    return this.client.post<MarkAsPrimaryContactPersonResponse>({
      path: ['contacts', 'contactpersons', contactPersonId, 'primary'],
    });
  }
}
