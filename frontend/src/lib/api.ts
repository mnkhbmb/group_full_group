const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API алдаа");
  }
  return res.json();
}

// ──── Auth ────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ email: string; name: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ──── Users ────
export const usersApi = {
  getAll: () => request<any[]>("/users"),
  create: (data: unknown) => request<any>("/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => request<any>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<any>(`/users/${id}`, { method: "DELETE" }),
  changePassword: (email: string, currentPassword: string, newPassword: string) =>
    request<any>("/users/change-password", { method: "POST", body: JSON.stringify({ email, currentPassword, newPassword }) }),
};

// ──── Building Objects ────
export const objectsApi = {
  getAll: () => request<any[]>("/objects"),
  create: (name: string) => request<any>("/objects", { method: "POST", body: JSON.stringify({ name }) }),
  delete: (id: string) => request<any>(`/objects/${id}`, { method: "DELETE" }),
};

// ──── Properties ────
export const propertiesApi = {
  getAll: () => request<any[]>("/properties"),
  getById: (id: string) => request<any>(`/properties/${id}`),
  create: (data: unknown) => request<any>("/properties", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => request<any>(`/properties/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<any>(`/properties/${id}`, { method: "DELETE" }),
};

// ──── Tenants ────
export const tenantsApi = {
  getAll: () => request<any[]>("/tenants"),
  getById: (id: string) => request<any>(`/tenants/${id}`),
  create: (data: unknown) => request<any>("/tenants", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => request<any>(`/tenants/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<any>(`/tenants/${id}`, { method: "DELETE" }),
};

// ──── Meter Readings ────
export const meterReadingsApi = {
  getAll: (params?: { period?: string; tenantId?: string }) => {
    const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
    return request<any[]>(`/meter-readings${qs}`);
  },
  getByPeriod: (period: string) => request<any[]>(`/meter-readings/${period}`),
  upsert: (period: string, tenantId: string, data: unknown) =>
    request<any>(`/meter-readings/${period}/${tenantId}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (period: string, tenantId: string) =>
    request<any>(`/meter-readings/${period}/${tenantId}`, { method: "DELETE" }),
};
