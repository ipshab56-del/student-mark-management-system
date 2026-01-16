// Base API URL
const API_URL = "/api/students";

// Helper: safely parse JSON or return null
async function safeJson(res) {
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}

// Fetch all students
export async function apiGetAll() {
  const res = await fetch(API_URL);
  if (!res.ok) return [];
  return safeJson(res);
}

// Fetch one student by ID
export async function apiGetOne(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return null;
  return safeJson(res);
}


// Create a new student
export function apiCreate(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// Update a student
export function apiUpdate(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// Delete a student
export function apiDelete(id) {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

// StudentService class
export class StudentService {
  async getAll() {
    return await apiGetAll();
  }

  async getById(id) {
    return await apiGetOne(id);
  }

  async create(data) {
    return await apiCreate(data);
  }

  async update(id, data) {
    return await apiUpdate(id, data);
  }

  async delete(id) {
    return await apiDelete(id);
  }
}