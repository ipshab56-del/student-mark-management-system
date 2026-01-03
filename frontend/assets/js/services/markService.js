const API_URL = window.ENV.API_MARKS_URL;

async function safeJson(res) {
  try { return await res.json(); }
  catch { return null; }
}

export async function apiMarkGetAll() {
  const res = await fetch(API_URL);
  if (!res.ok) return [];
  return safeJson(res);
}

export async function apiMarkGetOne(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return null;
  return safeJson(res);
}

export function apiMarkCreate(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function apiMarkUpdate(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function apiMarkDelete(id) {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}