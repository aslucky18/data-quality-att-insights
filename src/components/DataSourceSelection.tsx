
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Database, Upload, FileText, Settings, Brain, Play } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { toast } from "@/hooks/use-toast";

interface DataSourceSelectionProps {
  onAssessmentComplete: (results: any) => void;
}

export const DataSourceSelection = ({ onAssessmentComplete }: DataSourceSelectionProps) => {
  const [dataSource, setDataSource] = useState("");
  const [query, setQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [aiApproach, setAiApproach] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const databaseSources = ["mongodb", "sql", "oracle"];
  const fileSources = ["xlsx", "csv", "json"];

  const handleRunAssessment = async () => {
    if (!dataSource) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a data source",
      });
      return;
    }

    if (databaseSources.includes(dataSource) && !query) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a query for the selected database",
      });
      return;
    }

    if (fileSources.includes(dataSource) && uploadedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one file",
      });
      return;
    }

    setIsRunning(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results for demonstration
      const mockResults = {
        stage1: {
          kpis: {
            empty_dataset: false,
            num_columns: 443,
            num_rows: 807031,
            num_integer_columns: 62,
            num_float_columns: 14,
            num_string_columns: 367,
            num_boolean_columns: 0,
            num_date_columns: 0,
            num_other_columns: 0,
            num_duplicate_rows: 0,
            column_names: ["_id.oid", "accountdetails.accountId"]
          },
          summary_table: "Mock polars dataframe summary",
          plots: ["distribution", "correlation", "missing_values"]
        },
        stage2: {
          kpis: {
            data_quality_score: 87.5,
            completeness: 92.3,
            consistency: 89.1,
            accuracy: 85.7
          },
          summary_table: "Stage 2 polars summary",
          plots: ["quality_metrics", "trend_analysis"]
        },
        stage3: {
          kpis: {
            anomaly_count: 142,
            anomaly_percentage: 0.176,
            severity_high: 23,
            severity_medium: 67,
            severity_low: 52
          },
          summary_table: "Stage 3 anomaly summary",
          plots: ["anomaly_distribution", "severity_chart"]
        }
      };
      
      toast({
        title: "Assessment Complete",
        description: "Data Quality Assessment completed successfully",
      });
      
      onAssessmentComplete(mockResults);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: "An error occurred during the assessment",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Quality Assessment Setup</h2>
        <p className="text-gray-600">Configure your data source and assessment parameters</p>
      </div>

      {/* Data Source Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Data Source Selection</span>
          </CardTitle>
          <CardDescription>
            Choose your data source and provide the necessary connection details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="datasource">Data Source Type</Label>
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select a data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="sql">SQL Database</SelectItem>
                <SelectItem value="oracle">Oracle Database</SelectItem>
                <SelectItem value="xlsx">Excel File (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV File (.csv)</SelectItem>
                <SelectItem value="json">JSON File (.json)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {databaseSources.includes(dataSource) && (
            <div className="space-y-2">
              <Label htmlFor="query">Database Query</Label>
              <Textarea
                id="query"
                placeholder="Enter your SQL/MongoDB query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {fileSources.includes(dataSource) && (
            <div className="space-y-2">
              <Label>File Upload</Label>
              <FileUpload
                onFilesChange={setUploadedFiles}
                acceptedTypes={dataSource === "xlsx" ? ".xlsx" : dataSource === "csv" ? ".csv" : ".json"}
                multiple={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span>Configuration File (Optional)</span>
          </CardTitle>
          <CardDescription>
            Upload a JSON configuration file to customize the assessment parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFilesChange={(files) => setConfigFile(files[0] || null)}
            acceptedTypes=".json"
            multiple={false}
          />
        </CardContent>
      </Card>

      {/* AI/ML Approach Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI/ML Approach (Optional)</span>
          </CardTitle>
          <CardDescription>
            Select an AI/ML approach for advanced anomaly detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={aiApproach} onValueChange={setAiApproach}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="isolation-forest" id="isolation-forest" />
              <Label htmlFor="isolation-forest">Anomaly Detection using Isolation Forest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="kmeans" id="kmeans" />
              <Label htmlFor="kmeans">Anomaly Detection using K-means Clustering</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Run Assessment Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleRunAssessment}
          disabled={isRunning}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          {isRunning ? (
            <>
              <Settings className="w-5 h-5 mr-2 animate-spin" />
              Running Assessment...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Run Data Quality Assessment
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
