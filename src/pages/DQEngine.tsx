
import { useState } from "react";
import { DataSourceSelection } from "@/components/DataSourceSelection";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { Header } from "@/components/Header";

interface DQEngineProps {
  userInfo: { attuid: string } | null;
  onLogout: () => void;
}

export const DQEngine = ({ userInfo, onLogout }: DQEngineProps) => {
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
