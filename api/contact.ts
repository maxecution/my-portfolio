import type { VercelRequest, VercelResponse } from '@vercel/node';
import { normaliseInput, isEmailValid, isMessageValid } from '../lib/formUtils.ts';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import crypto from 'crypto';

const ownerEmail: string = 'max.zimmersmith@gmail.com'; // Update to relevant reply-to email
const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Very small HTML escape helper to avoid breaking markup
function escapeHtml(s: string) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getIp(request: VercelRequest): string | undefined {
  const headers = request.headers ?? {};
  const xfwd = headers['x-forwarded-for'];
  const ip = Array.isArray(xfwd) ? xfwd[0] : xfwd ?? request.socket?.remoteAddress;
  return ip?.toString();
}

function hashIdentifier(ip: string) {
  const SALT = process.env.RATE_LIMIT_SALT;
  if (!SALT) {
    throw new Error('RATE_LIMIT_UNAVAILABLE');
  }
  return crypto
    .createHash('sha256')
    .update(ip + SALT)
    .digest('hex');
}
export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message } = request.body || {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !normaliseInput(name) ||
      !normaliseInput(email) ||
      !isEmailValid(email) ||
      !normaliseInput(message) ||
      !isMessageValid(message)
    ) {
      return response.status(400).json({ error: 'Invalid payload' });
    }

    // Rate Limit check
    const identifier = getIp(request) || email.trim().toLowerCase();
    const key = `contact:${hashIdentifier(identifier)}`;
    const exists = await redis.get(key);
    if (exists) {
      return response.status(429).json({ error: 'You may only submit one message every 24 hours.' });
    }

    const subjectToUse =
      typeof subject === 'string' && subject.trim().length > 0 ? escapeHtml(subject.trim()) : `${name} enquiry`;
    const from = 'Portfolio Contact <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from,
      to: ownerEmail,
      subject: subjectToUse,
      html: `
        <div>
          <p><strong>From:</strong> ${escapeHtml(name)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message)}</p>
        </div>
      `,
      replyTo: email,
    });

    if (error) {
      return response.status(502).json({ error: error.message || 'Failed to send message.' });
    }

    // Set rate limit key with 24h TTL
    await redis.set(key, true, { ex: 60 * 60 * 24 });

    return response.status(200).json({ id: data?.id || 'ok' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return response.status(500).json({ error: message });
  }
}
