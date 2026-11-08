import type {
  CreateContactRequest,
  CreateContactResponse,
  EmailContactQuery,
  EmailContactRequest,
  EmailStatementQuery,
  EmailStatementRequest,
  GetContactAddressResponse,
  GetContactResponse,
  GetStatementMailContentQuery,
  GetStatementMailContentResponse,
  ListCommentsResponse,
  ListContactCommentsQuery,
  ListContactsQuery,
  ListContactsResponse,
  UpdateContactRequest,
  UpdateContactResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * A contact is either a customer or vendor. A contact can be an individual or a business in general.
 */
export function createContacts(http: HTTPClient) {
  return {
    async list(params?: ListContactsQuery): Promise<ListContactsResponse['contacts']> {
      const { contacts } = await http.get<ListContactsResponse>({
        path: ['contacts'],
        query: params,
      })
      return contacts
    },

    async create(data: CreateContactRequest): Promise<CreateContactResponse['contact']> {
      const { contact } = await http.post<CreateContactResponse>({
        path: ['contacts'],
        body: data,
      })
      return contact
    },

    async get(contactId: string): Promise<GetContactResponse['contact']> {
      const { contact } = await http.get<GetContactResponse>({ path: ['contacts', contactId] })
      return contact
    },

    async update(
      contactId: string,
      data: UpdateContactRequest
    ): Promise<UpdateContactResponse['contact']> {
      const { contact } = await http.put<UpdateContactResponse>({
        path: ['contacts', contactId],
        body: data,
      })
      return contact
    },

    async delete(contactId: string): Promise<void> {
      await http.delete({ path: ['contacts', contactId] })
    },

    async getAddress(contactId: string): Promise<GetContactAddressResponse['addresses']> {
      const { addresses } = await http.get<GetContactAddressResponse>({
        path: ['contacts', contactId, 'address'],
      })
      return addresses
    },

    async markAsActive(contactId: string): Promise<void> {
      await http.post({ path: ['contacts', contactId, 'active'] })
    },

    async markAsInactive(contactId: string): Promise<void> {
      await http.post({
        path: ['contacts', contactId, 'inactive'],
      })
    },

    async getStatementMailContent(
      contactId: string,
      params?: GetStatementMailContentQuery
    ): Promise<GetStatementMailContentResponse> {
      return http.get<GetStatementMailContentResponse>({
        path: ['contacts', contactId, 'statements', 'email'],
        query: params,
      })
    },

    async emailStatement(
      contactId: string,
      data: EmailStatementRequest,
      params?: EmailStatementQuery
    ): Promise<void> {
      await http.post({
        path: ['contacts', contactId, 'statements', 'email'],
        query: params,
        body: data,
      })
    },

    async sendEmail(
      contactId: string,
      data: EmailContactRequest,
      params?: EmailContactQuery
    ): Promise<void> {
      await http.post({
        path: ['contacts', contactId, 'email'],
        query: params,
        body: data,
      })
    },

    async listComments(
      contactId: string,
      params?: ListContactCommentsQuery
    ): Promise<ListCommentsResponse['contact_comments']> {
      const { contact_comments } = await http.get<ListCommentsResponse>({
        path: ['contacts', contactId, 'comments'],
        query: params,
      })
      return contact_comments
    },
  }
}

export type Contacts = ReturnType<typeof createContacts>
