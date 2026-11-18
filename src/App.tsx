import Checkout from "./pages/Checkout";
import { PaidOnboardingGate } from "@/components/PaidOnboardingGate";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NewProject from "./pages/NewProject";
import Onboarding from "./pages/Onboarding";
import DomainSuccess from "./pages/DomainSuccess";
import ClientProjects from "./pages/ClientProjects";
import ClientReports from "./pages/ClientReports";
import ClientBilling from "./pages/ClientBilling";
import ClientReview from "./pages/ClientReview";
import AdminClients from "./pages/admin/AdminClients";
import AdminPipeline from "./pages/admin/AdminPipeline";
import AdminBilling from "./pages/admin/AdminBilling";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProjectDetail from "./pages/admin/AdminProjectDetail";
import AdminDomains from "./pages/admin/AdminDomains";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminChurnAlerts from "./pages/admin/AdminChurnAlerts";
import AdminSiteDiagnosis from "./pages/admin/AdminSiteDiagnosis";
import AdminGbp from "./pages/admin/AdminGbp";
import ClientFeedback from "./pages/ClientFeedback";
import SiteGbp from "./pages/services/SiteGbp";
import NotFound from "./pages/NotFound";


const WhatsAppSupport = () => (
  <a
    href={"https://wa.me/5511966549407?text=" + encodeURIComponent("Olá! Preciso de ajuda com o JB Digital System.")}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Precisa de ajuda? Fale com o suporte pelo WhatsApp"
    title="Dúvidas ou dificuldades? Fale com o suporte"
    className="fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#1da851] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300 focus-visible:ring-offset-2 md:right-6"
    style={{ bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))" }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .11 5.35.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.93 11.93 0 0 0 5.79 1.48h.01c6.58 0 11.94-5.35 11.95-11.94a11.87 11.87 0 0 0-3.48-8.42ZM12.05 21.82a9.9 9.9 0 0 1-5.05-1.38l-.36-.22-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.47 4.45-9.92 9.93-9.92a9.85 9.85 0 0 1 7.01 2.91 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.95 9.92Zm5.44-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  </a>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SiteGbp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Client routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/projects" element={<ProtectedRoute><ClientProjects /></ProtectedRoute>} />
            <Route path="/dashboard/new-project" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
            <Route path="/dashboard/onboarding/:projectId" element={<ProtectedRoute><PaidOnboardingGate><Onboarding /></PaidOnboardingGate></ProtectedRoute>} />
            <Route path="/dashboard/reports" element={<ProtectedRoute><ClientReports /></ProtectedRoute>} />
            <Route path="/dashboard/billing" element={<ProtectedRoute><ClientBilling /></ProtectedRoute>} />
            <Route path="/dashboard/review" element={<ProtectedRoute><ClientReview /></ProtectedRoute>} />
            <Route path="/dashboard/domain-success" element={<ProtectedRoute><DomainSuccess /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin_jb"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/gbp" element={<ProtectedRoute requiredRole="admin_jb"><AdminGbp /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin_jb"><AdminClients /></ProtectedRoute>} />
            <Route path="/admin/pipeline" element={<ProtectedRoute requiredRole="admin_jb"><AdminPipeline /></ProtectedRoute>} />
            <Route path="/admin/projects/:projectId" element={<ProtectedRoute requiredRole="admin_jb"><AdminProjectDetail /></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute requiredRole="admin_jb"><AdminBilling /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin_jb"><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/domains" element={<ProtectedRoute requiredRole="admin_jb"><AdminDomains /></ProtectedRoute>} />
            <Route path="/admin/maintenance" element={<ProtectedRoute requiredRole="admin_jb"><AdminMaintenance /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute requiredRole="admin_jb"><AdminFeedback /></ProtectedRoute>} />
            <Route path="/admin/churn-alerts" element={<ProtectedRoute requiredRole="admin_jb"><AdminChurnAlerts /></ProtectedRoute>} />
            <Route path="/admin/site-diagnosis" element={<ProtectedRoute requiredRole="admin_jb"><AdminSiteDiagnosis /></ProtectedRoute>} />

            {/* Serviços públicos */}
            <Route path="/servicos/site-gbp" element={<SiteGbp />} />

            {/* Public feedback page - no auth required */}
            <Route path="/feedback" element={<ClientFeedback />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppSupport />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
