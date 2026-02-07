const API_URL = '/api/fees';

async function safeJson(res) {
  try { return await res.json(); }
  catch { return null; }
}

export async function apiFeeGetAll() {
  const res = await fetch(API_URL);
  if (!res.ok) return [];
  return safeJson(res);
}

export async function apiFeeGetOne(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return null;
  return safeJson(res);
}

export function apiFeeCreate(data) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function apiFeeUpdate(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function apiFeeDelete(id) {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
}

export class FeeService {
  async getAll() {
    return await apiFeeGetAll();
  }

  async getById(id) {
    return await apiFeeGetOne(id);
  }

  async create(data) {
    return await apiFeeCreate(data);
  }

  async update(id, data) {
    return await apiFeeUpdate(id, data);
  }

  async delete(id) {
    return await apiFeeDelete(id);
  }
}