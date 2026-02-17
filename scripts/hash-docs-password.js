#!/usr/bin/env node
/**
 * Generate passwordHash and passwordSalt for a DocsUser (same algo as Netlify login).
 * Usage: node scripts/hash-docs-password.js [username] [password]
 *        PASSWORD=mysecret node scripts/hash-docs-password.js myuser
 */
const crypto = require('crypto');
const SCRYPT_KEY_LEN = 64;
const SALT_LEN = 16;

const username = process.argv[2] || 'user';
const password = process.argv[3] || process.env.PASSWORD || 'change-me';

const salt = crypto.randomBytes(SALT_LEN);
const hash = crypto.scryptSync(password, salt, SCRYPT_KEY_LEN);

console.log('Copy into Hygraph DocsUser (or use POST /api/create-docs-user):');
console.log('  username:', username);
console.log('  passwordSalt:', salt.toString('base64'));
console.log('  passwordHash:', hash.toString('base64'));
console.log('\nLogin with username:', username, 'and the password you chose.');
