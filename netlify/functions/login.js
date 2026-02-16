const crypto = require('crypto');

const COOKIE_NAME = 'docs_sess';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function createSignedCookie(secret) {
  const payload = JSON.stringify({ t: Date.now() });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }

  const username = process.env.DOCS_USERNAME || 'admin';
  const password = process.env.DOCS_PASSWORD || 'docs';
  const secret = process.env.DOCS_SESSION_SECRET || 'change-me-in-production';

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Invalid JSON' }),
    };
  }

  const { user, pass } = body;
  if (user !== username || pass !== password) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Invalid username or password' }),
    };
  }

  const value = createSignedCookie(secret);
  const isProd = process.env.CONTEXT === 'production';
  const cookie = [
    `${COOKIE_NAME}=${value}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
    'HttpOnly',
    ...(isProd ? ['Secure'] : []),
  ].join('; ');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookie,
    },
    body: JSON.stringify({ ok: true }),
  };
};
