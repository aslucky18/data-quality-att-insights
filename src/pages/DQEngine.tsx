
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      console.log('DQ Engine received project ID:', location.state.selectedProjectId);
      console.log('Location state:', location.state);
      
      // Get actual project data based on the project ID received
      const projectMapping: { [key: string]: any } = {
        '1': {
          id: '1',
          name: 'Customer Data Validation',
          source: 'Oracle DB',
          query: 'SELECT * FROM customer_data WHERE created_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)',
          description: 'Validates customer data integrity and completeness',
          configFile: null,
          aiApproach: 'isolation-forest'
        },
        '2': {
          id: '2',
          name: 'Transaction Anomaly Detection',
          source: 'PostgreSQL',
          query: 'SELECT * FROM transactions WHERE amount > 10000 OR merchant_category_unusual = true',
          description: 'Detects unusual transaction patterns and potential fraud',
          configFile: null,
          aiApproach: 'clustering'
        },
        '3': {
          id: '3',
          name: 'Product Inventory Analysis',
          source: 'CSV Upload',
          query: '',
          description: 'Analyzes product inventory data for quality issues',
          configFile: null,
          aiApproach: 'statistical-outlier'
        }
      };
      
      const projectData = projectMapping[location.state.selectedProjectId] || {
        id: location.state.selectedProjectId,
        name: 'Default Project',
        source: 'Oracle DB',
        query: 'SELECT * FROM default_data',
        description: 'Default project configuration',
        configFile: null,
        aiApproach: 'isolation-forest'
      };
      
      console.log('Setting project data:', projectData);
      setSelectedProject(projectData);
      
      // If data source is already configured and no data config needed, skip to results
      if (!location.state?.needsDataConfig && projectData.source !== 'Not Configured') {
        // Auto-run assessment for configured projects - with comprehensive mock data
        const mockResults = {
          stage1: {
            kpis: {
              num_columns: 9,
              num_rows: 1000,
              num_integer_columns: 2,
              num_float_columns: 1,
              num_string_columns: 3,
              num_boolean_columns: 0,
              num_date_columns: 3,
              num_other_columns: 0,
              num_duplicate_rows: 0
            },
            columns: [
              'accountdetails.isaMobile', 'accountdetails.ban', 'linedetails.sellerId', 
              'services.productCode', 'orderdetails.actionDate', 'services.prepaidFundedDate',
              'services.prepaidRatePlan', 'services.airlineAmount', 'lineitems.enrollmentDate'
            ],
            dateColumns: [
              'orderdetails.actionDate', 'services.prepaidFundedDate', 'lineitems.enrollmentDate'
            ],
            datatypeDistribution: [
              { name: 'Int64', value: 2, color: '#3b82f6' },
              { name: 'String', value: 3, color: '#10b981' },
              { name: 'Float64', value: 1, color: '#f59e0b' }
            ]
          },
          stage2: {
            kpis: {
              overall_status: 'Passed',
              total_checks: 7,
              passed_checks: 5,
              failed_checks: 2,
              errored_checks: 0,
              skipped_checks: 0
            },
            checkTypeDistribution: [
              { name: 'Uniqueness', value: 42.9, color: '#3b82f6' },
              { name: 'cross_field_validation', value: 28.6, color: '#10b981' },
              { name: 'null_check', value: 28.6, color: '#f59e0b' }
            ],
            statusDistribution: [
              { name: 'Passed', value: 71.4, color: '#10b981' },
              { name: 'Failed', value: 28.6, color: '#ef4444' }
            ]
          },
          stage3: {
            kpis: {
              model_type: 'Anomaly Detection',
              model_name: 'Isolation Forest',
              features_used: 9,
              anomalies_found: 8
            },
            anomalyScoreDistribution: [
              { score: '0', frequency: 150 },
              { score: '0.15', frequency: 25 },
              { score: '0.2', frequency: 50 },
              { score: '0.25', frequency: 150 },
              { score: '0.3', frequency: 175 }
            ]
          }
        };
        setAssessmentResults(mockResults);
        setCurrentStep("results");
      }
    }
  }, [location.state]);


  const handleBackToProjects = () => {
    navigate("/");
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
              onBack={handleBackToProjects} 
            />
          </div>
        )}
      </main>
    </div>
  );
};
