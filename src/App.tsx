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
import ClientProjects from "./pages/ClientProjects";
import ClientReports from "./pages/ClientReports";
import ClientBilling from "./pages/ClientBilling";
import AdminClients from "./pages/admin/AdminClients";
import AdminPipeline from "./pages/admin/AdminPipeline";
import AdminBilling from "./pages/admin/AdminBilling";
import AdminReports from "./pages/admin/AdminReports";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminGBP from "./pages/admin/AdminGBP";
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

            {/* Client routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/projects" element={<ProtectedRoute><ClientProjects /></ProtectedRoute>} />
            <Route path="/dashboard/new-project" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
            <Route path="/dashboard/onboarding/:projectId" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard/reports" element={<ProtectedRoute><ClientReports /></ProtectedRoute>} />
            <Route path="/dashboard/billing" element={<ProtectedRoute><ClientBilling /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin_jb"><AdminClients /></ProtectedRoute>} />
            <Route path="/admin/pipeline" element={<ProtectedRoute requiredRole="admin_jb"><AdminPipeline /></ProtectedRoute>} />
            <Route path="/admin/gbp" element={<ProtectedRoute requiredRole="admin_jb"><AdminGBP /></ProtectedRoute>} />
            <Route path="/admin/prompt-generator" element={<ProtectedRoute requiredRole="admin_jb"><PromptGenerator /></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute requiredRole="admin_jb"><AdminBilling /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin_jb"><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/integrations" element={<ProtectedRoute requiredRole="admin_jb"><AdminIntegrations /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin_jb"><AdminSettings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
