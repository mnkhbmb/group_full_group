import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_USER = { email: "admin", password: "pass123$", name: "Админ", role: "admin" };
const STORAGE_KEY = "pm_users";
const SESSION_KEY = "pm_session";

function getStoredUsers(): Array<{ email: string; password: string; name: string; role: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [ADMIN_USER];
    const users = JSON.parse(raw);
    if (!users.find((u: any) => u.email === ADMIN_USER.email)) {
      users.push(ADMIN_USER);
    }
    return users;
  } catch {
    return [ADMIN_USER];
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
    const userData = { email: found.email, name: found.name, role: found.role };
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return true;
  };

  const register = (email: string, password: string, name: string): boolean => {
    const users = getStoredUsers();
    if (users.find((u) => u.email === email)) return false;
    const newUser = { email, password, name, role: "user" };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    const userData = { email, name, role: "user" };
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
