import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/types/app";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole && role !== "admin_jb") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
