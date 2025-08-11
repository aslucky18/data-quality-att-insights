import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, Upload, FileText, Settings, Brain, Play, Save, Lock } from "lucide-react";
// Assuming FileUpload and toast are correctly imported from your project structure
// import { FileUpload } from "./FileUpload";
// import { toast } from "@/hooks/use-toast";

// Mock components for demonstration purposes since the originals are not provided.
const FileUpload = ({ onFilesChange, acceptedTypes, multiple }) => (
  <div className="flex items-center justify-center w-full">
    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-8 h-8 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-500">Accepted: {acceptedTypes} {multiple ? '(multiple files)' : '(single file)'}</p>
      </div>
      <input id="dropzone-file" type="file" className="hidden" onChange={(e) => onFilesChange(Array.from(e.target.files))} accept={acceptedTypes} multiple={multiple} />
    </label>
  </div>
);
const toast = ({ title, description, variant }) => {
  console.log(`Toast (${variant || 'default'}): ${title} - ${description}`);
  // In a real app, you'd have a global toast component render this.
};


export const DataSourceSelection = ({ onAssessmentComplete, preselectedProject }) => {
  const [dataSource, setDataSource] = useState("");
  const [query, setQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [configFile, setConfigFile] = useState(null);
  const [aiApproach, setAiApproach] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDataSourceUploaded, setIsDataSourceUploaded] = useState(false);
  const [isDataVerified, setIsDataVerified] = useState(false);
  const [isConnectionLocked, setIsConnectionLocked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Expanded mock columns data for demonstration.
  const [mockColumns] = useState([
    { name: 'customer_id', type: 'Int64', description: 'Unique customer identifier' },
    { name: 'account_number', type: 'String', description: 'Customer account number' },
    { name: 'first_name', type: 'String', description: 'Customer first name' },
    { name: 'last_name', type: 'String', description: 'Customer last name' },
    { name: 'email_address', type: 'String', description: 'Customer email' },
    { name: 'phone_number', type: 'String', description: 'Customer phone number' },
    { name: 'date_of_birth', type: 'Date', description: 'Customer birth date' },
    { name: 'registration_date', type: 'Date', description: 'Account registration date' },
    { name: 'last_login_date', type: 'Date', description: 'Last login Date' },
    { name: 'account_balance', type: 'Float64', description: 'Current account balance' },
    { name: 'credit_limit', type: 'Float64', description: 'Customer credit limit' },
    { name: 'account_status', type: 'String', description: 'e.g., Active, Inactive, Suspended' },
    { name: 'country_code', type: 'String', description: 'Two-letter ISO country code' },
    { name: 'postal_code', type: 'String', description: 'Customer postal or ZIP code' },
    { name: 'transaction_count', type: 'Int64', description: 'Total number of transactions' },
    { name: 'middle_name', type: 'String', description: 'Customer middle name' },
    { name: 'gender', type: 'String', description: 'Customer gender (e.g., Male, Female, Other)' },
    { name: 'marital_status', type: 'String', description: 'e.g., Single, Married, Divorced' },
    { name: 'occupation', type: 'String', description: 'Customer\'s job or profession' },
    { name: 'income_level', type: 'String', description: 'Categorized income bracket' },
    { name: 'customer_tier', type: 'String', description: 'Loyalty tier (e.g., Bronze, Silver, Gold)' },
    { name: 'is_email_verified', type: 'Boolean', description: 'Flag indicating if email is verified' },
    { name: 'is_phone_verified', type: 'Boolean', description: 'Flag indicating if phone is verified' },
    { name: 'preferred_language', type: 'String', description: 'Customer\'s preferred language (e.g., en-US)' },
    { name: 'nationality', type: 'String', description: 'Customer\'s nationality' },
    { name: 'address_line_1', type: 'String', description: 'Primary street address' },
    { name: 'address_line_2', type: 'String', description: 'Secondary address info (Apt, Suite)' },
    { name: 'city', type: 'String', description: 'City of residence' },
    { name: 'state_province', type: 'String', description: 'State or province of residence' },
    { name: 'timezone', type: 'String', description: 'Customer\'s local timezone (e.g., America/New_York)' },
    { name: 'latitude', type: 'Float64', description: 'Geographic latitude of address' },
    { name: 'longitude', type: 'Float64', description: 'Geographic longitude of address' },
    { name: 'first_transaction_date', type: 'Date', description: 'Date of the very first transaction' },
    { name: 'last_transaction_date', type: 'Date', description: 'Date of the most recent transaction' },
    { name: 'last_transaction_amount', type: 'Float64', description: 'Value of the last transaction' },
    { name: 'average_transaction_value', type: 'Float64', description: 'Average value of all transactions' },
    { name: 'total_spend', type: 'Float64', description: 'Lifetime total spending by the customer' },
    { name: 'total_refunds', type: 'Int64', description: 'Total number of refunds issued' },
    { name: 'total_refund_amount', type: 'Float64', description: 'Total monetary value of refunds' },
    { name: 'preferred_payment_method', type: 'String', description: 'Most frequently used payment method' },
    { name: 'login_frequency_days', type: 'Int64', description: 'Average number of days between logins' },
    { name: 'session_duration_avg_mins', type: 'Float64', description: 'Average session duration in minutes' },
    { name: 'pages_viewed_per_session', type: 'Float64', description: 'Average pages viewed per session' },
    { name: 'device_type', type: 'String', description: 'Last used device (e.g., Mobile, Desktop)' },
    { name: 'browser_type', type: 'String', description: 'Last used web browser (e.g., Chrome, Safari)' },
    { name: 'operating_system', type: 'String', description: 'Last used OS (e.g., iOS, Android, Windows)' },
    { name: 'ip_address', type: 'String', description: 'IP address from the last login' },
    { name: 'has_abandoned_cart', type: 'Boolean', description: 'Indicates if customer has ever abandoned a cart' },
    { name: 'marketing_opt_in', type: 'Boolean', description: 'Indicates if customer opted into marketing' },
    { name: 'last_email_open_date', type: 'Date', description: 'When the last marketing email was opened' },
    { name: 'referral_source', type: 'String', description: 'How the customer was acquired (e.g., Google, Friend)' },
    { name: 'net_promoter_score', type: 'Int64', description: 'Customer\'s NPS rating (0-10)' },
    { name: 'last_support_ticket_date', type: 'Date', description: 'Date of the last support interaction' },
    { name: 'subscription_id', type: 'String', description: 'Identifier for the customer\'s subscription' },
    { name: 'subscription_plan', type: 'String', description: 'Name of the current subscription plan (e.g., Basic)' },
    { name: 'subscription_status', type: 'String', description: 'Current status (e.g., Active, Canceled, Paused)' },
    { name: 'subscription_start_date', type: 'Date', description: 'Date the current subscription began' },
    { name: 'next_billing_date', type: 'Date', description: 'Date of the next scheduled payment' },
    { name: 'record_created_at', type: 'Date', description: 'Date when the customer record was created' },
    { name: 'record_updated_at', type: 'Date', description: 'Date when the record was last updated' },
    { name: 'is_deleted', type: 'Boolean', description: 'Flag for soft-deleted records' },
    { name: 'data_source', type: 'String', description: 'The source system where this data originated' },
    { name: 'etl_batch_id', type: 'String', description: 'Identifier for the data loading batch process' }
  ]);

  // Column selections for different check types with mock pre-selections
  const [selectedColumns, setSelectedColumns] = useState({
    completeness: ['customer_id', 'account_number', 'email_address'],
    uniqueness: ['customer_id', 'account_number', 'email_address'],
    validity: ['email_address', 'phone_number', 'country_code', 'postal_code'],
    consistency: ['account_balance', 'credit_limit', 'registration_date', 'last_login_date'],
    staleness: ['registration_date', 'last_login_date']
  });

  // **FIXED**: These arrays now correctly include all options from the dropdown.
  const databaseSources = ["mysql", "oracle", "mongodb", "trino"];
  const fileSources = ["xlsx", "csv", "json", "azure_blob"]; // Azure Blob is a file-based source

  // Pre-populate form if a project is selected
  useEffect(() => {
    if (preselectedProject) {
      // **FIXED**: This logic now correctly maps project source names to the SelectItem values.
      const sourceMap = {
        'MySQL DB': 'mysql',
        'Oracle DB': 'oracle',
        'MongoDB': 'mongodb',
        'Trino Cluster': 'trino',
        'Excel Upload': 'xlsx',
        'CSV Upload': 'csv',
        'JSON Upload': 'json',
        'Azure Blob Storage': 'azure_blob',
      };
      const mappedSource = sourceMap[preselectedProject.source] || "";
      setDataSource(mappedSource);
      setQuery(preselectedProject.query || '');
      setAiApproach(preselectedProject.aiApproach || '');
      // If a project is loaded, we can assume the connection is established and lock it.
      if(mappedSource) {
          setIsConnectionLocked(true);
          if (fileSources.includes(mappedSource)) {
              setIsDataSourceUploaded(true); // Assume file was part of the project
          }
      }
    }
  }, [preselectedProject, fileSources]);


  // Handle file upload for data sources
  const handleDataSourceFileUpload = (files) => {
    setUploadedFiles(files);
    if (files.length > 0 && fileSources.includes(dataSource)) {
      setIsDataSourceUploaded(true);
      setIsConnectionLocked(true);
      setIsSaved(false);
      setIsDataVerified(false); // Reset verification when new file is uploaded
    }
  };

  // Handle data verification
  const handleVerifyData = async () => {
    if (!isDataSourceUploaded && fileSources.includes(dataSource)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a data source file first",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Simulate data verification process
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsDataVerified(true);
      toast({
        title: "Data Verified Successfully",
        description: "Your data has been validated and column suggestions are now available",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Failed to verify data source",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle data source change
  const handleDataSourceChange = (value) => {
    if (!isConnectionLocked) {
      setDataSource(value);
      setIsDataSourceUploaded(false);
      setIsDataVerified(false);
      setUploadedFiles([]);
      setQuery("");
      setIsSaved(false);
    }
  };

  // Handle save configuration
  const handleSaveConfiguration = async () => {
    if (fileSources.includes(dataSource) && !isDataSourceUploaded) {
      toast({ variant: "destructive", title: "Error", description: "Please upload a data source file first" });
      return;
    }
    if (databaseSources.includes(dataSource) && !query.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a database query" });
      return;
    }
    if (!dataSource) {
      toast({ variant: "destructive", title: "Error", description: "Please select a data source" });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSaved(true);
      toast({ title: "Configuration Saved", description: "Your project configuration has been saved successfully" });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: "Failed to save configuration" });
    }
  };

  // Handle column selection for different check types
  const handleColumnSelection = (checkType, column, checked) => {
    setSelectedColumns(prev => ({
      ...prev,
      [checkType]: checked
        ? [...prev[checkType], column]
        : prev[checkType].filter(col => col !== column)
    }));
  };

  const handleRunAssessment = async () => {
    if (!dataSource) {
        toast({ variant: "destructive", title: "Error", description: "Please select a data source" });
        return;
    }
    if (databaseSources.includes(dataSource) && !query) {
        toast({ variant: "destructive", title: "Error", description: "Please enter a query for the selected database" });
        return;
    }
    if (fileSources.includes(dataSource) && uploadedFiles.length === 0 && !preselectedProject) {
        toast({ variant: "destructive", title: "Error", description: "Please upload at least one file" });
        return;
    }

    setIsRunning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Mock results for demonstration
      const mockResults = { /* ... your extensive mock results object ... */ };
      toast({ title: "Assessment Complete", description: "Data Quality Assessment completed successfully" });
      onAssessmentComplete(mockResults);
    } catch (error) {
      toast({ variant: "destructive", title: "Assessment Failed", description: "An error occurred during the assessment" });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
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
            <Label htmlFor="datasource" className="flex items-center space-x-2">
              <span>Data Source Type</span>
              {isConnectionLocked && (
                <Lock className="w-4 h-4 text-amber-500" title="Data source is locked after selection or project load" />
              )}
            </Label>
            <Select value={dataSource} onValueChange={handleDataSourceChange} disabled={isConnectionLocked}>
              <SelectTrigger className={isConnectionLocked ? "opacity-60 cursor-not-allowed" : ""}>
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
                disabled={isConnectionLocked}
              />
            </div>
          )}

          {fileSources.includes(dataSource) && (
            <div className="space-y-2">
              <Label>File Upload</Label>
              <FileUpload
                onFilesChange={handleDataSourceFileUpload}
                acceptedTypes={
                    dataSource === "xlsx" ? ".xlsx" :
                    dataSource === "csv" ? ".csv" :
                    dataSource === "json" ? ".json" :
                    "*/*" // For Azure Blob or others
                }
                multiple={false}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration File Upload & Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span>Configuration & Verification</span>
          </CardTitle>
          <CardDescription>
            Optionally upload a config file, then verify the data to enable quality checks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            onFilesChange={(files) => setConfigFile(files[0] || null)}
            acceptedTypes=".json"
            multiple={false}
          />

          {isDataSourceUploaded && !isDataVerified && (
            <div className="flex justify-center pt-4">
              <Button onClick={handleVerifyData} disabled={isVerifying} variant="outline" className="px-6 py-2">
                {isVerifying ? (
                  <><Settings className="w-4 h-4 mr-2 animate-spin" /> Verifying Data...</>
                ) : (
                  <><Settings className="w-4 h-4 mr-2" /> Verify Data Source</>
                )}
              </Button>
            </div>
          )}

          {isDataVerified && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span>Data Configuration Suggestions</span>
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                Select columns for specific data quality checks based on your uploaded dataset.
              </p>

              <div className="space-y-6">
                {/* Completeness Checks */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Completeness Checks</h5>
                  <p className="text-sm text-gray-500">Select columns to check for null/missing values.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockColumns.map((column) => (
                      <div key={`completeness-${column.name}`} className="flex items-start space-x-3 p-2 rounded-lg border bg-gray-50">
                        <Checkbox id={`completeness-${column.name}`} checked={selectedColumns.completeness.includes(column.name)} onCheckedChange={(checked) => handleColumnSelection('completeness', column.name, checked)} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`completeness-${column.name}`} className="text-sm font-medium cursor-pointer">{column.name}</Label>
                          <p className="text-xs text-gray-500 mt-1">{column.description}</p>
                          <span className="text-xs text-blue-600 font-mono">({column.type})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uniqueness Checks */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Uniqueness Checks</h5>
                  <p className="text-sm text-gray-500">Select columns to check for duplicate values.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockColumns.map((column) => (
                      <div key={`uniqueness-${column.name}`} className="flex items-start space-x-3 p-2 rounded-lg border bg-gray-50">
                        <Checkbox id={`uniqueness-${column.name}`} checked={selectedColumns.uniqueness.includes(column.name)} onCheckedChange={(checked) => handleColumnSelection('uniqueness', column.name, checked)} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`uniqueness-${column.name}`} className="text-sm font-medium cursor-pointer">{column.name}</Label>
                           <p className="text-xs text-gray-500 mt-1">{column.description}</p>
                           <span className="text-xs text-blue-600 font-mono">({column.type})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Validity Checks */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Validity and Range Checks</h5>
                  <p className="text-sm text-gray-500">Select columns to validate data formats and ranges.</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockColumns.map((column) => (
                      <div key={`validity-${column.name}`} className="flex items-start space-x-3 p-2 rounded-lg border bg-gray-50">
                        <Checkbox id={`validity-${column.name}`} checked={selectedColumns.validity.includes(column.name)} onCheckedChange={(checked) => handleColumnSelection('validity', column.name, checked)} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`validity-${column.name}`} className="text-sm font-medium cursor-pointer">{column.name}</Label>
                           <p className="text-xs text-gray-500 mt-1">{column.description}</p>
                           <span className="text-xs text-blue-600 font-mono">({column.type})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consistency Checks */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Consistency Checks</h5>
                  <p className="text-sm text-gray-500">Select columns for cross-field validation.</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockColumns.map((column) => (
                      <div key={`consistency-${column.name}`} className="flex items-start space-x-3 p-2 rounded-lg border bg-gray-50">
                        <Checkbox id={`consistency-${column.name}`} checked={selectedColumns.consistency.includes(column.name)} onCheckedChange={(checked) => handleColumnSelection('consistency', column.name, checked)} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`consistency-${column.name}`} className="text-sm font-medium cursor-pointer">{column.name}</Label>
                           <p className="text-xs text-gray-500 mt-1">{column.description}</p>
                           <span className="text-xs text-blue-600 font-mono">({column.type})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* **IMPROVED**: Staleness Checks now only show Date columns */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Staleness Checks</h5>
                  <p className="text-sm text-gray-500">Select date columns to check for data freshness.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockColumns
                      .filter(column => column.type === 'Date')
                      .map((column) => (
                      <div key={`staleness-${column.name}`} className="flex items-start space-x-3 p-2 rounded-lg border bg-gray-50">
                        <Checkbox id={`staleness-${column.name}`} checked={selectedColumns.staleness.includes(column.name)} onCheckedChange={(checked) => handleColumnSelection('staleness', column.name, checked)} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`staleness-${column.name}`} className="text-sm font-medium cursor-pointer">{column.name}</Label>
                           <p className="text-xs text-gray-500 mt-1">{column.description}</p>
                           <span className="text-xs text-blue-600 font-mono">({column.type})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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
            Select an AI/ML approach for advanced anomaly detection.
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

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <Button
          onClick={handleSaveConfiguration}
          disabled={
            !dataSource ||
            (fileSources.includes(dataSource) && !isDataSourceUploaded && !preselectedProject) ||
            (databaseSources.includes(dataSource) && !query.trim()) ||
            isSaved
          }
          variant="outline"
          size="lg"
          className="px-8 py-3"
        >
          {isSaved ? (
            <><Save className="w-5 h-5 mr-2 text-green-600" /> Configuration Saved</>
          ) : (
            <><Save className="w-5 h-5 mr-2" /> Save Configuration</>
          )}
        </Button>

        <Button
          onClick={handleRunAssessment}
          disabled={isRunning}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          {isRunning ? (
            <><Settings className="w-5 h-5 mr-2 animate-spin" /> Running Assessment...</>
          ) : (
            <><Play className="w-5 h-5 mr-2" /> Run Data Quality Assessment</>
          )}
        </Button>
      </div>
    </div>
  );
};

// This export is for the environment to render the component.
export default DataSourceSelection;

