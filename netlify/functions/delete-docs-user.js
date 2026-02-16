const { deleteDocsUser, getDocsUserByUsername, listDocsUsers, getHygraphConfig } = require('./lib/hygraph');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'DELETE') {
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
      body: JSON.stringify({ ok: false, error: 'Hygraph not configured' }),
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

  let id = body.id;
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  if (!id && username) {
    const user = await getDocsUserByUsername(username);
    if (!user) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'User not found' }),
      };
    }
    id = user.id;
  }
  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'id or username required' }),
    };
  }

  try {
    const deleted = await deleteDocsUser(id);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, id: deleted?.id }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: e.message || 'Delete failed' }),
    };
  }
};
