import axios from 'axios';

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

export const adminApi = {
  get: (url, token, config = {}) =>
    axios.get(url, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } }),
  post: (url, data, token, config = {}) =>
    axios.post(url, data, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } }),
  put: (url, data, token, config = {}) =>
    axios.put(url, data, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } }),
  delete: (url, token, config = {}) =>
    axios.delete(url, { ...config, headers: { ...getAdminHeaders(token), ...config.headers } }),
};
