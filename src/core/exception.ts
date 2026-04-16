import { type XiorError } from 'xior';

export class SDKException extends Error {
  override name = 'SDKException';
  readonly statusCode?: number;
  readonly url?: string;
  readonly data?: Record<string, unknown>;

  constructor(message: string, statusCode?: number, url?: string, data?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.url = url;
    this.data = data;
    Object.setPrototypeOf(this, SDKException.prototype);
  }

  static fromXiorError(err: XiorError): SDKException {
    const body = err.response?.data as Record<string, unknown> | undefined;
    const message = typeof body?.message === 'string' ? body.message : err.message;
    const url = (err.config?.baseURL ?? '') + (err.config?.url ?? '');
    return new SDKException(message, err.response?.status, url, body);
  }
}

export function isSDKException(err: unknown): err is SDKException {
  return err instanceof SDKException;
}
