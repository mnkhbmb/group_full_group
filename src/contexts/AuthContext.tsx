import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AppRole =
  | "admin"
  | "general_manager"
  | "sales_manager"
  | "engineer"
  | "accountant"
  | "user";

interface User {
  email: string;
  name: string;
  role: AppRole;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: StoredUser[] = [
  { email: "admin", password: "pass123$", name: "Админ", role: "admin" },
  { email: "gm", password: "pass123$", name: "Б.Энхбат", role: "general_manager" },
  { email: "sales", password: "pass123$", name: "Г.Сараа", role: "sales_manager" },
  { email: "engineer", password: "pass123$", name: "Д.Тэмүүлэн", role: "engineer" },
  { email: "accountant", password: "pass123$", name: "О.Дэлгэрмаа", role: "accountant" },
];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Админ",
  general_manager: "Ерөнхий менежер",
  sales_manager: "Борлуулалт/Түрээсийн менежер",
  engineer: "Ашиглалтын инженер",
  accountant: "Нягтлан",
  user: "Хэрэглэгч",
};

const STORAGE_KEY = "pm_users";
const SESSION_KEY = "pm_session";

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const extra: StoredUser[] = raw ? JSON.parse(raw) : [];
    // Merge demo users (always present), avoid dupes by email
    const map = new Map<string, StoredUser>();
    [...DEMO_USERS, ...extra].forEach((u) => map.set(u.email, u));
    return Array.from(map.values());
  } catch {
    return [...DEMO_USERS];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) setUser(JSON.parse(session));
    } catch {}
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    const userData: User = { email: found.email, name: found.name, role: found.role };
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return true;
  };

  const register = (email: string, password: string, name: string): boolean => {
    const users = getStoredUsers();
    if (users.find((u) => u.email === email)) return false;
    const newUser: StoredUser = { email, password, name, role: "user" };
    // Persist only non-demo users
    const raw = localStorage.getItem(STORAGE_KEY);
    const extra: StoredUser[] = raw ? JSON.parse(raw) : [];
    extra.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extra));
    const userData: User = { email, name, role: "user" };
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
