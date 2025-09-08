import { useState, useEffect } from "react";
import { WorkspacePanel } from "@/panels/WorkspacePanel";
import { RunsPanel } from "@/panels/RunsPanel";
import { InsightsPanel } from "@/panels/InsightsPanel";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  ListFilter,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { DQProject, DQRun } from "@/lib/types";
import {
  initialProjects,
  initialRuns,
  generateInsightsForRun,
  projectKey,
  runKey,
} from "@/constants";
import { toast } from "@/components/ui/use-toast";
import { run } from "node:test";
import { TitleHeader } from "@/components/TitleHeader";

interface DQProjectsProps {
  userInfo: { userid: string } | null;
  onLogout: () => void;
}

export const Dashboard = ({ userInfo, onLogout }: DQProjectsProps) => {
  const navigate = useNavigate();

  /** ========================
   * State Initialization
   ========================= */

  // Get projects and runs from localStorage or use initial data

  // Projects
  const [projects, setProjects] = useState<DQProject[]>(() => {
    const savedProjects = localStorage.getItem(projectKey);
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });
  // Runs
  const [runs, setRuns] = useState<DQRun[]>(() => {
    const savedRuns = localStorage.getItem(runKey);
    return savedRuns ? JSON.parse(savedRuns) : initialRuns;
  });

  // Selected Project and Run
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  /** ========================
   * Effects
   ========================= */

  // Parse lastRun dates on initial load
  useEffect(() => {
    const parsedProjects = projects.map((project) => ({
      ...project,
      lastRun: new Date(project.lastRun),
    }));
    setProjects(parsedProjects);
  }, []);

  // Persist projects and runs to localStorage on changes
  useEffect(() => {
    localStorage.setItem(projectKey, JSON.stringify(projects));
  }, [projects]);

  // Persist runs to localStorage on changes
  useEffect(() => {
    localStorage.setItem(runKey, JSON.stringify(runs));
  }, [runs]);

  /** ========================
   * Handlers (Primary)
   ========================= */

  const handleCreateProject = () => {
    navigate("/project-configuration");
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedRunId(null);
  };

  const handleRunSelect = (run: DQRun) => {
    setSelectedRunId(run.id);
  };

  const handleRunProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    const newRun: DQRun = {
      id: Date.now().toString(),
      projectId,
      runId: `run-${String(runs.filter((r) => r.projectId === projectId).length + 1).padStart(3, "0")}`,
      runName: `${project?.name || "Unknown Project"} Run`,
      status: "running",
      startTime: new Date()
        .toLocaleString("sv-SE")
        .replace("T", " ")
        .slice(0, 16),
      duration: "0m 0s",
      records: 0,
      errors: 0,
      alerts: "0/3",
    };

    setRuns([newRun, ...runs]);
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, lastRun: new Date(newRun.startTime) } : p,
      ),
    );

    setTimeout(() => {
      const completedRun: DQRun = {
        ...newRun,
        status: Math.random() > 0.2 ? "success" : "failed",
        duration: `${Math.floor(Math.random() * 5 + 8)}m ${Math.floor(Math.random() * 60)}s`,
        records: Math.floor(Math.random() * 50000 + 10000),
        errors: Math.floor(Math.random() * 50),
        alerts: ["0/3", "1/3", "2/3", "3/3"][Math.floor(Math.random() * 4)],
      };
      setRuns((prevRuns) =>
        prevRuns.map((run) => (run.id === newRun.id ? completedRun : run)),
      );
    }, 100);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setRuns(runs.filter((r) => r.projectId !== id));
  };

  const handleCloneProject = (project: DQProject) => {
    const clonedProject: DQProject = {
      id: Date.now().toString(),
      name: `${project.name} - (Copy)`,
      createdBy: userInfo?.userid || "unknown",
      lastRun: new Date(),
      status: project.status,
      published: false,
      totalRuns: project.totalRuns,
      statusPercent: 0,
      createdAt: new Date(),
    };

    toast({
      title: "Project cloned",
      description: `"${project.name}" has been successfully cloned to "My workspace."`,
    });
    setProjects((prevProjects) => [...prevProjects, clonedProject]);
  };

  /** ========================
   * Derived Data
   ========================= */
  const getProjectRuns = (projectId: string | null) => {
    if (!projectId) return [];
    return runs
      .filter((run) => run.projectId === projectId)
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );
  };

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || null;
  const selectedRun = runs.find((r) => r.id === selectedRunId) || null;
  const selectedInsights =
    selectedRun && selectedProject
      ? generateInsightsForRun(selectedRun, selectedProject)
      : null;
  const currentTitleHeader = "Dashboard";
  /** ========================
   * Empty State
   ========================= */
  if (projects.length === 0) {
    return (
      <div
        className="
          min-h-screen
          bg-gradient-to-br from-blue-50 to-white
        "
      >
        <Header userInfo={userInfo} onLogout={onLogout} alerts={[]} />
        <div
          className="
            flex
            min-h-[80vh]
            items-center justify-center
          "
        >
          <div
            className="
              space-y-6
              text-center
            "
          >
            <div
              className="
                flex
                w-24 h-24
                mx-auto
                bg-purple-100
                rounded-full
                items-center justify-center
              "
            >
              <span
                className="
                  text-4xl
                "
              >
                📋
              </span>
            </div>
            <div>
              <h1
                className="
                  mb-2
                  text-3xl font-bold text-gray-900
                "
              >
                No Projects Yet
              </h1>
              <p
                className="
                  mb-6
                  text-gray-600
                "
              >
                Get started by creating your first data quality project
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleCreateProject}
              className="
                text-white
                bg-purple-600
                hover:bg-purple-700
              "
            >
              <Plus
                className="
                  h-5 w-5
                  mr-2
                "
              />
              Create Your First Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /** ========================
   * Main UI
   ========================= */
  return (
    <div>
      <TitleHeader title={currentTitleHeader} suffix={false} />
      {/* DashBoard Header - Responsive layout and button sizing */}
      <header
        className="
          flex flex-col
          mb-2
          justify-end items-stretch gap-2
          sm:flex-row sm:mb-4 sm:items-center
        "
      >
        <div
          className="
            flex flex-col
            space-y-2
            items-stretch
            sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center
            lg:space-x-4
          "
        >
          {/* Create Project Button - Full width on mobile */}
          <button
            onClick={handleCreateProject}
            className="
              flex
              py-2 px-3
              text-white font-semibold text-xs
              bg-[#0a5bb6]
              rounded-full
              items-center justify-center
              sm:px-4 sm:text-sm
            "
          >
            <Plus
              size={14}
              className="
                mr-1
                sm:mr-2
              "
            />
            <span
              className="
                hidden
                sm:inline
              "
            >
              Create Project
            </span>
            <span
              className="
                sm:hidden
              "
            >
              Create
            </span>
          </button>

          {/* Advanced Filters Button - Responsive sizing */}
          <button
            className="
              flex
              px-3 py-2
              text-xs font-semibold text-black
              bg-white
              rounded-full border border-black
              transition-colors
              items-center justify-center gap-x-1 hover:bg-gray-50
              sm:px-4 sm:text-sm sm:gap-x-2
            "
          >
            <ListFilter
              size={14}
              className="
                sm:mr-0
              "
            />
            <span
              className="
                hidden
                sm:inline
              "
            >
              Advanced Filters
            </span>
            <span
              className="
                sm:hidden
              "
            >
              Filters
            </span>
          </button>
        </div>
      </header>

      {/* Panels - Responsive grid layout for all devices */}
      <main
        className="
          flex flex-col
          w-full min-h-[calc(100vh-200px)]
          gap-2
          sm:gap-4
          xl:flex-row
        "
      >
        {/* Workspace Panel - Full width on mobile, 1/4 on desktop */}
        <div
          className="
            w-full min-w-0
            xl:w-1/4 xl:min-w-[280px]
          "
        >
          <WorkspacePanel
            dqProjects={projects}
            onProjectSelect={handleProjectSelect}
            selectedProjectId={selectedProjectId}
            handleDeleteProject={handleDeleteProject}
            handleCloneProject={handleCloneProject}
          />
        </div>

        {/* Runs Panel - Full width on mobile/tablet, 1/2 on desktop */}
        <div
          className="
            w-full min-w-0
            xl:w-1/2 xl:min-w-[400px]
          "
        >
          <RunsPanel
            runs={getProjectRuns(selectedProjectId)}
            selectedProject={selectedProject}
            selectedRun={selectedRun}
            onExecuteRun={handleRunProject}
            onRunSelect={handleRunSelect}
          />
        </div>

        {/* Insights Panel - Full width on mobile, 1/4 on desktop */}
        <div
          className="
            w-full min-w-0
            xl:w-1/4 xl:min-w-[280px]
          "
        >
          <InsightsPanel
            insights={selectedInsights}
            selectedProject={selectedProject}
            selectedRun={selectedRun}
          />
        </div>
      </main>
    </div>
  );
};

/** ========================
 * Utility & Unused Functions (bottom)
 ========================= */
const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return (
        <CheckCircle
          className="
        h-4 w-4
        text-green-500
      "
        />
      );
    case "failed":
      return (
        <XCircle
          className="
        h-4 w-4
        text-red-500
      "
        />
      );
    case "running":
      return (
        <Clock
          className="
        h-4 w-4
        text-blue-500
      "
        />
      );
    case "paused":
      return (
        <AlertTriangle
          className="
        h-4 w-4
        text-yellow-500
      "
        />
      );
    default:
      return null;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "success":
      return "default";
    case "failed":
      return "destructive";
    case "running":
      return "secondary";
    case "paused":
      return "outline";
    default:
      return "secondary";
  }
};

const handleToggleProjectStatus = (
  id: string,
  projects: DQProject[],
  setProjects: Function,
) => {
  setProjects(
    projects.map((p) =>
      p.id === id
        ? { ...p, status: p.status === "active" ? "In-Active" : "active" }
        : p,
    ),
  );
};

const handleEditProject = (project: DQProject, navigate: Function) => {
  navigate(`/project-configuration/${project.id}`);
};

const handleViewLogs = (projectId: string) => {
  console.log("Viewing logs for project:", projectId);
};
