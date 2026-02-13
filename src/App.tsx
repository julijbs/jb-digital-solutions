import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NewProject from "./pages/NewProject";
import Onboarding from "./pages/Onboarding";
import PromptGenerator from "./pages/PromptGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/projects"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/new-project"
              element={<ProtectedRoute><NewProject /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/onboarding/:projectId"
              element={<ProtectedRoute><Onboarding /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/reports"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/billing"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/clients"
              element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/pipeline"
              element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/prompt-generator"
              element={<ProtectedRoute requiredRole="admin_jb"><PromptGenerator /></ProtectedRoute>}
            />
            <Route
              path="/admin/billing"
              element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/reports"
              element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/integrations"
              element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/settings"
              element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
