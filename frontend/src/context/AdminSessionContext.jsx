import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi } from '../utils/adminApi';

const AdminSessionContext = createContext(null);

export function AdminSessionProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [canShowAdminAccess, setCanShowAdminAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  const validateSession = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    const hasAccessHint = localStorage.getItem('admin_ui_enabled') === '1';
    setCanShowAdminAccess(hasAccessHint);

    if (!token) {
      setIsAdmin(false);
      setChecking(false);
      return false;
    }

    try {
      const res = await adminApi.get('/api/auth/me', token, { timeout: 5000 });
      const isValidAdmin = res.data?.user?.role === 'admin';
      setIsAdmin(isValidAdmin);
      if (isValidAdmin) {
        localStorage.setItem('admin_ui_enabled', '1');
        setCanShowAdminAccess(true);
      } else {
        localStorage.removeItem('admin_token');
        setIsAdmin(false);
      }
      return isValidAdmin;
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('admin_token');
        setIsAdmin(false);
      }
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    validateSession();
    const refresh = () => validateSession();
    window.addEventListener('admin-session-changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('admin-session-changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [validateSession]);

  const setAdminSession = useCallback((token) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_ui_enabled', '1');
    setCanShowAdminAccess(true);
    setIsAdmin(true);
    setChecking(false);
    window.dispatchEvent(new Event('admin-session-changed'));
  }, []);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    window.dispatchEvent(new Event('admin-session-changed'));
  }, []);

  return (
    <AdminSessionContext.Provider value={{ isAdmin, canShowAdminAccess, checking, setAdminSession, logoutAdmin, validateSession }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export const useAdminSession = () => useContext(AdminSessionContext);
