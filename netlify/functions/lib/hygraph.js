const crypto = require('crypto');

const SCRYPT_KEY_LEN = 64;
const SALT_LEN = 16;

function getHygraphConfig() {
  const endpoint = process.env.HYGRAPH_ENDPOINT;
  const token = process.env.HYGRAPH_TOKEN;
  return { endpoint, token };
}

function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(SALT_LEN);
  const h = crypto.scryptSync(password, s, SCRYPT_KEY_LEN);
  return {
    salt: s.toString('base64'),
    hash: h.toString('base64'),
  };
}

function verifyPassword(password, saltB64, hashB64) {
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  const actual = crypto.scryptSync(password, salt, SCRYPT_KEY_LEN);
  return crypto.timingSafeEqual(expected, actual);
}

async function hygraphRequest(endpoint, token, query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hygraph ${res.status}: ${text}`);
  }
  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

/**
 * Fetch a single docs user by username.
 * Hygraph model: Gituser (Node/Entity) with username, passwordHash, passwordSalt
 */
async function getDocsUserByUsername(username) {
  const { endpoint, token } = getHygraphConfig();
  if (!endpoint || !token) return null;
  const data = await hygraphRequest(
    endpoint,
    token,
    `query GetGitUser($username: String!) {
      gitusers(where: { username: $username }, first: 1) {
        id
        username
        passwordHash
        passwordSalt
      }
    }`,
    { username }
  );
  const list = data?.gitusers ?? data?.gitUsers ?? [];
  return list[0] || null;
}

/**
 * Create a docs user in Hygraph (GitUser model, requires mutation token permission).
 */
async function createDocsUser(username, password) {
  const { endpoint, token } = getHygraphConfig();
  if (!endpoint || !token) throw new Error('Hygraph not configured');
  const { salt, hash } = hashPassword(password);
  const data = await hygraphRequest(
    endpoint,
    token,
    `mutation CreateGitUser($username: String!, $passwordHash: String!, $passwordSalt: String!) {
      createGituser(data: {
        username: $username
        passwordHash: $passwordHash
        passwordSalt: $passwordSalt
      }) {
        id
        username
      }
    }`,
    { username, passwordHash: hash, passwordSalt: salt }
  );
  return data?.createGituser ?? data?.createGitUser;
}

/**
 * Publish a Gituser so it is available to the Content API (when using stages).
 */
async function publishGituser(id) {
  const { endpoint, token } = getHygraphConfig();
  if (!endpoint || !token) throw new Error('Hygraph not configured');
  const data = await hygraphRequest(
    endpoint,
    token,
    `mutation PublishGitUser($id: ID!) {
      publishGituser(where: { id: $id }) {
        id
      }
    }`,
    { id }
  );
  return data?.publishGituser ?? data?.publishGitUser;
}

/**
 * Delete a docs user (GitUser) by id.
 */
async function deleteDocsUser(id) {
  const { endpoint, token } = getHygraphConfig();
  if (!endpoint || !token) throw new Error('Hygraph not configured');
  const data = await hygraphRequest(
    endpoint,
    token,
    `mutation DeleteGitUser($id: ID!) {
      deleteGituser(where: { id: $id }) {
        id
      }
    }`,
    { id }
  );
  return data?.deleteGituser ?? data?.deleteGitUser;
}

/**
 * List all docs users (Gituser, for admin).
 */
async function listDocsUsers() {
  const { endpoint, token } = getHygraphConfig();
  if (!endpoint || !token) return [];
  const data = await hygraphRequest(
    endpoint,
    token,
    `query ListGitUsers {
      gitusers(orderBy: username_ASC) {
        id
        username
      }
    }`
  );
  return data?.gitusers ?? data?.gitUsers ?? [];
}

module.exports = {
  getHygraphConfig,
  hashPassword,
  verifyPassword,
  getDocsUserByUsername,
  createDocsUser,
  publishGituser,
  deleteDocsUser,
  listDocsUsers,
};
