import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, RotateCcw, Trash2, Settings, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface DQProject {
  id: string;
  name: string;
  source: string;
  status: 'active' | 'paused';
  lastRun: string;
  description?: string;
}

interface DQRun {
  id: string;
  projectId: string;
  runId: string;
  runName: string;
  status: 'success' | 'failed' | 'running' | 'paused';
  startTime: string;
  duration: string;
  records: number;
  errors: number;
}

interface DQProjectRunsProps {
  userInfo: { userid: string } | null;
  onLogout: () => void;
}

export const DQProjectRuns = ({ userInfo, onLogout }: DQProjectRunsProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<DQProject | null>(null);
  const [runs, setRuns] = useState<DQRun[]>([]);

  useEffect(() => {
    // Load project and runs data from localStorage
    const savedProjects = localStorage.getItem('dq-projects');
    const savedRuns = localStorage.getItem('dq-runs');
    
    if (savedProjects && projectId) {
      const projects: DQProject[] = JSON.parse(savedProjects);
      const foundProject = projects.find(p => p.id === projectId);
      setProject(foundProject || null);
    }
    
    if (savedRuns && projectId) {
      const allRuns: DQRun[] = JSON.parse(savedRuns);
      const projectRuns = allRuns.filter(r => r.projectId === projectId);
      // Sort by start time in descending order (newest first)
      projectRuns.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setRuns(projectRuns);
    }
  }, [projectId]);

  const handleBackToProjects = () => {
    navigate("/");
  };

  const handleViewRun = (runId: string) => {
    // Navigate to DQ Engine with this specific run
    navigate('/dq-engine', { state: { selectedProjectId: projectId, selectedRunId: runId } });
  };

  const handleRerunProject = () => {
    if (!project) return;
    
    const newRun: DQRun = {
      id: Date.now().toString(),
      projectId: project.id,
      runId: `run-${String(runs.length + 1).padStart(3, '0')}`,
      runName: `${project.name} Run`,
      status: 'running',
      startTime: new Date().toLocaleString('sv-SE').replace('T', ' ').slice(0, 16),
      duration: '0m 0s',
      records: 0,
      errors: 0
    };
    
    const updatedRuns = [newRun, ...runs];
    setRuns(updatedRuns);
    
    // Update localStorage
    const savedRuns = localStorage.getItem('dq-runs');
    if (savedRuns) {
      const allRuns: DQRun[] = JSON.parse(savedRuns);
      const otherRuns = allRuns.filter(r => r.projectId !== project.id);
      const finalRuns = [...otherRuns, ...updatedRuns];
      localStorage.setItem('dq-runs', JSON.stringify(finalRuns));
    }
  };

  const handleDeleteRun = (runId: string) => {
    const updatedRuns = runs.filter(r => r.id !== runId);
    setRuns(updatedRuns);
    
    // Update localStorage
    const savedRuns = localStorage.getItem('dq-runs');
    if (savedRuns) {
      const allRuns: DQRun[] = JSON.parse(savedRuns);
      const finalRuns = allRuns.filter(r => r.id !== runId);
      localStorage.setItem('dq-runs', JSON.stringify(finalRuns));
    }
  };

  const handleEditProjectConfiguration = () => {
    navigate(`/project-configuration/${projectId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'paused': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'failed': return 'destructive';
      case 'running': return 'secondary';
      case 'paused': return 'outline';
      default: return 'secondary';
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header userInfo={userInfo} onLogout={onLogout} />
        <div className="container mx-auto max-w-4xl p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <Button onClick={handleBackToProjects}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <div className="container mx-auto max-w-6xl p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackToProjects}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                DQ Run Level Items for {project.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Select a specific run to view detailed results in the DQ Engine
              </p>
            </div>
          </div>
          <Button
            onClick={handleEditProjectConfiguration}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Edit Project Configuration
          </Button>
        </div>

        {/* Project Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription>
                  Source: {project.source} • Last run: {project.lastRun}
                </CardDescription>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={project.status === 'active' ? 'default' : 'secondary'} 
                  className={`${project.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}`}
                >
                  {project.status}
                </Badge>
                <Button
                  onClick={handleRerunProject}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={project.status === 'paused'}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rerun Project
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Runs List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Run History</CardTitle>
            <CardDescription>
              Select a run to view detailed analysis results in the DQ Engine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {runs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No runs found for this project</p>
                <Button
                  onClick={handleRerunProject}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start First Run
                </Button>
              </div>
            ) : (
              runs.map((run) => (
                <div 
                  key={run.id} 
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md hover:border-purple-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(run.status)}
                      <div>
                        <h3 className="font-semibold">{run.runName}</h3>
                        <p className="text-sm text-gray-600">
                          Run ID: {run.runId} • Started: {run.startTime}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={getStatusBadgeVariant(run.status)} 
                      className={`${
                        run.status === 'success' ? 'bg-green-600 text-white' :
                        run.status === 'failed' ? 'bg-red-600 text-white' :
                        run.status === 'running' ? 'bg-blue-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}
                    >
                      {run.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Duration</div>
                      <div className="font-medium">{run.duration}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Records Processed</div>
                      <div className="font-medium">{run.records.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Errors</div>
                      <div className={`font-medium ${run.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {run.errors}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleViewRun(run.id)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="h-3 w-3" />
                      View Results in DQ Engine
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRerunProject}
                      className="flex items-center gap-1 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Rerun
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRun(run.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};