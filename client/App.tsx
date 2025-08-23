import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/analytics"
            element={
              <PlaceholderPage
                title="Advanced Analytics"
                description="Deep dive into your professional growth metrics and predictive insights."
                features={[
                  "Comprehensive skill progression analytics",
                  "Predictive career trajectory modeling",
                  "Industry benchmarking and comparison",
                  "Custom report generation",
                  "Export capabilities for presentations",
                ]}
              />
            }
          />
          <Route
            path="/integrations"
            element={
              <PlaceholderPage
                title="Platform Integrations"
                description="Connect and manage your professional platform integrations."
                features={[
                  "Google Calendar and Outlook integration",
                  "Project management tools (Asana, Jira, Trello)",
                  "Learning platforms (Coursera, Udemy, LinkedIn Learning)",
                  "Professional networks (LinkedIn, GitHub)",
                  "Communication tools (Slack, Microsoft Teams)",
                ]}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings & Preferences"
                description="Customize your SkillScape Navigator experience and manage your account."
                features={[
                  "Notification preferences and frequency",
                  "Privacy settings and data control",
                  "Career goals and milestone management",
                  "AI nudging sensitivity adjustments",
                  "Account security and authentication",
                ]}
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
