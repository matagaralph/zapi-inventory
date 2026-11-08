import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetPaymentResponse,
  ListCustomerPaymentsQuery,
  ListCustomerPaymentsResponse,
  UpdatePaymentRequest,
  UpdatePaymentResponse,
} from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export interface UpdateCustomerPaymentCustomFieldsRequest {
  customfield_id?: string
  value?: string
}

/**
 * A payment object describes details regarding a particular customer payment. There can be multiple payments for a single invoice. Multiple invoices can be paid in a single payment as well.
 */
export function createCustomerPayments(http: HTTPClient) {
  return {
    async list(
      params?: ListCustomerPaymentsQuery
    ): Promise<ListCustomerPaymentsResponse['customerpayments']> {
      const { customerpayments } = await http.get<ListCustomerPaymentsResponse>({
        path: ['customerpayments'],
        query: params,
      })
      return customerpayments
    },

    async create(data: CreatePaymentRequest): Promise<CreatePaymentResponse['payment']> {
      const { payment } = await http.post<CreatePaymentResponse>({
        path: ['customerpayments'],
        body: data,
      })
      return payment
    },

    async updateCustomField(
      customerPaymentId: string,
      data: UpdateCustomerPaymentCustomFieldsRequest[]
    ): Promise<void> {
      await http.put({
        path: ['customerpayment', customerPaymentId, 'customfields'],
        body: data,
      })
    },

    async get(paymentId: string): Promise<GetPaymentResponse['payment']> {
      const { payment } = await http.get<GetPaymentResponse>({
        path: ['customerpayments', paymentId],
      })
      return payment
    },

    async update(
      paymentId: string,
      data: UpdatePaymentRequest
    ): Promise<UpdatePaymentResponse['payment']> {
      const { payment } = await http.put<UpdatePaymentResponse>({
        path: ['customerpayments', paymentId],
        body: data,
      })
      return payment
    },

    async delete(paymentId: string): Promise<void> {
      await http.delete({ path: ['customerpayments', paymentId] })
    },
  }
}

export type CustomerPayments = ReturnType<typeof createCustomerPayments>
