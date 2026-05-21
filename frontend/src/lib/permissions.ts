import type { AppRole } from "@/contexts/AuthContext";

export type RouteKey = "dashboard" | "property" | "tenants" | "finance" | "operations" | "users" | "profile";

/** Аль role аль route-руу нэвтрэх боломжтой */
const ROUTE_ACCESS: Record<RouteKey, AppRole[]> = {
  dashboard: ["admin", "general_manager", "sales_manager", "accountant", "user"],
  property: ["admin", "general_manager", "sales_manager"],
  tenants: ["admin", "general_manager", "sales_manager", "engineer", "accountant"],
  finance: ["admin", "general_manager", "accountant"],
  operations: ["admin", "general_manager", "engineer", "accountant"],
  users: ["admin"],
  profile: ["admin", "general_manager", "sales_manager", "engineer", "accountant", "user"],
};

export const ROUTE_PATHS: Record<RouteKey, string> = {
  dashboard: "/",
  property: "/property",
  tenants: "/tenants",
  finance: "/finance",
  operations: "/operations",
  users: "/users",
  profile: "/profile",
};

export function canAccessRoute(role: AppRole | undefined, route: RouteKey): boolean {
  if (!role) return false;
  return ROUTE_ACCESS[route].includes(role);
}

export function canAccessPath(role: AppRole | undefined, path: string): boolean {
  if (!role) return false;
  const entry = (Object.entries(ROUTE_PATHS) as [RouteKey, string][]).find(([, p]) => p === path);
  if (!entry) return true;
  return canAccessRoute(role, entry[0]);
}

/** Эх route-уудаас нэвтрэх боломжтой эхнийхийг буцаана (landing) */
export function getDefaultRouteForRole(role: AppRole | undefined): string {
  if (!role) return "/login";
  const order: RouteKey[] = ["dashboard", "finance", "operations", "tenants", "property"];
  for (const key of order) {
    if (canAccessRoute(role, key)) return ROUTE_PATHS[key];
  }
  return "/login";
}

// ============ Үйлдлийн эрх ============

/** Нэхэмжлэх үүсгэх / илгээх */
export function canManageInvoices(role: AppRole | undefined): boolean {
  return role === "admin" || role === "accountant";
}

/** Ашиглалтын хэмжүүр гар бүртгэх */
export function canRecordMeters(role: AppRole | undefined): boolean {
  return role === "admin" || role === "engineer";
}
