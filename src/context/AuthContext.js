import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

function getApiBase() {
  if (typeof window === 'undefined') return '';
  return '';
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/check-auth`, { credentials: 'include' });
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (username, password) => {
    try {
      const res = await fetch(`${getApiBase()}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user: username, pass: password }),
      });
      const data = res.ok ? {} : await res.json().catch(() => ({}));
      if (res.ok) {
        setIsAuthenticated(true);
        return { ok: true };
      }
      return { ok: false, error: data.error || 'Login failed' };
    } catch (e) {
      return { ok: false, error: e.message || 'Network error' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${getApiBase()}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setIsAuthenticated(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
