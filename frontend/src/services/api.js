const API_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, value);
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const api = {
  list: (params) => request(`/tasks${buildQuery(params)}`),
  create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  toggle: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
