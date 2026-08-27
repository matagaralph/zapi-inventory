import type { GetSerialNumberResponse, ListSerialNumbersResponse } from '@zapi-inventory/typegen'

import type { HTTPClient } from '../http.ts'

export class SerialNumbers {
  constructor(private readonly http: HTTPClient) {}

  async list(
    itemId: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ListSerialNumbersResponse['serial_numbers']> {
    const { serial_numbers } = await this.http.get<ListSerialNumbersResponse>({
      path: ['items', 'serialnumbers'],
      query: { item_id: itemId, ...params },
    })
    return serial_numbers
  }

  async get(serialNumberId: string): Promise<GetSerialNumberResponse['serial_number']> {
    const { serial_number } = await this.http.get<GetSerialNumberResponse>({
      path: ['items', 'serialnumbers', serialNumberId],
    })
    return serial_number
  }
}
