const mockSend = jest.fn();

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
  };
});

import handler from '../api/contact';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  });

  afterEach(() => {
    jest.resetAllMocks();
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

  test('returns 502 when Resend returns an error', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: 'Resend failure' },
    });

    const request = {
      method: 'POST',
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
});
