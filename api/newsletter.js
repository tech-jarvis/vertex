const { Resend } = require('resend');
const { escapeHtml, safeSubjectPart } = require('./email-helpers');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const toEmail = process.env.NEWSLETTER_NOTIFY_EMAIL || process.env.CONTACT_NOTIFY_EMAIL;

  if (!apiKey || !from || !toEmail) {
    return res.status(503).json({
      success: false,
      error:
        'Email is not configured. Set RESEND_API_KEY, RESEND_FROM, and CONTACT_NOTIFY_EMAIL (or NEWSLETTER_NOTIFY_EMAIL) in your host environment.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }
  }

  const email = (body && body.email ? String(body.email) : '').trim().slice(0, 254);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  const source = (body.source || '').trim().slice(0, 500);
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;">
<p><strong>Newsletter signup</strong> from vertexbdcllc.com</p>
<p>Email: ${escapeHtml(email)}</p>
<p>Page: ${escapeHtml(source || '—')}</p>
</body></html>`;
  const text = `Newsletter signup\n\nEmail: ${email}\nPage: ${source || '—'}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [toEmail],
      replyTo: email,
      subject: `Newsletter: ${safeSubjectPart(email, 100)}`,
      html,
      text
    });

    if (error) {
      console.error('Resend newsletter error:', error);
      return res.status(500).json({ success: false, error: 'Could not subscribe right now. Try again later.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again later.' });
  }
};
