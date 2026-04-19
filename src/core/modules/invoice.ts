import type { HttpClient } from '@/client';
import { MODULES } from '@/core/constants';
import type { CreateInvoice, Invoice } from '@/types/invoice';

interface InvoiceOptions {
  send?: boolean;
  ignore_auto_number_generation: boolean;
}

export class InvoiceResource {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  async get(invoiceId: string): Promise<Invoice> {
    const res = await this.http.get<{ invoice: Invoice }>({
      path: [MODULES.INVOICE.PATH, invoiceId],
    });
    return res[MODULES.INVOICE.RESPONSE_KEY.SINGULAR];
  }

  async create(invoice: CreateInvoice, options: InvoiceOptions): Promise<Invoice> {
    const res = await this.http.post<{ invoice: Invoice }>({
      path: [MODULES.INVOICE.PATH],
      body: invoice,
      query: {
        send: options.send ?? false,
        ignore_auto_number_generation: options.ignore_auto_number_generation,
      },
    });
    return res[MODULES.INVOICE.RESPONSE_KEY.SINGULAR];
  }

  async update(
    invoiceId: string,
    invoice: CreateInvoice,
    options: InvoiceOptions,
  ): Promise<Invoice> {
    const res = await this.http.put<{ invoice: Invoice }>({
      path: [MODULES.INVOICE.PATH, invoiceId],
      body: invoice,
      query: {
        send: options.send ?? false,
        ignore_auto_number_generation: options.ignore_auto_number_generation,
      },
    });
    return res[MODULES.INVOICE.RESPONSE_KEY.SINGULAR];
  }

  async delete(invoiceId: string) {
    return this.http.delete({
      path: [MODULES.INVOICE.PATH, invoiceId],
    });
  }
}
