import { useState, useEffect } from "react";
import { WorkspacePanel } from "@/panels/WorkspacePanel";
import { RunsPanel } from "@/panels/RunsPanel";
import { InsightsPanel } from "@/panels/InsightsPanel";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ListFilter, Plus, CheckCircle, XCircle, Clock, AlertTriangle, Filter, Menu } from "lucide-react";
import { DQProject, DQRun } from '@/lib/types';
import { initialProjects, initialRuns, generateInsightsForRun } from "@/constants";

interface DQProjectsProps {
  userInfo: { userid: string } | null;
  onLogout: () => void;
}

export const DQProjects = ({ userInfo, onLogout }: DQProjectsProps) => {
  const navigate = useNavigate();

  // Load data from localStorage on component mount, fallback to initial data
  const [projects, setProjects] = useState<DQProject[]>(() => {
    const savedProjects = localStorage.getItem('temp-data-quality-projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });

  const [runs, setRuns] = useState<DQRun[]>(() => {
    const savedRuns = localStorage.getItem('dq-runs');
    return savedRuns ? JSON.parse(savedRuns) : initialRuns;
  });

  // Save data to localStorage whenever projects or runs change
  useEffect(() => {
    localStorage.setItem('temp-data-quality-projects', JSON.stringify(projects));
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
        ? { ...p, status: p.status === 'active' ? 'In-Active' : 'active' }
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
      runId: `run-${String(runs.filter(r => r.projectId === projectId).length + 1).padStart(3, '0')}`,
      runName: `${project?.name || 'Unknown Project'} Run`,
      status: 'running',
      startTime: new Date().toLocaleString('sv-SE').replace('T', ' ').slice(0, 16),
      duration: '0m 0s',
      records: 0,
      errors: 0,
      alerts: "0/3"
    };

    setRuns([newRun, ...runs]);

    // Update project's last run
    setProjects(projects.map(p =>
      p.id === projectId
        ? { ...p, lastRun: newRun.startTime }
        : p
    ));

    // Simulate completion after execution
    setTimeout(() => {
      const completedRun: DQRun = {
        ...newRun,
        status: Math.random() > 0.2 ? 'success' : 'failed', // 80% success rate
        duration: `${Math.floor(Math.random() * 5 + 8)}m ${Math.floor(Math.random() * 60)}s`,
        records: Math.floor(Math.random() * 50000 + 10000),
        errors: Math.floor(Math.random() * 50),
        alerts: ['0/3', '1/3', '2/3', '3/3'][Math.floor(Math.random() * 4)]
      };

      setRuns(prevRuns => 
        prevRuns.map(run => 
          run.id === newRun.id ? completedRun : run
        )
      );
    }, 100); // Small delay to ensure UI updates properly
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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Reset run selection when project changes to prevent stale data
    setSelectedRunId(null);
  };

  const handleRunSelect = (run: DQRun) => {
    setSelectedRunId(run.id);
  };

  // Get runs for the selected project, sorted by most recent first
  const getProjectRuns = (projectId: string | null) => {
    if (!projectId) return [];
    return runs
      .filter(run => run.projectId === projectId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  };

  // Get selected project and run objects
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;
  const selectedRun = runs.find(r => r.id === selectedRunId) || null;
  
  // Generate insights for the selected run
  const selectedInsights = selectedRun && selectedProject 
    ? generateInsightsForRun(selectedRun, selectedProject)
    : null;

  console.log("Rendering DQProjects with projects:", projects.length);
  return (
    <div>
      <header className="flex justify-end items-center mb-4">
        <div className="flex items-center space-x-4">
          <button
            className="bg-[#0a5bb6] text-white font-semibold rounded-full py-2 px-4 flex items-center text-sm"
            onClick={handleCreateProject}
          >
            <Plus size={16} className="mr-2" /> Create Project
          </button>
          <button
            className="flex items-center gap-x-2 rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold text-black">
            <ListFilter size={16} className="mr-2" /> Advanced Filters
          </button>
        </div>
      </header>
      {/* Main Content - Workspace (left), Runs (middle), Insights (right) */}
      <main className="flex flex-col lg:flex-row gap-4 w-full min-h-[calc(100vh-200px)]">
        <div className="w-full lg:w-1/4 min-w-[300px]">
          <WorkspacePanel
            dqProjects={projects}
            onProjectSelect={handleProjectSelect}
            selectedProjectId={selectedProjectId}
          />
        </div>
        <div className="w-full lg:w-1/2 min-w-[400px]">
          <RunsPanel
            runs={getProjectRuns(selectedProjectId)}
            selectedProject={selectedProject}
            selectedRun={selectedRun}
            onExecuteRun={handleRunProject}
            onRunSelect={handleRunSelect}
          />
        </div>
        <div className="w-full lg:w-1/4 min-w-[300px]">
          <InsightsPanel 
            insights={selectedInsights}
            selectedProject={selectedProject}
            selectedRun={selectedRun}
          />
        </div>
      </main>
    </div>
  )
};