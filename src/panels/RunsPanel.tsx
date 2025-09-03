import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Plus, Search, List, Bell, ChevronDown } from 'lucide-react';

// --- Data based on the image ---
const recentRunsData = [
  { 
    id: '#A103', 
    startTime: '12 Aug 2025  10:18:02 AM', 
    endTime: '11 Aug 2025  11:12:02 AM', // Note: The end time is before start time in the image, replicated here.
    status: 'Error', 
    alerts: '2/3',
    isSelected: true 
  },
  { 
    id: '#A102', 
    startTime: '11 Aug 2025  10:18:23 AM', 
    endTime: '10 Aug 2025  09:12:45 AM', 
    status: 'Error', 
    alerts: '1/3',
    isSelected: false 
  },
  { 
    id: '#A101', 
    startTime: '10 Aug 2025  10:18:23 AM', 
    endTime: '09 Aug 2025  09:12:45 AM', 
    status: 'Complete', 
    alerts: '3/3',
    isSelected: false 
  },
  { 
    id: '#A100', 
    startTime: '09 Aug 2025  08:13:25 AM', 
    endTime: '08 Aug 2025  07:15:35 AM', 
    status: 'Complete', 
    alerts: '3/3',
    isSelected: false 
  },
];

const chartData = [
  { name: 'A091', dataQuality: 65 },
  { name: 'A092', dataQuality: 72 },
  { name: 'A093', dataQuality: 68 },
  { name: 'A094', dataQuality: 80 },
  { name: 'A095', dataQuality: 75 },
  { name: 'A096', dataQuality: 85 },
  { name: 'A097', dataQuality: 78 },
];

// --- Helper component for individual run items ---
const RunItem = ({ run }) => {
  // Helper function to get conditional styling for alert badges
  const getAlertClasses = (alerts) => {
    switch (alerts) {
      case '1/3': return 'bg-red-100 text-red-700';
      case '2/3': return 'bg-yellow-100 text-yellow-700';
      case '3/3': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const selectedClasses = run.isSelected 
    ? 'bg-blue-50 border-blue-200' 
    : 'bg-white border-transparent';

  return (
    <div className={`flex items-center p-3 rounded-lg border ${selectedClasses} space-x-4`}>
      <div className="flex-1 font-semibold text-gray-800">Run {run.id}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">Start Time: {run.startTime}</p>
        <p className="text-xs text-gray-500">End Time: {run.endTime}</p>
      </div>
      <div className="flex-1 text-sm text-gray-600">Status: {run.status}</div>
      <div className="flex-1 flex items-center text-sm text-gray-600">
        <Bell size={16} className="mr-2 text-gray-400" /> View Alerts
      </div>
      <div className="flex items-center space-x-4">
         <span className={`px-4 py-1 text-xs font-bold rounded-full ${getAlertClasses(run.alerts)}`}>
          {run.alerts}
        </span>
        <button className="bg-white border border-gray-300 rounded-md px-5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          View
        </button>
      </div>
    </div>
  );
};


// --- Run Dashboard Component ---
interface RunsPanelProps {
  runs?: any[];
  selectedProject?: any;
}

export const RunsPanel = ({ runs = [], selectedProject }: RunsPanelProps) => {
  return (
    <div className="bg-white min-h-screen rounded-xl pl-6 pt-6 font-sans">
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
            <button className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} className="mr-2" />
              Execute Run
            </button>
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
            {runs.length > 0 ? (
              runs.map(run => (
                <div key={run.id} className="flex items-center p-3 rounded-lg border bg-white border-transparent space-x-4">
                  <div className="flex-1 font-semibold text-gray-800">Run {run.runId}</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Start Time: {run.startTime}</p>
                    <p className="text-xs text-gray-500">Duration: {run.duration}</p>
                  </div>
                  <div className="flex-1 text-sm text-gray-600">Status: {run.status}</div>
                  <div className="flex-1 flex items-center text-sm text-gray-600">
                    <Bell size={16} className="mr-2 text-gray-400" /> View Alerts
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-1 text-xs font-bold rounded-full ${
                      run.status === 'success' ? 'bg-green-100 text-green-700' :
                      run.status === 'failed' ? 'bg-red-100 text-red-700' :
                      run.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {run.status}
                    </span>
                    <button className="bg-white border border-gray-300 rounded-md px-5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {selectedProject ? 'No runs found for this project' : 'Select a project to view its runs'}
              </div>
            )}
          </div>
          {runs.length > 5 && (
            <div className="text-center mt-4">
              <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                More <ChevronDown size={16} className="inline-block" />
              </button>
            </div>
          )}
        </section>

        {/* 7 Last Runs Chart */}
        <section className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">7 Last Runs</h2>
          <p className="text-sm text-gray-500 mb-4">Last 7 Runs – Data Quality %</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                {/* Defines the gradient fill for the Area */}
                <defs>
                  <linearGradient id="colorDataQuality" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
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
                  {/* Adds the percentage label on top of each data point */}
                  <LabelList dataKey="dataQuality" position="top" formatter={(value) => `${value}%`} fontSize={12} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>
    </div>
  );
};