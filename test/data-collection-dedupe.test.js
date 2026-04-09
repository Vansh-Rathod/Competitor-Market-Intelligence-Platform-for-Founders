import test from 'node:test';
import assert from 'node:assert/strict';
import { dedupeCandidates } from '../src/agents/data-collection/dedupe.js';

test('dedupeCandidates prefers unique domain', () => {
  const input = [
    { company_name: 'Acme', domain: 'acme.ai' },
    { company_name: 'Acme AI', domain: 'acme.ai' },
    { company_name: 'Beta', domain: 'beta.com' },
  ];

  const output = dedupeCandidates(input);
  assert.equal(output.length, 2);
});

test('dedupeCandidates falls back to company name when no domain', () => {
  const input = [
    { company_name: 'Acme AI', domain: null },
    { company_name: 'acme ai', domain: null },
    { company_name: 'Beta', domain: null },
  ];

  const output = dedupeCandidates(input);
  assert.equal(output.length, 2);
});
