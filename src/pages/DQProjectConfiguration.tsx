import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Database, FileText, Brain, Trash2, CheckCircle } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { toast } from "@/hooks/use-toast";

interface DQProject {
  id: string;
  name: string;
  source: string;
  status: 'active' | 'paused';
  lastRun: string;
  description?: string;
  query?: string;
  aiApproach?: string;
}

interface DQProjectConfigurationProps {
  userInfo: { userid: string } | null;
  onLogout: () => void;
}

export const DQProjectConfiguration = ({ userInfo, onLogout }: DQProjectConfigurationProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(projectId);
  
  const [project, setProject] = useState<DQProject>({
    id: '',
    name: '',
    source: '',
    status: 'active',
    lastRun: '',
    description: '',
    query: '',
    aiApproach: ''
  });
  
  const [dataSource, setDataSource] = useState("");
  const [query, setQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [aiApproaches, setAiApproaches] = useState<string[]>([]);
  const [connectionVerified, setConnectionVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingConnection, setIsSavingConnection] = useState(false);
  
  // Connection fields for different data sources
  const [connectionFields, setConnectionFields] = useState({
    // MySQL fields
    mysql_host: '',
    mysql_port: '3306',
    mysql_username: '',
    mysql_password: '',
    mysql_database: '',
    
    // Oracle fields
    oracle_host: '',
    oracle_port: '1521',
    oracle_sid: '',
    oracle_username: '',
    oracle_password: '',
    oracle_database: '',
    
    // MongoDB fields
    mongodb_connection_string: '',
    
    // Trino fields
    trino_host: '',
    trino_port: '8080',
    trino_username: '',
    trino_password: '',
    trino_catalog: '',
    trino_schema: '',
    
    // Azure Blob fields
    azure_account_name: '',
    azure_container_name: '',
    azure_sas_token: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    description: '',
    dataSource: ''
  });

  useEffect(() => {
    if (isEdit && projectId) {
      // Load existing project
      const savedProjects = localStorage.getItem('dq-projects');
      if (savedProjects) {
        const projects: DQProject[] = JSON.parse(savedProjects);
        const foundProject = projects.find(p => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
          setDataSource(foundProject.source === 'Oracle DB' ? 'oracle' : 
                      foundProject.source === 'PostgreSQL' ? 'sql' :
                      foundProject.source === 'MongoDB' ? 'mongodb' : '');
          setQuery(foundProject.query || '');
          setAiApproaches(foundProject.aiApproach ? foundProject.aiApproach.split(',') : []);
          setConnectionVerified(databaseSources.includes(foundProject.source === 'Oracle DB' ? 'oracle' : 
                      foundProject.source === 'PostgreSQL' ? 'sql' :
                      foundProject.source === 'MongoDB' ? 'mongodb' : '') ? true : true);
        }
      }
    }
  }, [isEdit, projectId]);

  const databaseSources = ["mysql", "oracle", "mongodb", "trino", "azure_blob"];
  const fileSources = ["xlsx", "csv", "json"];

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return value.trim() === '' ? 'Project name is required' : '';
      case 'description':
        return value.trim() === '' ? 'Description is required' : '';
      case 'dataSource':
        return value === '' ? 'Please select a data source' : '';
      default:
        return '';
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSaveConnection = async () => {
    setIsSavingConnection(true);
    
    // Simulate saving connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save connection to localStorage for the project
    const connectionKey = `connection-${dataSource}-${project.name || 'new'}`;
    localStorage.setItem(connectionKey, JSON.stringify(connectionFields));
    
    setIsSavingConnection(false);
    
    toast({
      title: "Connection Saved",
      description: "Connection configuration has been saved successfully",
    });
  };

  const handleVerifyConnection = async () => {
    if (!databaseSources.includes(dataSource)) return;
    
    setIsVerifying(true);
    
    // Simulate connection verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectionVerified(true);
    setIsVerifying(false);
    
    toast({
      title: "Connection Verified",
      description: "Database connection has been successfully verified",
    });
  };

  const isFormValid = () => {
    const nameValid = project.name.trim() !== '';
    const descriptionValid = project.description?.trim() !== '';
    const dataSourceValid = dataSource !== '';
    const connectionValid = databaseSources.includes(dataSource) ? connectionVerified : true;
    
    return nameValid && descriptionValid && dataSourceValid && connectionValid;
  };

  const handleSaveProject = () => {
    // Validate all fields
    const nameError = validateField('name', project.name);
    const descriptionError = validateField('description', project.description || '');
    const dataSourceError = validateField('dataSource', dataSource);
    
    setValidationErrors({
      name: nameError,
      description: descriptionError,
      dataSource: dataSourceError
    });

    if (nameError || descriptionError || dataSourceError) {
      return;
    }

    if (databaseSources.includes(dataSource) && !connectionVerified) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please verify database connection before creating project",
      });
      return;
    }

    const savedProjects = localStorage.getItem('dq-projects');
    const projects: DQProject[] = savedProjects ? JSON.parse(savedProjects) : [];
    
    const sourceMap = {
      'mysql': 'MySQL',
      'oracle': 'Oracle',
      'mongodb': 'MongoDB',
      'trino': 'Trino',
      'azure_blob': 'Azure Blob',
      'xlsx': 'Excel File',
      'csv': 'CSV File',
      'json': 'JSON File'
    };

    const projectData: DQProject = {
      ...project,
      id: isEdit ? project.id : Date.now().toString(),
      source: sourceMap[dataSource as keyof typeof sourceMap] || dataSource,
      lastRun: isEdit ? project.lastRun : new Date().toLocaleString('sv-SE').replace('T', ' ').slice(0, 16),
      query,
      aiApproach: aiApproaches.join(',')
    };

    if (isEdit) {
      const updatedProjects = projects.map(p => p.id === projectId ? projectData : p);
      localStorage.setItem('dq-projects', JSON.stringify(updatedProjects));
      toast({
        title: "Project Updated",
        description: "Project configuration has been updated successfully",
      });
    } else {
      projects.push(projectData);
      localStorage.setItem('dq-projects', JSON.stringify(projects));
      toast({
        title: "Project Created",
        description: "New project has been created successfully",
      });
    }

    navigate('/');
  };

  const handleDeleteProject = () => {
    if (!isEdit || !projectId) return;

    const savedProjects = localStorage.getItem('dq-projects');
    const savedRuns = localStorage.getItem('dq-runs');
    
    if (savedProjects) {
      const projects: DQProject[] = JSON.parse(savedProjects);
      const updatedProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem('dq-projects', JSON.stringify(updatedProjects));
    }
    
    if (savedRuns) {
      const runs = JSON.parse(savedRuns);
      const updatedRuns = runs.filter((r: any) => r.projectId !== projectId);
      localStorage.setItem('dq-runs', JSON.stringify(updatedRuns));
    }

    toast({
      title: "Project Deleted",
      description: "Project and all associated runs have been deleted",
    });

    navigate('/');
  };

  const handleBackToProjects = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <div className="container mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              size="icon"
              className="h-auto p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'Edit Project Configuration' : 'Create New Project'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Update project details and data source configuration' : 'Configure your new data quality project'}
              </p>
            </div>
          </div>
          {isEdit && (
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Project
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Basic information about your data quality project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  onBlur={(e) => handleFieldBlur('name', e.target.value)}
                  placeholder="Enter project name"
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  onBlur={(e) => handleFieldBlur('description', e.target.value)}
                  placeholder="Enter project description"
                  rows={3}
                  className={validationErrors.description ? 'border-red-500' : ''}
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Source Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span>Data Source Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your data source and connection details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="datasource">Data Source Type</Label>
                <Select value={dataSource} onValueChange={(value) => { 
                  setDataSource(value);
                  setConnectionVerified(false);
                  handleFieldBlur('dataSource', value);
                }}>
                  <SelectTrigger className={validationErrors.dataSource ? 'border-red-500' : ''}>
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
                {validationErrors.dataSource && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.dataSource}</p>
                )}
              </div>

              {/* MySQL Connection Fields */}
              {dataSource === 'mysql' && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900">MySQL Connection Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mysql_host">Host</Label>
                      <Input
                        id="mysql_host"
                        value={connectionFields.mysql_host}
                        onChange={(e) => setConnectionFields({...connectionFields, mysql_host: e.target.value})}
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mysql_port">Port</Label>
                      <Input
                        id="mysql_port"
                        value={connectionFields.mysql_port}
                        onChange={(e) => setConnectionFields({...connectionFields, mysql_port: e.target.value})}
                        placeholder="3306"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mysql_username">Username</Label>
                      <Input
                        id="mysql_username"
                        value={connectionFields.mysql_username}
                        onChange={(e) => setConnectionFields({...connectionFields, mysql_username: e.target.value})}
                        placeholder="root"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mysql_password">Password</Label>
                      <Input
                        id="mysql_password"
                        type="password"
                        value={connectionFields.mysql_password}
                        onChange={(e) => setConnectionFields({...connectionFields, mysql_password: e.target.value})}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mysql_database">Database</Label>
                    <Input
                      id="mysql_database"
                      value={connectionFields.mysql_database}
                      onChange={(e) => setConnectionFields({...connectionFields, mysql_database: e.target.value})}
                      placeholder="Database name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="query">Database Query</Label>
                    <Textarea
                      id="query"
                      placeholder="SELECT * FROM table_name WHERE condition"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveConnection}
                      disabled={isSavingConnection}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSavingConnection ? 'Saving...' : 'Save Connection'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyConnection}
                      disabled={isVerifying}
                      className="flex items-center gap-2"
                    >
                      {connectionVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                      {isVerifying ? 'Verifying...' : connectionVerified ? 'Connection Verified' : 'Verify Connection'}
                    </Button>
                    {connectionVerified && (
                      <span className="text-sm text-green-600">✓ Connection verified successfully</span>
                    )}
                  </div>
                </div>
              )}

              {/* Oracle Connection Fields */}
              {dataSource === 'oracle' && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900">Oracle Connection Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="oracle_host">Host</Label>
                      <Input
                        id="oracle_host"
                        value={connectionFields.oracle_host}
                        onChange={(e) => setConnectionFields({...connectionFields, oracle_host: e.target.value})}
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oracle_port">Port</Label>
                      <Input
                        id="oracle_port"
                        value={connectionFields.oracle_port}
                        onChange={(e) => setConnectionFields({...connectionFields, oracle_port: e.target.value})}
                        placeholder="1521"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oracle_sid">SID</Label>
                      <Input
                        id="oracle_sid"
                        value={connectionFields.oracle_sid}
                        onChange={(e) => setConnectionFields({...connectionFields, oracle_sid: e.target.value})}
                        placeholder="xe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oracle_username">Username</Label>
                      <Input
                        id="oracle_username"
                        value={connectionFields.oracle_username}
                        onChange={(e) => setConnectionFields({...connectionFields, oracle_username: e.target.value})}
                        placeholder="system"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oracle_password">Password</Label>
                      <Input
                        id="oracle_password"
                        type="password"
                        value={connectionFields.oracle_password}
                        onChange={(e) => setConnectionFields({...connectionFields, oracle_password: e.target.value})}
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oracle_database">Database</Label>
                      <Input
                        id="oracle_database"
                        value={connectionFields.oracle_database}
                        onChange={(e) => setConnectionFields({...connectionFields, oracle_database: e.target.value})}
                        placeholder="Database name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="query">Database Query</Label>
                    <Textarea
                      id="query"
                      placeholder="SELECT * FROM table_name WHERE condition"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveConnection}
                      disabled={isSavingConnection}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSavingConnection ? 'Saving...' : 'Save Connection'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyConnection}
                      disabled={isVerifying}
                      className="flex items-center gap-2"
                    >
                      {connectionVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                      {isVerifying ? 'Verifying...' : connectionVerified ? 'Connection Verified' : 'Verify Connection'}
                    </Button>
                    {connectionVerified && (
                      <span className="text-sm text-green-600">✓ Connection verified successfully</span>
                    )}
                  </div>
                </div>
              )}

              {/* MongoDB Connection Fields */}
              {dataSource === 'mongodb' && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900">MongoDB Connection Details</h4>
                  <div>
                    <Label htmlFor="mongodb_connection_string">Connection String</Label>
                    <Input
                      id="mongodb_connection_string"
                      value={connectionFields.mongodb_connection_string}
                      onChange={(e) => setConnectionFields({...connectionFields, mongodb_connection_string: e.target.value})}
                      placeholder="mongodb://username:password@host:port/database"
                    />
                  </div>
                  <div>
                    <Label htmlFor="query">Database Query</Label>
                    <Textarea
                      id="query"
                      placeholder='{"field": {"$gt": 100}}'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveConnection}
                      disabled={isSavingConnection}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSavingConnection ? 'Saving...' : 'Save Connection'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyConnection}
                      disabled={isVerifying}
                      className="flex items-center gap-2"
                    >
                      {connectionVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                      {isVerifying ? 'Verifying...' : connectionVerified ? 'Connection Verified' : 'Verify Connection'}
                    </Button>
                    {connectionVerified && (
                      <span className="text-sm text-green-600">✓ Connection verified successfully</span>
                    )}
                  </div>
                </div>
              )}

              {/* Trino Connection Fields */}
              {dataSource === 'trino' && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900">Trino Connection Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trino_host">Host</Label>
                      <Input
                        id="trino_host"
                        value={connectionFields.trino_host}
                        onChange={(e) => setConnectionFields({...connectionFields, trino_host: e.target.value})}
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trino_port">Port</Label>
                      <Input
                        id="trino_port"
                        value={connectionFields.trino_port}
                        onChange={(e) => setConnectionFields({...connectionFields, trino_port: e.target.value})}
                        placeholder="8080"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trino_username">Username</Label>
                      <Input
                        id="trino_username"
                        value={connectionFields.trino_username}
                        onChange={(e) => setConnectionFields({...connectionFields, trino_username: e.target.value})}
                        placeholder="admin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trino_password">Password</Label>
                      <Input
                        id="trino_password"
                        type="password"
                        value={connectionFields.trino_password}
                        onChange={(e) => setConnectionFields({...connectionFields, trino_password: e.target.value})}
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trino_catalog">Catalog</Label>
                      <Input
                        id="trino_catalog"
                        value={connectionFields.trino_catalog}
                        onChange={(e) => setConnectionFields({...connectionFields, trino_catalog: e.target.value})}
                        placeholder="hive"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trino_schema">Schema</Label>
                      <Input
                        id="trino_schema"
                        value={connectionFields.trino_schema}
                        onChange={(e) => setConnectionFields({...connectionFields, trino_schema: e.target.value})}
                        placeholder="default"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="query">Database Query</Label>
                    <Textarea
                      id="query"
                      placeholder="SELECT * FROM catalog.schema.table_name WHERE condition"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveConnection}
                      disabled={isSavingConnection}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSavingConnection ? 'Saving...' : 'Save Connection'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyConnection}
                      disabled={isVerifying}
                      className="flex items-center gap-2"
                    >
                      {connectionVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                      {isVerifying ? 'Verifying...' : connectionVerified ? 'Connection Verified' : 'Verify Connection'}
                    </Button>
                    {connectionVerified && (
                      <span className="text-sm text-green-600">✓ Connection verified successfully</span>
                    )}
                  </div>
                </div>
              )}

              {/* Azure Blob Connection Fields */}
              {dataSource === 'azure_blob' && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900">Azure Blob Storage Connection Details</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="azure_account_name">Account Name</Label>
                      <Input
                        id="azure_account_name"
                        value={connectionFields.azure_account_name}
                        onChange={(e) => setConnectionFields({...connectionFields, azure_account_name: e.target.value})}
                        placeholder="mystorageaccount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="azure_container_name">Container Name</Label>
                      <Input
                        id="azure_container_name"
                        value={connectionFields.azure_container_name}
                        onChange={(e) => setConnectionFields({...connectionFields, azure_container_name: e.target.value})}
                        placeholder="mycontainer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="azure_sas_token">SAS Token</Label>
                      <Input
                        id="azure_sas_token"
                        type="password"
                        value={connectionFields.azure_sas_token}
                        onChange={(e) => setConnectionFields({...connectionFields, azure_sas_token: e.target.value})}
                        placeholder="?sv=2022-11-02&ss=b&srt=..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="query">Query (File Path/Pattern)</Label>
                      <Textarea
                        id="query"
                        placeholder="data/*.csv or specific file path"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveConnection}
                      disabled={isSavingConnection}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSavingConnection ? 'Saving...' : 'Save Connection'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyConnection}
                      disabled={isVerifying}
                      className="flex items-center gap-2"
                    >
                      {connectionVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                      {isVerifying ? 'Verifying...' : connectionVerified ? 'Connection Verified' : 'Verify Connection'}
                    </Button>
                    {connectionVerified && (
                      <span className="text-sm text-green-600">✓ Connection verified successfully</span>
                    )}
                  </div>
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
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isolation-forest"
                    checked={aiApproaches.includes('isolation-forest')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAiApproaches([...aiApproaches, 'isolation-forest']);
                      } else {
                        setAiApproaches(aiApproaches.filter(a => a !== 'isolation-forest'));
                      }
                    }}
                  />
                  <Label htmlFor="isolation-forest">Anomaly Detection using Isolation Forest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="kmeans"
                    checked={aiApproaches.includes('kmeans')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAiApproaches([...aiApproaches, 'kmeans']);
                      } else {
                        setAiApproaches(aiApproaches.filter(a => a !== 'kmeans'));
                      }
                    }}
                  />
                  <Label htmlFor="kmeans">Anomaly Detection using K-means Clustering</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="z-score"
                    checked={aiApproaches.includes('z-score')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAiApproaches([...aiApproaches, 'z-score']);
                      } else {
                        setAiApproaches(aiApproaches.filter(a => a !== 'z-score'));
                      }
                    }}
                  />
                  <Label htmlFor="z-score">Anomaly Detection using Z-Score</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="local-outlier"
                    checked={aiApproaches.includes('local-outlier')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAiApproaches([...aiApproaches, 'local-outlier']);
                      } else {
                        setAiApproaches(aiApproaches.filter(a => a !== 'local-outlier'));
                      }
                    }}
                  />
                  <Label htmlFor="local-outlier">Anomaly Detection using Local Outlier Factor</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveProject}
              disabled={!isFormValid()}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isEdit ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};