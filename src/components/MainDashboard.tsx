
import { useState } from "react";
import { DataSourceSelection } from "./DataSourceSelection";
import { ResultsDashboard } from "./ResultsDashboard";
import { Header } from "./Header";

interface MainDashboardProps {
  userInfo: { attuid: string } | null;
  onLogout: () => void;
}

export const MainDashboard = ({ userInfo, onLogout }: MainDashboardProps) => {
  const [currentStep, setCurrentStep] = useState<"selection" | "results">("selection");
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results);
    setCurrentStep("results");
  };

  const handleBackToSelection = () => {
    setCurrentStep("selection");
    setAssessmentResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userInfo={userInfo} onLogout={onLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === "selection" ? (
          <DataSourceSelection onAssessmentComplete={handleAssessmentComplete} />
        ) : (
          <ResultsDashboard 
            results={assessmentResults} 
            onBack={handleBackToSelection} 
          />
        )}
      </main>
    </div>
  );
};
