
import { useState, useEffect } from "react";
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
  preselectedProject?: any;
}

export const DataSourceSelection = ({ onAssessmentComplete, preselectedProject }: DataSourceSelectionProps) => {
  const [dataSource, setDataSource] = useState("");
  const [query, setQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [aiApproach, setAiApproach] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Pre-populate form if project is selected
  useEffect(() => {
    if (preselectedProject) {
      setDataSource(preselectedProject.source === 'Oracle DB' ? 'oracle' : 
                   preselectedProject.source === 'PostgreSQL' ? 'sql' :
                   preselectedProject.source === 'MongoDB' ? 'mongodb' : '');
      setQuery(preselectedProject.query || '');
      setAiApproach(preselectedProject.aiApproach || '');
    }
  }, [preselectedProject]);

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
          ],
          constantDistribution: [
            { name: 'Non-constant', value: 95, color: '#3b82f6' },
            { name: 'Constant', value: 5, color: '#ef4444' }
          ]
        },
        stage2: {
          kpis: {
            overall_status: 'Failed',
            total_checks: 7,
            passed_checks: 2,
            failed_checks: 2,
            errored_checks: 0,
            skipped_checks: 3
          },
          checkTypeDistribution: [
            { name: 'Uniqueness', value: 42.9, color: '#3b82f6' },
            { name: 'cross_field_validation', value: 28.6, color: '#10b981' },
            { name: 'null_check', value: 28.6, color: '#f59e0b' }
          ],
          statusDistribution: [
            { name: 'Skipped', value: 42.9, color: '#3b82f6' },
            { name: 'Failed', value: 28.6, color: '#ef4444' },
            { name: 'Passed', value: 28.6, color: '#10b981' }
          ],
          summaryTable: [
            {
              name: "Uniqueness_'services.productCode'",
              check_type: 'Uniqueness',
              status: 'Failed',
              rows_scanned: 1000,
              breaching_rows: 992,
              percentage_breached: 99.2,
              details: "Uniqueness check on columns ['services.productCode']. Found 992 breaching rows.",
              columns_checked: 'services.productCode'
            },
            {
              name: "Uniqueness_lineitems.prevSellerId_productCode_businessType_ipIdentifier",
              check_type: 'Uniqueness',
              status: 'Skipped',
              rows_scanned: 1000,
              breaching_rows: 0,
              percentage_breached: 0,
              details: "Columns ['services.prevSellerId', 'accountdetails.businessType', 'lineitems.ipIdentifier'] not found in DataFrame. Check skipped.",
              columns_checked: 'service.prevSellerId + service.prevSellerId + ...'
            }
          ],
          breachPercentageData: [
            { name: "Uniqueness_'services.productCode'", percentage: 99.2 },
            { name: "Uniqueness_lineitems.productCodeLineItem", percentage: 0 },
            { name: "Uniqueness_lineitems.productCodeLineItem", percentage: 0 },
            { name: "Consistency_PrepaidFundedDateAndPrepaidRatePlanNotNull", percentage: 97.9 },
            { name: "Consistency_EnrollmentDateBeforeActionDate", percentage: 0 },
            { name: "Completeness_accountdetails.accountType_NotNull", percentage: 0 },
            { name: "Completeness_orderdetails.actionDate_NotNull", percentage: 0 }
          ],
          checks: [
            {
              name: "Uniqueness_'services.productCode'",
              check_type: 'Uniqueness',
              status: 'Failed',
              rows_scanned: 1000,
              breaching_rows: 992,
              percentage_breached: '99.2',
              compound_check: 'False',
              hasOutput: true
            },
            {
              name: "Uniqueness_lineitems.prevSellerId_productCode_businessType_ipIdentifier",
              check_type: 'Uniqueness',
              status: 'Skipped',
              rows_scanned: 1000,
              breaching_rows: 0,
              percentage_breached: '0.0',
              compound_check: 'True',
              hasOutput: false
            },
            {
              name: "Uniqueness_lineitems.productCodeLineItem",
              check_type: 'Uniqueness',
              status: 'Skipped',
              rows_scanned: 1000,
              breaching_rows: 0,
              percentage_breached: '0.0',
              compound_check: 'False',
              hasOutput: false
            },
            {
              name: "Consistency_PrepaidFundedDateAndPrepaidRatePlanNotNull",
              check_type: 'cross_field_validation',
              status: 'Failed',
              rows_scanned: 1000,
              breaching_rows: 979,
              percentage_breached: '97.9',
              compound_check: 'None',
              hasOutput: true
            }
          ],
          metricsData: [
            { column: 'accountdetails.isaMobile', null_percentage: 0 },
            { column: 'accountdetails.ban', null_percentage: 0 },
            { column: 'linedetails.sellerId', null_percentage: 0 },
            { column: 'services.productCode', null_percentage: 0 },
            { column: 'orderdetails.actionDate', null_percentage: 100 },
            { column: 'services.prepaidFundedDate', null_percentage: 100 },
            { column: 'services.prepaidRatePlan', null_percentage: 100 },
            { column: 'services.airlineAmount', null_percentage: 100 },
            { column: 'lineitems.enrollmentDate', null_percentage: 100 }
          ],
          detailedSummaryTable: [
            {
              column_name: 'accountdetails.isaMobile',
              datatype: 'Int64',
              null_count: 0,
              not_null_count: 1000,
              null_percentage: 0,
              unique_count: 997,
              unique_percentage: 99.7,
              is_constant: 0,
              zero_count: 0,
              zero_percentage: 0,
              negative_count: 0
            },
            {
              column_name: 'accountdetails.ban',
              datatype: 'Int64',
              null_count: 0,
              not_null_count: 1000,
              null_percentage: 0,
              unique_count: 986,
              unique_percentage: 98.6,
              is_constant: 0,
              zero_count: 0,
              zero_percentage: 0,
              negative_count: 0
            },
            {
              column_name: 'linedetails.sellerId',
              datatype: 'String',
              null_count: 0,
              not_null_count: 1000,
              null_percentage: 0,
              unique_count: 925,
              unique_percentage: 92.5,
              is_constant: 0,
              zero_count: 0,
              zero_percentage: 0,
              negative_count: 0
            },
            {
              column_name: 'services.productCode',
              datatype: 'String',
              null_count: 0,
              not_null_count: 1000,
              null_percentage: 0,
              unique_count: 23,
              unique_percentage: 2.3,
              is_constant: 1,
              zero_count: 0,
              zero_percentage: 0,
              negative_count: 0
            }
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
            { score: '-0.05', frequency: 0 },
            { score: '0', frequency: 150 },
            { score: '0.05', frequency: 0 },
            { score: '0.1', frequency: 0 },
            { score: '0.15', frequency: 25 },
            { score: '0.2', frequency: 50 },
            { score: '0.25', frequency: 150 },
            { score: '0.3', frequency: 175 },
            { score: '0.35', frequency: 150 }
          ],
          pcaData: [
            { pca1: -15, pca2: -8, class: 'Anomaly' },
            { pca1: -10, pca2: 0, class: 'Normal' },
            { pca1: -5, pca2: 2, class: 'Normal' },
            { pca1: 0, pca2: -2, class: 'Normal' },
            { pca1: 5, pca2: 0, class: 'Normal' },
            { pca1: 10, pca2: -4, class: 'Anomaly' },
            { pca1: 15, pca2: -6, class: 'Anomaly' }
          ],
          anomalyTableColumns: [
            'linedetails.sellerId', 'accountdetails.isaMobile', 'services.prepaidFundedDate',
            'orderdetails.actionDate', 'accountdetails.ban', 'services.productCode',
            'services.prepaidRatePlan', 'services.airlineAmount', 'lineitems.enrollmentDate'
          ],
          anomalyEntries: [
            {
              'linedetails.sellerId': 'RXYTY',
              'accountdetails.isaMobile': '4704398326',
              'services.prepaidFundedDate': '20250622',
              'orderdetails.actionDate': '20250522',
              'accountdetails.ban': '53458689302',
              'services.productCode': 'PP09',
              'services.prepaidRatePlan': '20250622',
              'services.airlineAmount': 'PP09',
              'lineitems.enrollmentDate': '60'
            },
            {
              'linedetails.sellerId': 'FMQTK',
              'accountdetails.isaMobile': '3964627081',
              'services.prepaidFundedDate': '20250612',
              'orderdetails.actionDate': '20250512',
              'accountdetails.ban': '52340924100',
              'services.productCode': 'PP09',
              'services.prepaidRatePlan': '',
              'services.airlineAmount': 'PP09',
              'lineitems.enrollmentDate': '61'
            }
          ]
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Configuration</h2>
        <p className="text-gray-600">Configure your data source and assessment parameters</p>
      </div>

      {preselectedProject && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Project Loaded: {preselectedProject.name}</h3>
                <p className="text-sm text-blue-700">Data source and configuration have been pre-populated from your project settings.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="oracle">Oracle</SelectItem>
                <SelectItem value="mongodb">Mongo DB</SelectItem>
                <SelectItem value="trino">Trino</SelectItem>
                <SelectItem value="azure_blob">Azure Blob</SelectItem>
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
                multiple={false}
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
