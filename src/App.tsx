// src/App.tsx
import { AlertsPage } from "@/pages/AlertsPage";
import { useState } from "react";
import { AppLayout } from "@/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your pages and components
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/pages/DashBoard";
import { DQEngine } from "@/pages/DQEngine";
import { DQProjectConfiguration } from "@/pages/DQProjectConfiguration";
import { DQProjectRuns } from "@/pages/DQProjectRuns";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    userid: string;
    isAdmin: boolean;
    profileImageURL: string;
  } | null>(null);

  const handleLogin = (
    userid: string,
    isAdmin: boolean,
    profileImageURL: string,
  ) => {
    setIsAuthenticated(true);
    setUserInfo({ userid, isAdmin, profileImageURL });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            // 2. WRAP YOUR AUTHENTICATED ROUTES WITH AppLayout
            // Pass user info and logout handler ONCE to the layout
            <AppLayout userInfo={userInfo} onLogout={handleLogout}>
              <Routes>
                {/* 3. Your routes are now cleaner! No need for redundant props. */}
                <Route
                  path="/"
                  element={
                    <Dashboard userInfo={userInfo} onLogout={handleLogout} />
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <AlertsPage userInfo={userInfo} onLogout={handleLogout} />
                  }
                />
                {/* Project Configuration */}

                {/* Catch-all route should be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

{
  /**
  
                <Route path="/dq-engine" element={<DQEngine userInfo={userInfo} onLogout={handleLogout} />} />
                <Route path="/project-configuration/:projectId" element={<DQProjectConfiguration userInfo={userInfo} onLogout={handleLogout} />} />
                <Route path="/project-runs/:projectId" element={<DQProjectRuns userInfo={userInfo} onLogout={handleLogout} />} />
  
  */
}
