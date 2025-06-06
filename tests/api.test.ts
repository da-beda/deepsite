import { describe, it, expect, afterEach, vi } from 'vitest';
import request from 'supertest';
import app from '../server.ts';
import { ReadableStream } from 'node:stream/web';
import { TextEncoder } from 'node:util';

describe('API endpoints', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/ask-ai streams response', async () => {
    const data = 'data: {"choices":[{"delta":{"content":"Hello"}}]}\n';
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(data));
        controller.close();
      },
    });
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(stream))));
    const res = await request(app)
      .post('/api/ask-ai')
      .send({ prompt: 'hi', ApiKey: 'k', ApiUrl: 'u', Model: 'm', provider: 'local' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello');
  });

  it('POST /api/ask-ai validates prompt', async () => {
    const res = await request(app).post('/api/ask-ai').send({});
    expect(res.status).toBe(400);
  });

  it('GET /api/login returns redirect url', async () => {
    const res = await request(app).get('/api/login');
    expect(res.status).toBe(200);
    expect(res.body.redirectUrl).toBeDefined();
  });

  it('GET /api/remix returns html', async () => {
    const res = await request(app).get('/api/remix/user/repo');
    expect(res.status).toBe(200);
    expect(res.body.html).toContain('Remixed user/repo');
    expect(res.body.path).toBe('user/repo');
  });
});
