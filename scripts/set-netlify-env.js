#!/usr/bin/env node
/**
 * Set Netlify environment variables from .env using Netlify CLI.
 * Run from project root after: netlify login && netlify link
 *
 * Usage: node scripts/set-netlify-env.js
 *    or: npm run netlify:env:set
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('No .env file found. Create one from .env.example.');
  process.exit(1);
}

const lines = fs.readFileSync(envPath, 'utf8').split('\n');
const vars = [];
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq <= 0) continue;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim();
  if (key) vars.push({ key, value });
}

if (vars.length === 0) {
  console.error('No KEY=value pairs found in .env');
  process.exit(1);
}

console.log(`Setting ${vars.length} variable(s) on Netlify...`);
const cwd = path.join(__dirname, '..');
for (const { key, value } of vars) {
  try {
    // Use execSync with array form to avoid shell quoting issues
    execSync('npx', ['netlify', 'env:set', key, value], {
      stdio: 'inherit',
      cwd,
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    console.log(`  ✓ ${key}`);
  } catch (e) {
    console.error(`  ✗ ${key} failed:`, e.message || e.status);
    process.exitCode = 1;
  }
}
console.log('Done.');
