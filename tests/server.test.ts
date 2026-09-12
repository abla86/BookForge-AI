import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server } from 'node:http';
import { app } from '../server.ts';

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', () => resolve());
    server.once('error', reject);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP address');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('health endpoint reports BookForge platform state', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json() as Record<string, unknown>;
  assert.equal(body.status, 'ok');
  assert.equal(body.platform, 'BookForge AI');
  assert.equal(body.persistence, 'server-file-per-client');
  assert.equal(typeof body.hasGeminiKey, 'boolean');
  assert.equal(typeof body.model, 'string');
});

test('state endpoint rejects missing client identity', async () => {
  const response = await fetch(`${baseUrl}/api/state`);
  assert.equal(response.status, 400);
  const body = await response.json() as { error?: string };
  assert.equal(body.error, 'Invalid client id');
});

test('state endpoint rejects malformed client identity', async () => {
  const response = await fetch(`${baseUrl}/api/state`, {
    headers: { 'X-Client-Id': 'not-a-uuid' }
  });
  assert.equal(response.status, 400);
  const body = await response.json() as { error?: string };
  assert.equal(body.error, 'Invalid client id');
});
