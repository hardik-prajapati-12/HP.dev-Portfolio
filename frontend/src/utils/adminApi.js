import axios from 'axios';
import { clearPortfolioCache } from './apiCache';

export const getAdminAccessKey = () => localStorage.getItem('admin_access_key') || '';

export const setAdminAccessKey = (key) => {
  localStorage.setItem('admin_access_key', key);
  localStorage.setItem('admin_access_verified', '1');
};

export const clearAdminAccessKey = () => {
  localStorage.removeItem('admin_access_key');
  localStorage.removeItem('admin_access_verified');
};

export const isAdminAccessVerified = () => localStorage.getItem('admin_access_verified') === '1';

export const getAdminHeaders = (token) => {
  const headers = {};
  const accessKey = getAdminAccessKey();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (accessKey) headers['X-Admin-Access-Key'] = accessKey;
  return headers;
};

const handleCacheInvalidation = (url) => {
  if (url && !url.includes('/auth/login') && !url.includes('/analytics/')) {
    clearPortfolioCache();
  }
};

export const adminApi = {
  get: (url, token, config = {}) =>
    axios.get(url, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } }),
  post: async (url, data, token, config = {}) => {
    const res = await axios.post(url, data, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } });
    handleCacheInvalidation(url);
    return res;
  },
  put: async (url, data, token, config = {}) => {
    const res = await axios.put(url, data, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } });
    handleCacheInvalidation(url);
    return res;
  },
  delete: async (url, token, config = {}) => {
    const res = await axios.delete(url, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } });
    handleCacheInvalidation(url);
    return res;
  },
};

export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'https://hp-dev-portfolio.onrender.com';
  const cleanBase = apiBase.replace(/\/api$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
