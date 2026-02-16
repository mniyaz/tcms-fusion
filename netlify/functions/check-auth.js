const crypto = require('crypto');

const COOKIE_NAME = 'docs_sess';
const MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000; // 7 days

function verifySignedCookie(value, secret) {
  if (!value || !secret) return false;
  const parts = value.split('.');
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  if (sig !== expectedSig) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (!payload.t || Date.now() - payload.t > MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}

function getCookie(request, name) {
  const header = request.headers.cookie || request.headers.Cookie || '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1].trim()) : null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: '' };
  }

  const secret = process.env.DOCS_SESSION_SECRET || 'change-me-in-production';
  const value = getCookie(event, 'docs_sess');
  const valid = verifySignedCookie(value, secret);

  return {
    statusCode: valid ? 200 : 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: valid }),
  };
};
