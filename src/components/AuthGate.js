import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '../context/AuthContext';

/**
 * Renders children only when the user is authenticated.
 * Use in MDX like: <AuthGate>Protected content here.</AuthGate>
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show when authenticated
 * @param {React.ReactNode} [props.fallback] - Optional custom message when not authenticated
 * @param {string} [props.loginUrl] - Optional URL for login (e.g. /login or your app login)
 */
export default function AuthGate({ children, fallback, loginUrl = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  let resolvedLoginUrl = loginUrl.startsWith('http') ? loginUrl : useBaseUrl(loginUrl.startsWith('/') ? loginUrl : '/' + loginUrl);
  if (resolvedLoginUrl.includes('/login') && location?.pathname) {
    const sep = resolvedLoginUrl.includes('?') ? '&' : '?';
    resolvedLoginUrl += `${sep}return=${encodeURIComponent(location.pathname)}`;
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ifm-color-emphasis-600)' }}>
        Checking access…
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '8px',
          background: 'var(--ifm-background-surface-color)',
          margin: '1rem 0',
        }}
      >
        <p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
          This section is only available to signed-in users.
        </p>
        <a
          href={resolvedLoginUrl}
          className="button button--primary"
          style={{ textDecoration: 'none' }}
        >
          Sign in to view
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
