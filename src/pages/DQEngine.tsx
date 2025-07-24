
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DataSourceSelection } from "@/components/DataSourceSelection";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface DQEngineProps {
  userInfo: { attuid: string } | null;
  onLogout: () => void;
}

export const DQEngine = ({ userInfo, onLogout }: DQEngineProps) => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<"selection" | "results">("selection");
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results);
    setCurrentStep("results");
  };

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
      
      // If data source is already configured and no data config needed, skip to results
      if (!location.state?.needsDataConfig && projectData.source !== 'Not Configured') {
        // Auto-run assessment for configured projects - with mock data
        const mockResults = { stage1: {}, stage2: {}, stage3: {} };
        setAssessmentResults(mockResults);
        setCurrentStep("results");
      }
    }
  }, [location.state]);


  const handleBackToSelection = () => {
    setCurrentStep("selection");
    setAssessmentResults(null);
  };

  const handleUpdateDataConfig = () => {
    setCurrentStep("selection");
    setAssessmentResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userInfo={userInfo} onLogout={onLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentStep === "selection" ? "Data Configuration" : "Quality Assessment"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {currentStep === "selection" ? (
          <DataSourceSelection 
            onAssessmentComplete={handleAssessmentComplete} 
            preselectedProject={selectedProject}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Quality Assessment Results</h2>
              <Button
                onClick={handleUpdateDataConfig}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Update Data Configuration
              </Button>
            </div>
            <ResultsDashboard 
              results={assessmentResults} 
              onBack={handleBackToSelection} 
            />
          </div>
        )}
      </main>
    </div>
  );
};
