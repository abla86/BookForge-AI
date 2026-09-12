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

test('state endpoint rejects array payloads', async () => {
  const response = await fetch(`${baseUrl}/api/state`, {
    method: 'PUT',
    headers: {
      'X-Client-Id': '00000000-0000-4000-8000-000000000001',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([])
  });
  assert.equal(response.status, 400);
  const body = await response.json() as { error?: string };
  assert.equal(body.error, 'Invalid state payload');
});

test('state endpoint persists and returns a client snapshot', async () => {
  const clientId = '00000000-0000-4000-8000-000000000002';
  const snapshot = {
    activeProject: { id: 'test-project', title: 'Persistence Test' },
    allProjects: [{ id: 'test-project', title: 'Persistence Test' }],
    platformConfig: { brandName: 'BookForge AI' }
  };

  const saveResponse = await fetch(`${baseUrl}/api/state`, {
    method: 'PUT',
    headers: {
      'X-Client-Id': clientId,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(snapshot)
  });
  assert.equal(saveResponse.status, 204);

  const readResponse = await fetch(`${baseUrl}/api/state`, {
    headers: { 'X-Client-Id': clientId }
  });
  assert.equal(readResponse.status, 200);
  assert.deepEqual(await readResponse.json(), snapshot);
});
