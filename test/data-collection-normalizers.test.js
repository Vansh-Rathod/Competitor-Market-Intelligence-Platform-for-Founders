import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeDomain,
  looksLikeCompanyResult,
  normalizeSearchResultToCandidate,
} from '../src/agents/data-collection/normalizers.js';

test('normalizeDomain strips protocol and www', () => {
  assert.equal(normalizeDomain('https://www.Example.com/pricing'), 'example.com');
});

test('looksLikeCompanyResult filters social/wiki domains', () => {
  assert.equal(looksLikeCompanyResult({ url: 'https://www.linkedin.com/company/x' }), false);
  assert.equal(looksLikeCompanyResult({ url: 'https://acme.io' }), true);
});

test('normalizeSearchResultToCandidate maps fields', () => {
  const candidate = normalizeSearchResultToCandidate(
    {
      title: 'Acme AI - AI Accounting',
      url: 'https://acme.ai',
      snippet: 'Accounting platform for logistics businesses',
      provider: 'brave',
    },
    'ai accounting competitors'
  );

  assert.equal(candidate.company_name, 'Acme AI');
  assert.equal(candidate.domain, 'acme.ai');
  assert.equal(candidate.matched_query, 'ai accounting competitors');
  assert.equal(candidate.source, 'brave');
});
