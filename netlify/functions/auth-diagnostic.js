/**
 * Safe diagnostic: returns whether env vars are visible to the function.
 * Use to debug 401 on production login. Remove or protect in production if desired.
 * GET /api/auth-diagnostic
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: '' };
  }
  const envUser = process.env.DOCS_USERNAME;
  const envPass = process.env.DOCS_PASSWORD;
  const hygraph = !!process.env.HYGRAPH_ENDPOINT;
  const secret = process.env.DOCS_SESSION_SECRET;
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deploy_context: process.env.CONTEXT || '(not set)',
      env_fallback_configured: !!(envUser && envPass),
      hygraph_configured: hygraph,
      session_secret_set: !!secret,
      hint: !envUser && !envPass ? 'Set DOCS_USERNAME and DOCS_PASSWORD in Netlify (scope: Functions), then trigger a new production deploy. Env vars are injected at deploy time.' : undefined,
    }),
  };
};
