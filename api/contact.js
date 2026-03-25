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
  const toEmail = process.env.CONTACT_NOTIFY_EMAIL;

  if (!apiKey || !from || !toEmail) {
    return res.status(503).json({
      success: false,
      error:
        'Email is not configured. Set RESEND_API_KEY, RESEND_FROM, and CONTACT_NOTIFY_EMAIL in your host environment (e.g. Vercel → Settings → Environment Variables).'
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
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid request body' });
  }

  const dealership = (body.dealership || '').trim().slice(0, 200);
  const contactName = (body.contactName || '').trim().slice(0, 120);
  const email = (body.email || '').trim().slice(0, 254);
  const phone = (body.phone || '').trim().slice(0, 40);
  const leadVolume = (body.leadVolume || '').trim().slice(0, 50);
  const crm = (body.crm || '').trim().slice(0, 120);
  const message = (body.message || '').trim().slice(0, 5000);
  const source = (body.source || '').trim().slice(0, 500);

  if (!dealership || !contactName || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  const row = (label, value) =>
    `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;width:200px;">${escapeHtml(
      label
    )}</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(value || '—')}</td></tr>`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;">
<p style="margin:0 0 16px;font-size:14px;color:#64748b;">New contact / demo request from vertexbdcllc.com</p>
<table style="border-collapse:collapse;width:100%;max-width:640px;">${row('Company / Dealership', dealership)}${row(
    'Contact name',
    contactName
  )}${row('Email', email)}${row('Phone', phone)}${row('Monthly lead volume', leadVolume)}${row(
    'CRM',
    crm
  )}${row('Submitted from', source)}</table>
<p style="margin:16px 0 8px;font-weight:600;">Message</p>
<div style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;white-space:pre-wrap;">${escapeHtml(
    message || '—'
  )}</div>
</body></html>`;

  const text = [
    'New contact / demo request — Vertex BDC',
    '',
    `Company: ${dealership}`,
    `Contact: ${contactName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Lead volume: ${leadVolume || '—'}`,
    `CRM: ${crm || '—'}`,
    `Submitted from: ${source || '—'}`,
    '',
    'Message:',
    message || '—'
  ].join('\n');

  const subject = `Demo request: ${safeSubjectPart(dealership, 80)} — ${safeSubjectPart(contactName, 40)}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [toEmail],
      replyTo: email,
      subject,
      html,
      text
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ success: false, error: 'Could not send your message. Please try again later.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again later.' });
  }
};
