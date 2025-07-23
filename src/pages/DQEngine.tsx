
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DataSourceSelection } from "@/components/DataSourceSelection";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { Header } from "@/components/Header";

interface DQEngineProps {
  userInfo: { attuid: string } | null;
  onLogout: () => void;
}

export const DQEngine = ({ userInfo, onLogout }: DQEngineProps) => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<"selection" | "results">("selection");
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    // Check if a project was selected from DQ Projects page
    if (location.state?.selectedProjectId) {
      // Mock project data - in real app this would come from API
      const projectData = {
        id: location.state.selectedProjectId,
        name: 'Customer Data Validation',
        source: 'Oracle DB',
        query: 'SELECT * FROM customer_data WHERE created_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)',
        description: 'Validates customer data integrity and completeness',
        configFile: null,
        aiApproach: 'isolation-forest'
      };
      setSelectedProject(projectData);
    }
  }, [location.state]);

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
          <DataSourceSelection 
            onAssessmentComplete={handleAssessmentComplete} 
            preselectedProject={selectedProject}
          />
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
