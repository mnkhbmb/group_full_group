import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { canAccessPath, getDefaultRouteForRole } from "@/lib/permissions";
import Index from "./pages/Index.tsx";
import Property from "./pages/Property.tsx";
import Tenants from "./pages/Tenants.tsx";
import Finance from "./pages/Finance.tsx";
import Operations from "./pages/Operations.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";
import Users from "./pages/Users.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!canAccessPath(user?.role, location.pathname)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }
  return <>{children}</>;
}

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<RoleGuard><Index /></RoleGuard>} />
        <Route path="/property" element={<RoleGuard><Property /></RoleGuard>} />
        <Route path="/tenants" element={<RoleGuard><Tenants /></RoleGuard>} />
        <Route path="/finance" element={<RoleGuard><Finance /></RoleGuard>} />
        <Route path="/operations" element={<RoleGuard><Operations /></RoleGuard>} />
        <Route path="/profile" element={<RoleGuard><Profile /></RoleGuard>} />
        <Route path="/users" element={<RoleGuard><Users /></RoleGuard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getDefaultRouteForRole(user?.role)} replace /> : <Login />}
      />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
