import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { WorkspacePanel } from "./WorkspacePanel";
import { RunsPanel } from "./RunsPanel";
import { InsightsPanel } from "./InsightsPanel";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

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
  userInfo: { userid: string } | null;
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


  // Save data to localStorage whenever projects or runs change
  useEffect(() => {
    localStorage.setItem('dq-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('dq-runs', JSON.stringify(runs));
  }, [runs]);


  const handleCreateProject = () => {
    // Redirect to project configuration page
    navigate('/project-configuration');
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
    navigate(`/project-configuration/${project.id}`);
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
        <Header userInfo={userInfo} onLogout={onLogout} alerts={[]} />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">No Projects Yet</h1>
              <p className="text-gray-600 mb-6">Get started by creating your first data quality project</p>
            </div>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleCreateProject}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userInfo={userInfo} onLogout={onLogout} alerts={[]} />
      <div className="bg-[#051927] min-h-screen p-4 font-sans text-gray-200 flex flex-col">
        {/* Body Header */}
        <header className="flex justify-end items-center mb-4">
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm">
              <Plus size={16} className="mr-2" /> Create Project
            </button>
            <button className="bg-[#0A2232] border border-blue-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm">
              <Filter size={16} className="mr-2" /> Advanced Filters
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex space-x-4">
          <WorkspacePanel />
          <RunsPanel />
          <InsightsPanel />
        </main>
      </div>
    </div>

  );
};