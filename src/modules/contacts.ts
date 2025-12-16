import type { ApiClient } from '../client';
import type {
  CreateContactRequest,
  CreateContactResponse,
  EmailContactRequest,
  EmailStatementRequest,
  GetContactAddressResponse,
  GetContactResponse,
  GetStatementMailContentResponse,
  ListCommentsResponse,
  ListContactsResponse,
  UpdateContactRequest,
  UpdateContactResponse,
} from '../types/contact';

export class ContactModule {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * List contacts.
   */
  async list(opts?: {
    limit?: number;
  }): Promise<ListContactsResponse['contacts']> {
    return this.client.getList({
      path: ['contacts'],
      limit: opts?.limit,
      extractor: (res: ListContactsResponse) => res.contacts ?? [],
    });
  }

  /**
   * Create a Contact.
   */
  async create(
    contact: CreateContactRequest
  ): Promise<CreateContactResponse['contact']> {
    const res = await this.client.post<CreateContactResponse>({
      path: ['contacts'],
      body: contact,
    });
    return res.contact;
  }

  /**
   * Get contact.
   */
  async get(contactId: string): Promise<GetContactResponse['contact']> {
    const res = await this.client.get<GetContactResponse>({
      path: ['contacts', contactId],
    });
    return res.contact;
  }

  /**
   * Update a contact.
   */
  async update(
    contactId: string,
    contact: UpdateContactRequest
  ): Promise<UpdateContactResponse['contact']> {
    const res = await this.client.put<UpdateContactResponse>({
      path: ['contacts', contactId],
      body: contact,
    });
    return res.contact;
  }

  /**
   * Delete a contact.
   */
  delete(contactId: string): Promise<void> {
    return this.client.delete({
      path: ['contacts', contactId],
    });
  }

  /**
   * Get contact address (Billing and Shipping).
   */
  async getAddress(
    contactId: string
  ): Promise<GetContactAddressResponse['addresses']> {
    const res = await this.client.get<GetContactAddressResponse>({
      path: ['contacts', contactId, 'address'],
    });
    return res.addresses;
  }

  /**
   * Mark as active.
   */
  markActive(contactId: string): Promise<void> {
    return this.client.post({
      path: ['contacts', contactId, 'active'],
    });
  }

  /**
   * Mark as Inactive.
   */
  markInactive(contactId: string): Promise<void> {
    return this.client.post({
      path: ['contacts', contactId, 'inactive'],
    });
  }

  /**
   * Get Statement mail content.
   */
  async getStatementMailContent(
    contactId: string,
    opts?: { start_date?: string; end_date?: string }
  ): Promise<GetStatementMailContentResponse> {
    return this.client.get<GetStatementMailContentResponse>({
      path: ['contacts', contactId, 'statements', 'email'],
      params: opts,
    });
  }

  /**
   * Email statement.
   */
  emailStatement(
    contactId: string,
    emailRequest: EmailStatementRequest,
    opts?: { start_date?: string; end_date?: string }
  ): Promise<void> {
    return this.client.post({
      path: ['contacts', contactId, 'statements', 'email'],
      body: emailRequest,
      params: opts,
    });
  }

  /**
   * Email contact.
   */
  emailContact(
    contactId: string,
    emailRequest: EmailContactRequest,
    opts?: { send_customer_statement?: boolean }
  ): Promise<void> {
    return this.client.post({
      path: ['contacts', contactId, 'email'],
      body: emailRequest,
      params: opts,
    });
  }

  /**
   * List Comments.
   */
  listComments(
    contactId: string,
    opts?: { limit?: number }
  ): Promise<ListCommentsResponse['contact_comments']> {
    return this.client.getList({
      path: ['contacts', contactId, 'comments'],
      limit: opts?.limit ?? 200,
      extractor: (res: ListCommentsResponse) => res.contact_comments ?? [],
    });
  }

  async addAddress(
    contactId: string,
    address: any,
    updateExistingTransactions?: boolean
  ): Promise<string> {
    const res = await this.client.post<{
      address_info: { address_id: string };
    }>({
      path: ['contacts', contactId, 'address'],
      body: {
        update_existing_transactions_address:
          updateExistingTransactions ?? false,
        ...address,
      },
    });

    return res.address_info.address_id;
  }

  deleteAddress(contactId: string, addressId: string): Promise<void> {
    return this.client.delete({
      path: ['contacts', contactId, 'address', addressId],
    });
  }
}
