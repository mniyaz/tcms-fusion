const COOKIE_NAME = 'docs_sess';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }

  const cookie = [
    `${COOKIE_NAME}=`,
    'Max-Age=0',
    'Path=/',
    'SameSite=Lax',
    'HttpOnly',
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
