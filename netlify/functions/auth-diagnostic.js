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
      env_fallback_configured: !!(envUser && envPass),
      hygraph_configured: hygraph,
      session_secret_set: !!secret,
      hint: 'If env_fallback_configured is false, set DOCS_USERNAME and DOCS_PASSWORD in Netlify with scope including Functions, then redeploy.',
    }),
  };
};
