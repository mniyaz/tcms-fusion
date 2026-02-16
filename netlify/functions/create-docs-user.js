const { createDocsUser, getHygraphConfig } = require('./lib/hygraph');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }

  const adminSecret = process.env.DOCS_ADMIN_SECRET;
  if (!adminSecret) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'DOCS_ADMIN_SECRET not set' }),
    };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token !== adminSecret) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Unauthorized' }),
    };
  }

  const { endpoint } = getHygraphConfig();
  if (!endpoint) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Hygraph not configured (HYGRAPH_ENDPOINT, HYGRAPH_TOKEN)' }),
    };
  }

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

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!username || !password) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'username and password required' }),
    };
  }

  try {
    const user = await createDocsUser(username, password);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, id: user?.id, username: user?.username }),
    };
  } catch (e) {
    const conflict = e.message && (e.message.includes('Unique') || e.message.includes('duplicate'));
    return {
      statusCode: conflict ? 409 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: e.message || 'Create failed' }),
    };
  }
};
