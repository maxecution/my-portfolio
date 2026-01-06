const mockSend = jest.fn();
const mockKvGet = jest.fn();
const mockKvSet = jest.fn();

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: mockKvGet,
    set: mockKvSet,
  })),
}));

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
  };
});

// importing after mocks to avoid hoisting issues
import handler from '../api/contact';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

function createMockResponse() {
  const response: Partial<VercelResponse> = {};
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  response.setHeader = jest.fn();
  return response as VercelResponse;
}

describe('/api/contact handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockReset();
    mockKvGet.mockReset();
    mockKvSet.mockReset();
    process.env.RATE_LIMIT_SALT = 'test-salt';

    mockKvGet.mockResolvedValue(null);
    mockKvSet.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('falls back to empty headers object when headers is undefined', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'empty-headers' }, error: null });

    const request = {
      method: 'POST',
      // headers intentionally undefined to trigger fallback
      body: { name: 'NoHeader', email: 'noheader@example.com', message: 'Hello' },
    } as unknown as VercelRequest;

    const response = createMockResponse();
    await handler(request, response);

    expect(mockSend).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);

    const expectedHash = `contact:${crypto
      .createHash('sha256')
      .update('noheader@example.com' + process.env.RATE_LIMIT_SALT)
      .digest('hex')}`;

    expect(mockKvSet).toHaveBeenCalledWith(expectedHash, true, { ex: 60 * 60 * 24 });
  });

  test('uses x-forwarded-for string as IP', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: '1' }, error: null });

    const request = {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4' },
      body: { name: 'Alice', email: 'alice@example.com', message: 'Hi' },
    } as Partial<VercelRequest>;

    const response = createMockResponse();
    await handler(request as VercelRequest, response);

    expect(mockSend).toHaveBeenCalled();
  });

  test('uses first element of x-forwarded-for array as IP', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: '2' }, error: null });

    const ip = '5.6.7.8';
    const request = {
      method: 'POST',
      headers: { 'x-forwarded-for': [ip, '9.10.11.12'] },
      body: { name: 'Bob', email: 'bob@example.com', message: 'Hello' },
    } as Partial<VercelRequest>;

    const response = createMockResponse();
    await handler(request as VercelRequest, response);

    expect(mockSend).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);

    const expectedHash = `contact:${crypto
      .createHash('sha256')
      .update(ip + process.env.RATE_LIMIT_SALT)
      .digest('hex')}`;

    expect(mockKvSet).toHaveBeenCalledWith(expectedHash, true, { ex: 60 * 60 * 24 });
  });

  test('returns 405 for non-POST requests', async () => {
    const request = { method: 'GET' } as VercelRequest;
    const response = createMockResponse();

    await handler(request, response);

    expect(response.setHeader).toHaveBeenCalledWith('Allow', ['POST']);
    expect(response.status).toHaveBeenCalledWith(405);
    expect(response.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
  });

  test('returns 400 for invalid payload', async () => {
    const request = {
      method: 'POST',
      headers: {},
      body: { name: '', email: 'bad', message: '' },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Invalid payload' });
  });

  test('returns 400 when POST body is missing entirely', async () => {
    const request = {
      method: 'POST',
      headers: {},
      // body intentionally omitted
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Invalid payload' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('successfully sends email with derived subject', async () => {
    mockSend.mockResolvedValueOnce({
      data: { id: 'email-id' },
      error: null,
    });

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Alice <script>',
        email: 'alice@example.com',
        message: 'Hello & goodbye',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Alice <script> enquiry',
        replyTo: 'alice@example.com',
        html: expect.stringContaining('&lt;script&gt;'),
      })
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ id: 'email-id' });
  });

  test('uses explicit subject when provided', async () => {
    mockSend.mockResolvedValueOnce({
      data: {},
      error: null,
    });

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Bob',
        email: 'bob@example.com',
        subject: '  Custom subject  ',
        message: 'Test',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Custom subject',
      })
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ id: 'ok' });
  });

  test('returns 429 when rate limit key exists', async () => {
    mockKvGet.mockResolvedValueOnce(true);

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Eowyn',
        email: 'eowyn@rohan.me',
        message: 'I am no man.',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(429);
    expect(response.json).toHaveBeenCalledWith({
      error: 'You may only submit one message every 24 hours.',
    });

    expect(mockSend).not.toHaveBeenCalled();
  });

  test('returns 502 when Resend returns an error', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: 'Resend failure' },
    });

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Charlie',
        email: 'charlie@example.com',
        message: 'Hi',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(502);
    expect(response.json).toHaveBeenCalledWith({ error: 'Resend failure' });
  });

  test('returns 502 with default message when Resend error has no message', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: {},
    });

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Faramir',
        email: 'faramir@gondor.me',
        message: 'I do not love the sword.',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(502);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Failed to send email',
    });
  });

  test('returns 500 on unexpected exception', async () => {
    mockSend.mockImplementationOnce(() => {
      throw new Error('Boom');
    });

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Dana',
        email: 'dana@example.com',
        message: 'Hello',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: 'Boom' });
  });

  test('returns 500 with generic message when non-Error is thrown', async () => {
    mockSend.mockImplementationOnce(() => {
      throw 'something very bad';
    });

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Gimli',
        email: 'gimli@erebor.me',
        message: 'And my axe!',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    });
  });

  test('returns 500 when RATE_LIMIT_SALT is not configured', async () => {
    delete process.env.RATE_LIMIT_SALT;

    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Test',
        email: 'test@example.com',
        message: 'Hello',
      },
    } as VercelRequest;

    const response = createMockResponse();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: 'RATE_LIMIT_SALT is not configured',
    });
  });
});
