import type { ApiClient } from '../client';
import type {
  CreateContactRequest,
  CreateContactResponse,
  ListContactsResponse,
  UpdateContactRequest,
  UpdateContactResponse,
  GetContactResponse,
  DeleteContactResponse,
  GetContactAddressResponse,
  MarkAsActiveResponse,
  MarkAsInactiveResponse,
  EmailStatementRequest,
  EmailStatementResponse,
  GetStatementMailContentResponse,
  EmailContactRequest,
  EmailContactResponse,
  ListCommentsResponse,
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
      params: {},
      limit: opts?.limit ?? 200,
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
  async delete(contactId: string): Promise<DeleteContactResponse> {
    return this.client.delete<DeleteContactResponse>({
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
  async markActive(contactId: string): Promise<MarkAsActiveResponse> {
    return this.client.post<MarkAsActiveResponse>({
      path: ['contacts', contactId, 'active'],
    });
  }

  /**
   * Mark as Inactive.
   */
  async markInactive(contactId: string): Promise<MarkAsInactiveResponse> {
    return this.client.post<MarkAsInactiveResponse>({
      path: ['contacts', contactId, 'inactive'],
    });
  }

  /**
   * Get Statement mail content.
   */
  async getStatementMailContent(
    contactId: string,
    opts?: { startDate?: string; endDate?: string }
  ): Promise<GetStatementMailContentResponse> {
    const params: Record<string, any> = {};
    if (opts?.startDate) params.start_date = opts.startDate;
    if (opts?.endDate) params.end_date = opts.endDate;

    return this.client.get<GetStatementMailContentResponse>({
      path: ['contacts', contactId, 'statements', 'email'],
      params,
    });
  }

  /**
   * Email statement.
   */
  async emailStatement(
    contactId: string,
    emailRequest: EmailStatementRequest,
    opts?: { startDate?: string; endDate?: string }
  ): Promise<EmailStatementResponse> {
    const params: Record<string, any> = {};
    if (opts?.startDate) params.start_date = opts.startDate;
    if (opts?.endDate) params.end_date = opts.endDate;

    return this.client.post<EmailStatementResponse>({
      path: ['contacts', contactId, 'statements', 'email'],
      body: emailRequest,
      params,
    });
  }

  /**
   * Email contact.
   */
  async emailContact(
    contactId: string,
    emailRequest: EmailContactRequest,
    opts?: { sendCustomerStatement?: boolean }
  ): Promise<EmailContactResponse> {
    const params: Record<string, any> = {};
    if (opts?.sendCustomerStatement) {
      params.send_customer_statement = opts.sendCustomerStatement;
    }

    return this.client.post<EmailContactResponse>({
      path: ['contacts', contactId, 'email'],
      body: emailRequest,
      params,
    });
  }

  /**
   * List Comments.
   */
  async listComments(
    contactId: string,
    opts?: { limit?: number }
  ): Promise<ListCommentsResponse['contact_comments']> {
    return this.client.getList({
      path: ['contacts', contactId, 'comments'],
      params: {},
      limit: opts?.limit ?? 200,
      extractor: (res: ListCommentsResponse) => res.contact_comments ?? [],
    });
  }

  public async addAddress(
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

  public async deleteAddress(
    contactId: string,
    addressId: string
  ): Promise<string> {
    await this.client.delete({
      path: ['contacts', contactId, 'address', addressId],
    });

    return addressId;
  }
}
