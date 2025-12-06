import { describe, expect, spyOn, test } from 'bun:test';
import { ZohoInventory } from '../src/index';

describe('Unit Tests (Mocked)', () => {
  const zApi = new ZohoInventory({
    client: { id: 'mock', secret: 'mock' },
    orgId: 'mock-org',
    refreshToken: 'mock-token',
    dc: '.eu',
  });

  test('Module calls correct endpoint', async () => {
    const requestSpy = spyOn(zApi.apiClient, 'get').mockResolvedValue({
      code: 0,
      message: 'success',
      item: { item_id: '123', name: 'Mock Item' },
    } as any);

    await zApi.items.get('123');
    expect(requestSpy).toHaveBeenCalled();

    const calledArg = requestSpy.mock.calls[0][0];
    expect(calledArg.path).toEqual(['items', '123']);

    requestSpy.mockRestore();
  });
});
