const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('urjatrack_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('urjatrack_token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(typeof data === 'string' ? data : data.error || 'Request failed');
  }

  return data;
}

// Auth
export const signup = (name, email, password) =>
  request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const googleLogin = (idToken) =>
  request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });

// Cycles
export const startCycle = (cycleStartReading) =>
  request('/cycles/start', {
    method: 'POST',
    body: JSON.stringify({ cycleStartReading }),
  });

export const getActiveCycle = () =>
  request('/cycles/active');

export const getCycleHistory = () =>
  request('/cycles/history');

// Readings
export const logReading = (readingValue, note = null) =>
  request('/readings', {
    method: 'POST',
    body: JSON.stringify({ readingValue, note }),
  });
