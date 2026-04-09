import test from 'node:test';
import assert from 'node:assert/strict';
import { createBraveSearchClient } from '../src/integrations/search/brave-search.client.js';

test('createBraveSearchClient maps web results to canonical shape', async () => {
  const originalFetch = global.fetch;
  process.env.BRAVE_API_KEY = 'test-key';
  process.env.BRAVE_API_BASE_URL = 'https://api.search.brave.com/res/v1/web/search';

  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      web: {
        results: [
          {
            title: 'Acme AI',
            url: 'https://acme.ai',
            description: 'AI accounting product',
          },
        ],
      },
    }),
  });

  try {
    const client = createBraveSearchClient();
    const response = await client.search('ai accounting competitors', { count: 3, timeoutMs: 1000 });
    assert.equal(response.items.length, 1);
    assert.equal(response.items[0].provider, 'brave');
    assert.equal(response.diagnostics.provider, 'brave');
  } finally {
    global.fetch = originalFetch;
  }
});
