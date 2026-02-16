import React, { useState } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { useAuth } from '../context/AuthContext';

/**
 * Login page for docs auth. Uses Netlify environment variables
 * DOCS_USERNAME and DOCS_PASSWORD (via /api/login).
 */
export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const searchParams = new URLSearchParams(location.search || '');
  const returnTo = searchParams.get('return') || location.state?.from?.pathname || '/docs/intro';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(username.trim(), password);
    setSubmitting(false);
    if (result.ok) {
      setDone(true);
      setTimeout(() => history.replace(returnTo), 500);
    } else {
      setError(result.error || 'Invalid username or password');
    }
  };

  if (isAuthenticated && !done) {
    setTimeout(() => history.replace(returnTo), 0);
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Already signed in. Redirecting…</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        background: 'var(--ifm-background-surface-color)',
      }}
    >
      <h1 style={{ marginBottom: '1rem' }}>Sign in</h1>
      <p style={{ color: 'var(--ifm-color-emphasis-700)', marginBottom: '1.5rem' }}>
        Sign in with your docs username and password to view protected documentation.
      </p>
      {done ? (
        <p>Signed in. Redirecting…</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="docs-username" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
              Username
            </label>
            <input
              id="docs-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--ifm-color-emphasis-300)',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="docs-password" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
              Password
            </label>
            <input
              id="docs-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--ifm-color-emphasis-300)',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>
          {error && (
            <p style={{ color: 'var(--ifm-color-danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="button button--primary button--block"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      )}
    </div>
  );
}
