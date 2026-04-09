import { getEnv } from '../../config/env.js';
import { createBraveSearchClient } from './brave-search.client.js';
import { SUPPORTED_SEARCH_PROVIDERS } from './search.types.js';

export function createSearchProvider(providerName = null) {
  const selected = (providerName || getEnv('DATA_COLLECTION_PROVIDER', 'brave')).toLowerCase();
  if (selected === 'brave') {
    return createBraveSearchClient();
  }

  throw new Error(
    `Unsupported DATA_COLLECTION_PROVIDER "${selected}". Supported: ${SUPPORTED_SEARCH_PROVIDERS.join(', ')}`
  );
}
