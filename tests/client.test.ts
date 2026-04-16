import { describe, test, expect, beforeEach, afterEach } from 'vite-plus/test';
import MockPlugin from 'xior/plugins/mock';

import { HttpClient } from '../src/client';
import { SDKException, isSDKException } from '../src/core/exception';

function createClient(opts?: ConstructorParameters<typeof HttpClient>[1]) {
  return new HttpClient('https://api.example.com', { retryTimes: 0, ...opts });
}

function getMock(client: HttpClient): MockPlugin {
  return new MockPlugin((client as any).httpClient, {
    onNoMatch: 'throwException',
  });
}

describe('SDKException', () => {
  let client: HttpClient;
  let mock: MockPlugin;

  beforeEach(() => {
    client = createClient();
    mock = getMock(client);
  });

  afterEach(() => mock.reset());

  test('is instanceof Error and SDKException', async () => {
    mock.onGet('/items').reply(404, { message: 'Item not found' });
    try {
      await client.get({ path: ['items'] });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(SDKException);
    }
  });

  test('captures statusCode', async () => {
    mock.onGet('/items').reply(403, { message: 'Forbidden' });
    await expect(client.get({ path: ['items'] })).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  test('uses body.message over xior message', async () => {
    mock.onGet('/items').reply(422, { message: 'Zoho says no' });
    try {
      await client.get({ path: ['items'] });
    } catch (err) {
      expect((err as SDKException).message).toBe('Zoho says no');
    }
  });

  test('falls back to xior message when body has no message', async () => {
    mock.onGet('/items').reply(500, {});
    try {
      await client.get({ path: ['items'] });
    } catch (err) {
      expect(typeof (err as SDKException).message).toBe('string');
      expect((err as SDKException).message.length).toBeGreaterThan(0);
    }
  });

  test('captures response data', async () => {
    const body = { message: 'Not found', code: 5 };
    mock.onGet('/items').reply(404, body);
    try {
      await client.get({ path: ['items'] });
    } catch (err) {
      expect((err as SDKException).data).toEqual(body);
    }
  });

  test('captures the full url', async () => {
    mock.onGet('/items').reply(500, { message: 'Error' });
    try {
      await client.get({ path: ['items'] });
    } catch (err) {
      expect((err as SDKException).url).toContain('items');
    }
  });
});

describe('isSDKException', () => {
  test('returns true for SDKException instances', async () => {
    const client = createClient();
    const mock = getMock(client);
    mock.onGet('/items').reply(400, { message: 'Bad' });
    try {
      await client.get({ path: ['items'] });
    } catch (err) {
      expect(isSDKException(err)).toBe(true);
    }
    mock.reset();
  });

  test('returns false for plain errors', () => {
    expect(isSDKException(new Error('nope'))).toBe(false);
  });

  test('returns false for non-errors', () => {
    expect(isSDKException('string')).toBe(false);
    expect(isSDKException(null)).toBe(false);
  });
});

describe('GET', () => {
  let client: HttpClient;
  let mock: MockPlugin;

  beforeEach(() => {
    client = createClient();
    mock = getMock(client);
  });

  afterEach(() => mock.reset());

  test('returns response data', async () => {
    const data = { id: 1, name: 'Widget' };
    mock.onGet('/items/1').reply(200, data);
    const result = await client.get({ path: ['items', '1'] });
    expect(result).toEqual(data);
  });

  test('builds path from array', async () => {
    mock.onGet('/inventory/v1/items').reply(200, { ok: true });
    const result = await client.get<{ ok: boolean }>({
      path: ['inventory', 'v1', 'items'],
    });
    expect(result.ok).toBe(true);
  });

  test('filters empty path segments', async () => {
    mock.onGet('/items').reply(200, { ok: true });
    const result = await client.get<{ ok: boolean }>({
      path: ['', 'items', ''],
    });
    expect(result.ok).toBe(true);
  });

  test('sends query params', async () => {
    mock.onGet('/items').reply(200, []);
    await client.get({ path: ['items'], query: { page: 1, organization_id: 'org_1' } });
    const req = mock.history.get?.[0];
    expect(req?.params).toMatchObject({ page: 1, organization_id: 'org_1' });
  });

  test('sends custom headers', async () => {
    mock.onGet('/items').reply(200, {});
    await client.get({ path: ['items'], headers: { 'x-store-id': 'abc' } });
    const req = mock.history.get?.[0];
    expect(req?.headers?.['x-store-id']).toBe('abc');
  });

  test('overrides timeout per-request', async () => {
    mock.onGet('/items').reply(200, {});
    await client.get({ path: ['items'], timeout: 500 });
    const req = mock.history.get?.[0];
    expect(req?.timeout).toBe(500);
  });
});

describe('POST', () => {
  let client: HttpClient;
  let mock: MockPlugin;

  beforeEach(() => {
    client = createClient();
    mock = getMock(client);
  });

  afterEach(() => mock.reset());

  test('sends body and returns response data', async () => {
    const payload = { name: 'New Item', rate: 9.99 };
    const response = {
      code: 0,
      message: 'The item has been created.',
      item: { item_id: 'itm_1', ...payload },
    };
    mock.onPost('/items').reply(201, response);
    const result = await client.post({ path: ['items'], body: payload });
    expect(result).toEqual(response);
  });

  test('sends correct body', async () => {
    const payload = { name: 'Item A', sku: 'SKU-001' };
    mock.onPost('/items').reply(201, { code: 0, message: 'Created' });
    await client.post({ path: ['items'], body: payload });
    const req = mock.history.post?.[0];
    expect(req?.data).toEqual(payload);
  });
});

describe('PUT', () => {
  let client: HttpClient;
  let mock: MockPlugin;

  beforeEach(() => {
    client = createClient();
    mock = getMock(client);
  });

  afterEach(() => mock.reset());

  test('sends body and returns response data', async () => {
    const payload = { name: 'Updated Item' };
    const response = {
      code: 0,
      message: 'Item updated.',
      item: { item_id: 'itm_1', ...payload },
    };
    mock.onPut('/items/itm_1').reply(200, response);
    const result = await client.put({ path: ['items', 'itm_1'], body: payload });
    expect(result).toEqual(response);
  });
});

describe('PATCH', () => {
  let client: HttpClient;
  let mock: MockPlugin;

  beforeEach(() => {
    client = createClient();
    mock = getMock(client);
  });

  afterEach(() => mock.reset());

  test('sends body and returns response data', async () => {
    const payload = { status: 'active' };
    const response = {
      code: 0,
      message: 'Item updated.',
      item: { item_id: 'itm_1', ...payload },
    };
    mock.onPatch('/items/itm_1').reply(200, response);
    const result = await client.patch({ path: ['items', 'itm_1'], body: payload });
    expect(result).toEqual(response);
  });
});

describe('DELETE', () => {
  let client: HttpClient;
  let mock: MockPlugin;

  beforeEach(() => {
    client = createClient();
    mock = getMock(client);
  });

  afterEach(() => mock.reset());

  test('returns response data', async () => {
    mock.onDelete('/items/itm_1').reply(200, { code: 0, message: 'The item has been deleted.' });
    const result = await client.delete<{ code: number; message: string }>({
      path: ['items', 'itm_1'],
    });
    expect(result.code).toBe(0);
    expect(result.message).toContain('deleted');
  });
});

describe('error handling', () => {
  let client: HttpClient;
  let mock: MockPlugin;

  beforeEach(() => {
    client = createClient();
    mock = getMock(client);
  });

  afterEach(() => mock.reset());

  test('throws SDKException on 4xx', async () => {
    mock.onGet('/items').reply(401, { message: 'Invalid token' });
    await expect(client.get({ path: ['items'] })).rejects.toBeInstanceOf(SDKException);
  });

  test('throws SDKException on 5xx', async () => {
    mock.onPost('/items').reply(500, { message: 'Internal Server Error' });
    await expect(client.post({ path: ['items'], body: {} })).rejects.toBeInstanceOf(SDKException);
  });

  test('throws SDKException on network error', async () => {
    mock.onGet('/items').networkError();
    await expect(client.get({ path: ['items'] })).rejects.toBeInstanceOf(SDKException);
  });

  test('re-throws non-xior errors as-is', async () => {
    const nonXiorError = new TypeError('Something else');
    mock.onGet('/items').reply(() => {
      throw nonXiorError;
    });
    await expect(client.get({ path: ['items'] })).rejects.toThrow(TypeError);
  });
});

describe('authInterceptor', () => {
  test('injects Authorization header on every request', async () => {
    const client = createClient({
      authInterceptor: (config) => {
        config.headers = { ...config.headers, authorization: 'Zoho-oauthtoken tok_abc' };
        return config;
      },
    });
    const mock = getMock(client);
    mock.onGet('/items').reply(200, {});
    await client.get({ path: ['items'] });
    const req = mock.history.get?.[0];
    expect(req?.headers?.authorization).toBe('Zoho-oauthtoken tok_abc');
    mock.reset();
  });

  test('authInterceptor runs before request headers', async () => {
    const client = createClient({
      authInterceptor: async (config) => {
        config.headers = { ...config.headers, 'x-auth': 'injected' };
        return config;
      },
    });
    const mock = getMock(client);
    mock.onGet('/items').reply(200, {});
    await client.get({ path: ['items'], headers: { 'x-custom': 'yes' } });
    const req = mock.history.get?.[0];
    expect(req?.headers?.['x-auth']).toBe('injected');
    expect(req?.headers?.['x-custom']).toBe('yes');
    mock.reset();
  });
});

describe('constructor config', () => {
  test('uses provided timeout as default', async () => {
    const client = new HttpClient('https://api.example.com', { timeout: 3_000, retryTimes: 0 });
    const mock = getMock(client);
    mock.onGet('/items').reply(200, {});
    await client.get({ path: ['items'] });
    expect((client as any).httpClient.config.timeout).toBe(3_000);
    mock.reset();
  });

  test('per-request timeout overrides the default', async () => {
    const client = new HttpClient('https://api.example.com', { timeout: 10_000, retryTimes: 0 });
    const mock = getMock(client);
    mock.onGet('/items').reply(200, {});
    await client.get({ path: ['items'], timeout: 1_500 });
    const req = mock.history.get?.[0];
    expect(req?.timeout).toBe(1_500);
    mock.reset();
  });
});
