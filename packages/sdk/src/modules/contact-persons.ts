import type {
  CreateContactPersonRequest,
  CreateContactPersonResponse,
  GetContactPersonResponse,
  ListContactPersonsQuery,
  ListContactPersonsResponse,
  MarkAsPrimaryContactPersonResponse,
  UpdateContactPersonRequest,
  UpdateContactPersonResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class ContactPersons {
  constructor(private readonly http: HTTPClient) {}

  async list(
    contactId: string,
    params?: ListContactPersonsQuery
  ): Promise<ListContactPersonsResponse['contact_persons']> {
    const { contact_persons } = await this.http.get<ListContactPersonsResponse>({
      path: ['contacts', contactId, 'contactpersons'],
      query: params,
    })
    return contact_persons
  }

  async get(
    contactId: string,
    contactPersonId: string
  ): Promise<GetContactPersonResponse['contact_person']> {
    const { contact_person } = await this.http.get<GetContactPersonResponse>({
      path: ['contacts', contactId, 'contactpersons', contactPersonId],
    })
    return contact_person
  }

  async create(
    data: CreateContactPersonRequest
  ): Promise<CreateContactPersonResponse['contact_person']> {
    const { contact_person } = await this.http.post<CreateContactPersonResponse>({
      path: ['contacts', 'contactpersons'],
      body: data,
    })
    return contact_person
  }

  async update(
    contactPersonId: string,
    data: UpdateContactPersonRequest
  ): Promise<UpdateContactPersonResponse['contact_person']> {
    const { contact_person } = await this.http.put<UpdateContactPersonResponse>({
      path: ['contacts', 'contactpersons', contactPersonId],
      body: data,
    })
    return contact_person
  }

  async delete(contactPersonId: string): Promise<void> {
    await this.http.delete({ path: ['contacts', 'contactpersons', contactPersonId] })
  }

  async markAsPrimary(contactPersonId: string): Promise<MarkAsPrimaryContactPersonResponse> {
    return this.http.post<MarkAsPrimaryContactPersonResponse>({
      path: ['contacts', 'contactpersons', contactPersonId, 'primary'],
    })
  }
}
