import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { MoreVertical, Expand } from 'lucide-react';
import { DQInsights, DQProject, DQRun } from '@/lib/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Reusable Components
const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ title }) => (
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-black font-semibold">{title}</h3>
        <button className="text-gray-400 hover:text-black">
            <MoreVertical size={20} />
        </button>
    </div>
);

interface InsightsPanelProps {
  insights: DQInsights | null;
  selectedProject: DQProject | null;
  selectedRun: DQRun | null;
}

export const InsightsPanel = ({ insights, selectedProject, selectedRun }: InsightsPanelProps) => {
  // Generate empty state content
  const renderEmptyState = () => (
    <div className="text-center py-8 text-gray-500">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📊</span>
      </div>
      <p className="text-sm">
        {!selectedProject 
          ? 'Select a project to view insights' 
          : !selectedRun 
          ? 'Select a run to view insights'
          : 'No insights available for this run'}
      </p>
    </div>
  );

  return (
    <div className="w-full h-full bg-white p-6 rounded-2xl flex flex-col space-y-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
            <div>
                <h2 className="text-xl font-bold text-black">Insights</h2>
                {selectedProject && selectedRun && (
                    <p className="text-xs text-gray-500">
                        {selectedProject.name} - {selectedRun.runName}
                    </p>
                )}
            </div>
            <button className="p-2 bg-white rounded-lg text-black">
                <Expand size={20} />
            </button>
        </div>

        {!insights ? renderEmptyState() : (
            <>
                {/* Data Overview */}
                <Card className='border border-gray-300'>
                    <CardHeader title="Data Overview" />
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Number of columns</span> 
                            <span className="text-black font-semibold">{insights.dataOverview.columns}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Number of rows</span> 
                            <span className="text-black font-semibold">{insights.dataOverview.rows.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Number of integer columns</span> 
                            <span className="text-black font-semibold">{insights.dataOverview.integerColumns}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Number of boolean columns</span> 
                            <span className="text-black font-semibold">{insights.dataOverview.booleanColumns}</span>
                        </div>
                    </div>
                </Card>

                {/* Data Type Distribution */}
                <Card className='border border-gray-300'>
                    <CardHeader title="Data Type Distribution" />
                    <div className="flex items-center">
                        <div style={{ width: '50%', height: 120 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={insights.dataTypeDistribution} cx="50%" cy="50%" innerRadius={30} outerRadius={50} fill="#8884d8" paddingAngle={5} dataKey="value">
                                        {insights.dataTypeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: "white", border: '1px solid #1A3A53' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-2 text-sm">
                            {insights.dataTypeDistribution.map((entry, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-gray-400">{entry.name}</span>
                                    <span className="ml-auto text-black font-semibold">{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Anomalies */}
                <Card className='border border-gray-300'>
                    <CardHeader title="Anomalies" />
                    <p className="text-xs text-gray-400 mb-2">Anomaly Score Distribution</p>
                    <div style={{ width: '100%', height: 150 }}>
                        <ResponsiveContainer>
                            <BarChart data={insights.anomalies} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#6B7280" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#1A3A53' }} contentStyle={{ backgroundColor: "white", border: '1px solid #1A3A53' }} />
                                <Bar dataKey="value" fill="#38BDF8" barSize={20} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-2">
                        <button className="text-blue-400 text-xs font-semibold hover:underline">Expand View</button>
                    </div>
                </Card>
            </>
        )}
    </div>
  );
};