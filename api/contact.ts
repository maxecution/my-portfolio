import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      !name.trim() ||
      !email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !message.trim()
    ) {
      return response.status(400).json({ error: 'Invalid payload' });
    }

    const subjectToUse = typeof subject === 'string' && subject.trim().length > 0 ? subject.trim() : `${name} enquiry`;
    const from = 'Portfolio Contact <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from,
      to: 'max.zimmersmith@gmail.com',
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
      return response.status(502).json({ error: error.message || 'Failed to send email' });
    }

    return response.status(200).json({ id: data?.id || 'ok' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return response.status(500).json({ error: message });
  }
}

// Very small HTML escape helper to avoid breaking markup
function escapeHtml(s: string) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
