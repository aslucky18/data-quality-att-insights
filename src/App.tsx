import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "@/components/LoginPage";
import { DQProjects } from "./pages/DQProjects";
import { DQEngine } from "./pages/DQEngine";
import { DQProjectConfiguration } from "./pages/DQProjectConfiguration";
import { DQProjectRuns } from "./pages/DQProjectRuns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ userid: string } | null>(null);

  const handleLogin = (userid: string) => {
    setIsAuthenticated(true);
    setUserInfo({ userid });
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
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {!isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Routes>
                <Route path="/" element={<DQProjects userInfo={userInfo} onLogout={handleLogout} />} />
                <Route path="/dq-engine" element={<DQEngine userInfo={userInfo} onLogout={handleLogout} />} />
                <Route path="/project-configuration" element={<DQProjectConfiguration userInfo={userInfo} onLogout={handleLogout} />} />
                <Route path="/project-configuration/:projectId" element={<DQProjectConfiguration userInfo={userInfo} onLogout={handleLogout} />} />
                <Route path="/project-runs/:projectId" element={<DQProjectRuns userInfo={userInfo} onLogout={handleLogout} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
