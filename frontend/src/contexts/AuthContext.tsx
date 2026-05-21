import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";

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
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Админ",
  general_manager: "Ерөнхий менежер",
  sales_manager: "Борлуулалт/Түрээсийн менежер",
  engineer: "Ашиглалтын инженер",
  accountant: "Нягтлан",
  user: "Хэрэглэгч",
};

const SESSION_KEY = "pm_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) setUser(JSON.parse(session));
    } catch {}
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await authApi.login(email, password);
      const user: User = {
        email: userData.email,
        name: userData.name,
        role: userData.role as AppRole,
        phone: userData.phone,
      };
      setUser(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
