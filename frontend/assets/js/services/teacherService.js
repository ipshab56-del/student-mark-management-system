// Teacher API service
const API_URL = window.ENV.API_TEACHERS_URL;

// Helper to safely parse JSON
async function safeJson(res) {
  try { return await res.json(); }
  catch { return null; }
}

export async function apiTeacherGetAll() {
  const res = await fetch(API_URL);
  if (!res.ok) return [];
  return safeJson(res);
}

export async function apiTeacherGetOne(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return null;
  return safeJson(res);
}

export function apiTeacherCreate(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function apiTeacherUpdate(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function apiTeacherDelete(id) {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
