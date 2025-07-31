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

  const databaseSources = ["mongodb", "sql", "oracle"];
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
      'mongodb': 'MongoDB',
      'sql': 'PostgreSQL', 
      'oracle': 'Oracle DB',
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
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="sql">PostgreSQL</SelectItem>
                    <SelectItem value="oracle">Oracle Database</SelectItem>
                    <SelectItem value="xlsx">Excel File (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV File (.csv)</SelectItem>
                    <SelectItem value="json">JSON File (.json)</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.dataSource && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.dataSource}</p>
                )}
              </div>

              {databaseSources.includes(dataSource) && (
                <>
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
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVerifyConnection}
                      disabled={isVerifying || !query.trim()}
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
                </>
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