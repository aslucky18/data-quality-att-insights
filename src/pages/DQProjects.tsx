import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash2, Plus, RotateCcw, TrendingUp, X, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
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
  const [projects, setProjects] = useState<DQProject[]>(initialProjects);
  const [runs, setRuns] = useState<DQRun[]>(initialRuns);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DQProject | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    source: '',
    description: ''
  });

  const handleCreateProject = () => {
    const project: DQProject = {
      id: Date.now().toString(),
      name: newProject.name,
      source: newProject.source,
      status: 'active',
      lastRun: new Date().toLocaleString('sv-SE').replace('T', ' ').slice(0, 16),
      description: newProject.description
    };
    
    setProjects([...projects, project]);
    setNewProject({ name: '', source: '', description: '' });
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

  const handleReadProject = (projectId: string) => {
    // Navigate to DQ Engine with the selected project
    navigate('/dq-engine', { state: { selectedProjectId: projectId } });
  };

  const handleRunProject = (projectId: string) => {
    const newRun: DQRun = {
      id: Date.now().toString(),
      projectId,
      runId: `run-${String(runs.length + 1).padStart(3, '0')}`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userInfo={userInfo} onLogout={onLogout} />
      <div className="container mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DQ Projects Section */}
          <Card className="h-fit">
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
                      <Label htmlFor="source">Data Source</Label>
                      <Select onValueChange={(value) => setNewProject({ ...newProject, source: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Oracle DB">Oracle DB</SelectItem>
                          <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                          <SelectItem value="MongoDB">MongoDB</SelectItem>
                          <SelectItem value="MySQL">MySQL</SelectItem>
                          <SelectItem value="SQL Server">SQL Server</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
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
                      disabled={!newProject.name || !newProject.source}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{project.name}</h3>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="bg-purple-600 text-white">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Source: {project.source}</div>
                    <div>Last run: {project.lastRun}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReadProject(project.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Play className="h-3 w-3" />
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRunProject(project.id)}
                      className="flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Run
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleProjectStatus(project.id)}
                      className="flex items-center gap-1"
                    >
                      <Pause className="h-3 w-3" />
                      Pause
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* DQ Run Level Items Section */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <CardTitle className="text-xl">DQ Run Level Items</CardTitle>
                  <CardDescription>Job execution status and performance metrics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {runs.map((run) => (
                <div key={run.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      <h3 className="font-semibold">Run {run.runId}</h3>
                    </div>
                    <Badge variant={getStatusBadgeVariant(run.status)} className="bg-purple-600 text-white">
                      {run.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Started: {run.startTime}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Duration:</div>
                      <div className="font-medium">{run.duration}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Records:</div>
                      <div className="font-medium">{run.records.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Errors:</div>
                      <div className={`font-medium ${run.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {run.errors}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Rerun
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <TrendingUp className="h-3 w-3" />
                      Performance
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveRun(run.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};