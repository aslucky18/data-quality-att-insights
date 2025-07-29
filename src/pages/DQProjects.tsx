import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash2, Plus, RotateCcw, TrendingUp, X, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Edit, Eye, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

const initialProjects: DQProject[] = [
  {
    id: '1',
    name: 'Customer Data Validation',
    source: 'Oracle DB',
    status: 'active',
    lastRun: '2025-01-22 14:30',
    description: 'Validates customer data integrity and completeness'
  },
  {
    id: '2',
    name: 'Financial Records QC',
    source: 'PostgreSQL',
    status: 'paused',
    lastRun: '2025-01-21 09:15',
    description: 'Quality control for financial transaction records'
  },
  {
    id: '3',
    name: 'Inventory Data Check',
    source: 'MongoDB',
    status: 'active',
    lastRun: '2025-01-22 11:45',
    description: 'Inventory data validation and consistency checks'
  }
];

const initialRuns: DQRun[] = [
  {
    id: '1',
    projectId: '1',
    runId: 'run-001',
    runName: 'Customer Data Validation Run',
    status: 'success',
    startTime: '2025-01-22 14:30',
    duration: '15m 32s',
    records: 125000,
    errors: 0
  },
  {
    id: '2',
    projectId: '2',
    runId: 'run-002',
    runName: 'Financial Records QC Run',
    status: 'failed',
    startTime: '2025-01-22 13:15',
    duration: '3m 12s',
    records: 8450,
    errors: 45
  },
  {
    id: '3',
    projectId: '3',
    runId: 'run-003',
    runName: 'Inventory Data Check Run',
    status: 'running',
    startTime: '2025-01-22 15:00',
    duration: '5m 20s',
    records: 45000,
    errors: 2
  },
  {
    id: '4',
    projectId: '1',
    runId: 'run-004',
    runName: 'Customer Data Validation Run',
    status: 'paused',
    startTime: '2025-01-22 12:30',
    duration: '8m 45s',
    records: 67000,
    errors: 1
  }
];

interface DQProjectsProps {
  userInfo: { attuid: string } | null;
  onLogout: () => void;
}

export const DQProjects = ({ userInfo, onLogout }: DQProjectsProps) => {
  const navigate = useNavigate();
  
  // Load data from localStorage on component mount, fallback to initial data
  const [projects, setProjects] = useState<DQProject[]>(() => {
    const savedProjects = localStorage.getItem('dq-projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });
  
  const [runs, setRuns] = useState<DQRun[]>(() => {
    const savedRuns = localStorage.getItem('dq-runs');
    return savedRuns ? JSON.parse(savedRuns) : initialRuns;
  });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DQProject | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Save data to localStorage whenever projects or runs change
  useEffect(() => {
    localStorage.setItem('dq-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('dq-runs', JSON.stringify(runs));
  }, [runs]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  const handleCreateProject = () => {
    const project: DQProject = {
      id: Date.now().toString(),
      name: newProject.name,
      source: 'Not Configured',
      status: 'active',
      lastRun: new Date().toLocaleString('sv-SE').replace('T', ' ').slice(0, 16),
      description: newProject.description
    };
    
    setProjects([...projects, project]);
    setNewProject({ name: '', description: '' });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setRuns(runs.filter(r => r.projectId !== id));
  };

  const handleToggleProjectStatus = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'paused' : 'active' }
        : p
    ));
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/project-runs/${projectId}`);
  };

  const handleRunProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    const newRun: DQRun = {
      id: Date.now().toString(),
      projectId,
      runId: `run-${String(runs.length + 1).padStart(3, '0')}`,
      runName: `${project?.name || 'Unknown Project'} Run`,
      status: 'running',
      startTime: new Date().toLocaleString('sv-SE').replace('T', ' ').slice(0, 16),
      duration: '0m 0s',
      records: 0,
      errors: 0
    };
    
    setRuns([newRun, ...runs]);
    
    // Update project's last run
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, lastRun: newRun.startTime }
        : p
    ));
  };

  const handleRemoveRun = (runId: string) => {
    setRuns(runs.filter(r => r.id !== runId));
  };

  const handleEditProject = (project: DQProject) => {
    setSelectedProject(project);
    setNewProject({ 
      name: project.name, 
      description: project.description || '' 
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProject = () => {
    if (selectedProject) {
      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? { ...p, name: newProject.name, description: newProject.description }
          : p
      ));
      setNewProject({ name: '', description: '' });
      setSelectedProject(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleViewLogs = (projectId: string) => {
    // Navigate to logs view for the project
    console.log('Viewing logs for project:', projectId);
  };

  const getProjectRunStats = (projectId: string) => {
    const projectRuns = runs.filter(r => r.projectId === projectId);
    const latestRun = projectRuns.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
    const successCount = projectRuns.filter(r => r.status === 'success').length;
    return { latestRun, successCount, totalRuns: projectRuns.length };
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

  // Handle empty state
  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header userInfo={userInfo} onLogout={onLogout} />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">No Projects Yet</h1>
              <p className="text-gray-600 mb-6">Get started by creating your first data quality project</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New DQ Project</DialogTitle>
                  <DialogDescription>
                    Add a new data quality project to monitor and validate your data.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Enter project description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={!newProject.name}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex justify-center">
          {/* DQ Projects Section */}
          <Card className="w-full max-w-4xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <CardTitle className="text-xl">DQ Projects</CardTitle>
                  <CardDescription>Data Quality project management</CardDescription>
                </div>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New DQ Project</DialogTitle>
                    <DialogDescription>
                      Add a new data quality project to monitor and validate your data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateProject}
                      disabled={!newProject.name}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Project Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit DQ Project</DialogTitle>
                    <DialogDescription>
                      Update the project details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Project Name</Label>
                      <Input
                        id="edit-name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description (Optional)</Label>
                      <Textarea
                        id="edit-description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateProject}
                      disabled={!newProject.name}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Update Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => {
                const { latestRun, successCount, totalRuns } = getProjectRunStats(project.id);
                const isPaused = project.status === 'paused';
                
                return (
                  <div 
                    key={project.id} 
                    className={`border rounded-lg p-4 space-y-3 transition-all duration-200 hover:shadow-md ${
                      isPaused ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : 'hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-semibold ${isPaused ? 'text-gray-500' : ''}`}>
                          {project.name}
                        </h3>
                        {/* Run-level indicator */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                          <Activity className="h-3 w-3" />
                          <span>{successCount}/{totalRuns}</span>
                        </div>
                        {latestRun && (
                          <div className="flex items-center gap-1">
                            {getStatusIcon(latestRun.status)}
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'} 
                        className={`${project.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Source: {project.source}</div>
                      <div>Last run: {project.lastRun}</div>
                      {project.description && (
                        <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                          {project.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenProject(project.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        disabled={isPaused}
                      >
                        <FileText className="h-3 w-3" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRunProject(project.id)}
                        className="flex items-center gap-1 hover:bg-green-50 hover:text-green-700 transition-colors"
                        disabled={isPaused}
                      >
                        <Play className="h-3 w-3" />
                        Run
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleProjectStatus(project.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          isPaused 
                            ? 'hover:bg-green-50 hover:text-green-700' 
                            : 'hover:bg-yellow-50 hover:text-yellow-700'
                        }`}
                      >
                        {isPaused ? (
                          <>
                            <Play className="h-3 w-3" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3" />
                            Pause
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};