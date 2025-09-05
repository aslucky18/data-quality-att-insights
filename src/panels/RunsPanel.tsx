import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Plus, Search, List, Bell, ChevronDown, Loader2 } from 'lucide-react';
import { DQRun } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// --- 1. Define Clear TypeScript Interfaces ---
interface ChartDataPoint {
  name: string;
  dataQuality: number;
}

interface Project {
  id: string;
  name: string;
}

interface RunItemProps {
  run: DQRun;
  onRunSelect: (run: DQRun) => void;
  isSelected: boolean;
}

// --- Helper component for individual run items ---
const RunItem = ({ run, onRunSelect, isSelected }: RunItemProps) => {
  const getAlertClasses = (alerts: DQRun['alerts']) => {
    switch (alerts) {
      case '1/3': return 'bg-red-100 text-red-700';
      case '2/3': return 'bg-yellow-100 text-yellow-700';
      case '3/3': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const selectedClasses = isSelected
    ? 'bg-blue-50 border-blue-200'
    : 'bg-white border-transparent hover:bg-gray-50';

  return (
    <div 
      className={`flex items-center p-3 rounded-lg border ${selectedClasses} space-x-4 transition-colors cursor-pointer`}
      
    >
      <div className="flex-1 font-semibold text-gray-800">Run {run.id}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">Start: {run.startTime}</p>
        <p className="text-xs text-gray-500">Duration: {run.duration}</p>
      </div>
      <div className="flex-1 text-sm text-gray-600">Status: {run.status}</div>
      <div className="flex-1 flex items-center text-sm text-gray-600 cursor-pointer">
        <Bell size={16} className="mr-2 text-gray-400" /> View Alerts
      </div>
      <div className="flex items-center space-x-4">
        <span className={`px-4 py-1 text-xs font-bold rounded-full ${getAlertClasses(run.alerts)}`}>
          {run.alerts}
        </span>
        <button onClick={() => onRunSelect(run)} className="bg-white border border-gray-300 rounded-md px-5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          View
        </button>
      </div>
    </div>
  );
};

// --- Props for the main dashboard component ---
interface RunsPanelProps {
  runs?: DQRun[];
  selectedProject?: Project;
  selectedRun?: DQRun | null;
  onExecuteRun?: (projectId: string) => void;
  onRunSelect?: (run: DQRun) => void;
}

// --- Refactored Run Dashboard Component ---
export const RunsPanel = ({ runs = [], selectedProject, selectedRun, onExecuteRun, onRunSelect }: RunsPanelProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAllRuns, setShowAllRuns] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const displayedRuns = showAllRuns ? runs : runs.slice(0, 3);
  const hasMoreRuns = runs.length > 3;

  const handleExecuteClick = () => {
    if (!selectedProject) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmExecution = async () => {
    if (!selectedProject || !onExecuteRun) return;

    setShowConfirmDialog(false);
    setIsExecuting(true);

    // Simulate execution time (10-15 seconds)
    const executionTime = Math.floor(Math.random() * 6000) + 10000; // 10-15 seconds

    setTimeout(() => {
      onExecuteRun(selectedProject.id);
      setIsExecuting(false);
    }, executionTime);
  };

  // --- Generate Random Data for the Chart ---
  const generateRandomChartData = (): ChartDataPoint[] => {
    const data = [];
    for (let i = 0; i < (runs.length <= 7 ? runs.length : 7); i++) {
      const randomQuality = Math.floor(Math.random() * (90 - 60 + 1)) + 60; // Random quality between 60% and 90%
      data.push({ name: `Run ${i + 1}`, dataQuality: randomQuality });
    }
    return data;
  };

  // --- Effect to generate new chart data when project changes ---
  useEffect(() => {
    if (selectedProject) {
      const newChartData = generateRandomChartData();
      setChartData(newChartData);
    }
  }, [selectedProject]);

  return (
    <div className="bg-white w-full h-full rounded-xl p-6 font-sans overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Runs</h1>
            {selectedProject && (
              <p className="text-sm text-gray-600">Project: {selectedProject.name}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExecuteClick}
              disabled={!selectedProject || isExecuting}
              className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Plus size={20} className="mr-2" />
                  Execute Run
                </>
              )}
            </Button>
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
              <List size={20} />
            </button>
          </div>
        </header>

        {/* Most Recent Runs List */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {selectedProject ? `Runs for ${selectedProject.name}` : 'Most Recent Runs'}
          </h2>
          <div className="space-y-2">
            {displayedRuns.length > 0 ? (
              displayedRuns.map(run => (
                <RunItem 
                  key={run.id} 
                  run={run} 
                  onRunSelect={onRunSelect || (() => {})}
                  isSelected={selectedRun?.id === run.id}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {selectedProject ? 'No runs found for this project.' : 'Select a project to view its runs.'}
              </div>
            )}
          </div>
          {hasMoreRuns && !showAllRuns && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllRuns(true)}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                More ({runs.length - 3} more runs) <ChevronDown size={16} className="inline-block" />
              </button>
            </div>
          )}
          {showAllRuns && hasMoreRuns && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllRuns(false)}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Show Less <ChevronDown size={16} className="inline-block rotate-180" />
              </button>
            </div>
          )}
        </section>

        {/* Recent Run Trends */}
        <section className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Recent Run Trends</h2>
          <p className="text-sm text-gray-500 mb-4">
            Data Quality % Over Latest {runs.length >= 7 ? 7 : runs.length} Executions (Recent Runs)
          </p>
          <div style={{ width: '100%', height: 300 }}>
            {runs.length <= 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available to display the chart.
              </div>
            ) : (
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDataQuality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a0a0a0" tickLine={false} axisLine={false} />
                  <YAxis unit="%" tick={{ fontSize: 12 }} stroke="#a0a0a0" tickLine={false} axisLine={false} domain={[60, 90]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Area type="monotone" dataKey="dataQuality" stroke="#5a52d1" strokeWidth={2} fillOpacity={1} fill="url(#colorDataQuality)">
                    <LabelList dataKey="dataQuality" position="top" formatter={(value) => `${value}%`} fontSize={12} />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogDescription>
              Are you sure you want to <b> execute </b>the run  ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className='rounded-full'
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmExecution}
              className="bg-green-600 rounded-full hover:bg-blue-700"
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
