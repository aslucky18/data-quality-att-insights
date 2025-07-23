
import { Button } from "@/components/ui/button";
import { LogOut, User, Building2, Database } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  userInfo: { attuid: string } | null;
  onLogout: () => void;
}

export const Header = ({ userInfo, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AT&T Data Quality Framework</h1>
            <p className="text-sm text-gray-600">Enterprise Data Assessment Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-2 text-gray-600">
            <Link to="/dq-projects" className="hover:text-gray-900 transition-colors">
              DQ Projects
            </Link>
            <span>→</span>
            <Link to="/" className="hover:text-gray-900 transition-colors">
              DQ Engine
            </Link>
          </nav>
          <div className="flex items-center space-x-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{userInfo?.attuid}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
