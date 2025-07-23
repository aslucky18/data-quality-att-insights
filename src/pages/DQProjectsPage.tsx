import { useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { DQProjects } from "./DQProjects";

const DQProjectsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ attuid: string } | null>(null);

  const handleLogin = (attuid: string) => {
    setIsAuthenticated(true);
    setUserInfo({ attuid });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DQProjects userInfo={userInfo} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default DQProjectsPage;