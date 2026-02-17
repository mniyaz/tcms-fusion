const crypto = require('crypto');
const {
  getDocsUserByUsername,
  verifyPassword,
  getHygraphConfig,
} = require('./lib/hygraph');

const COOKIE_NAME = 'docs_sess';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function createSignedCookie(secret) {
  const payload = JSON.stringify({ t: Date.now() });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function checkEnvAuth(user, pass) {
  const username = (process.env.DOCS_USERNAME || 'admin').trim();
  const password = (process.env.DOCS_PASSWORD || 'docs').trim();
  return user === username && pass === password;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }

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
  if (!user || !pass) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Username and password required' }),
    };
  }

  const username = String(user).trim();
  let valid = false;
  const envUser = (process.env.DOCS_USERNAME || '').trim();
  const envPassSet = !!(process.env.DOCS_PASSWORD || '').trim();
  const isProduction = process.env.CONTEXT === 'production';

  // In production: try env first when both DOCS_USERNAME and DOCS_PASSWORD are set (avoids 401 when Hygraph fails or vars not in scope)
  if (isProduction && envUser && envPassSet) {
    valid = checkEnvAuth(user, pass);
    if (valid) console.log('Login: succeeded via env fallback (production)');
  }
  if (!valid && envUser && username === envUser) {
    valid = checkEnvAuth(user, pass);
  }
  if (!valid) {
    const { endpoint } = getHygraphConfig();
    if (endpoint) {
      try {
        const docUser = await getDocsUserByUsername(username);
        if (docUser && docUser.passwordHash && docUser.passwordSalt) {
          valid = verifyPassword(pass, docUser.passwordSalt, docUser.passwordHash);
          if (valid) console.log('Login: succeeded via Hygraph');
        }
      } catch (e) {
        console.error('Hygraph login error:', e.message);
      }
    }
  }
  if (!valid) {
    valid = checkEnvAuth(user, pass);
  }
  if (!valid) {
    if (isProduction && (!envUser || !envPassSet)) {
      console.warn('Login: 401 in production. Set DOCS_USERNAME and DOCS_PASSWORD in Netlify with scope including Functions, then redeploy.');
    }
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Invalid username or password' }),
    };
  }

  const value = createSignedCookie(secret);
  const isProd = isProduction;
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
