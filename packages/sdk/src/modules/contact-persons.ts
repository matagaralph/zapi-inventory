import type {
  CreateContactPersonRequest,
  CreateContactPersonResponse,
  GetContactPersonResponse,
  ListContactPersonsQuery,
  ListContactPersonsResponse,
  UpdateContactPersonRequest,
  UpdateContactPersonResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

/**
 * A contact person is an individual who acts as a representative of an organisation for communication purpose. For example, a Manager can be a contact person for an organisation.
 */
export function createContactPersons(http: HTTPClient) {
  return {
    async list(
      contactId: string,
      params?: ListContactPersonsQuery
    ): Promise<ListContactPersonsResponse['contact_persons']> {
      const { contact_persons } = await http.get<ListContactPersonsResponse>({
        path: ['contacts', contactId, 'contactpersons'],
        query: params,
      })
      return contact_persons
    },

    async get(
      contactId: string,
      contactPersonId: string
    ): Promise<GetContactPersonResponse['contact_person']> {
      const { contact_person } = await http.get<GetContactPersonResponse>({
        path: ['contacts', contactId, 'contactpersons', contactPersonId],
      })
      return contact_person
    },

    async create(
      data: CreateContactPersonRequest
    ): Promise<CreateContactPersonResponse['contact_person']> {
      const { contact_person } = await http.post<CreateContactPersonResponse>({
        path: ['contacts', 'contactpersons'],
        body: data,
      })
      return contact_person
    },

    async update(
      contactPersonId: string,
      data: UpdateContactPersonRequest
    ): Promise<UpdateContactPersonResponse['contact_person']> {
      const { contact_person } = await http.put<UpdateContactPersonResponse>({
        path: ['contacts', 'contactpersons', contactPersonId],
        body: data,
      })
      return contact_person
    },

    async delete(contactPersonId: string): Promise<void> {
      await http.delete({ path: ['contacts', 'contactpersons', contactPersonId] })
    },

    async markAsPrimary(contactPersonId: string): Promise<void> {
      await http.post({
        path: ['contacts', 'contactpersons', contactPersonId, 'primary'],
      })
    },
  }
}

export type ContactPersons = ReturnType<typeof createContactPersons>
