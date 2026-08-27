import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  DeletePaymentResponse,
  GetPaymentResponse,
  ListCustomerPaymentsQuery,
  ListCustomerPaymentsResponse,
  UpdateCustomerpaymentCustomfieldResponse,
  UpdatePaymentRequest,
  UpdatePaymentResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export interface UpdateCustomerPaymentCustomFieldsRequest {
  customfield_id?: string
  value?: string
}

export class CustomerPayments {
  constructor(private readonly http: HTTPClient) {}

  async list(
    params?: ListCustomerPaymentsQuery
  ): Promise<ListCustomerPaymentsResponse['customerpayments']> {
    const { customerpayments } = await this.http.get<ListCustomerPaymentsResponse>({
      path: ['customerpayments'],
      query: params,
    })
    return customerpayments
  }

  async create(data: CreatePaymentRequest): Promise<CreatePaymentResponse['payment']> {
    const { payment } = await this.http.post<CreatePaymentResponse>({
      path: ['customerpayments'],
      body: data,
    })
    return payment
  }

  async updateCustomField(
    customerPaymentId: string,
    data: UpdateCustomerPaymentCustomFieldsRequest[]
  ): Promise<UpdateCustomerpaymentCustomfieldResponse> {
    return this.http.put<UpdateCustomerpaymentCustomfieldResponse>({
      path: ['customerpayment', customerPaymentId, 'customfields'],
      body: data,
    })
  }

  async get(paymentId: string): Promise<GetPaymentResponse['payment']> {
    const { payment } = await this.http.get<GetPaymentResponse>({
      path: ['customerpayments', paymentId],
    })
    return payment
  }

  async update(
    paymentId: string,
    data: UpdatePaymentRequest
  ): Promise<UpdatePaymentResponse['payment']> {
    const { payment } = await this.http.put<UpdatePaymentResponse>({
      path: ['customerpayments', paymentId],
      body: data,
    })
    return payment
  }

  async delete(paymentId: string): Promise<DeletePaymentResponse> {
    return this.http.delete<DeletePaymentResponse>({ path: ['customerpayments', paymentId] })
  }
}
