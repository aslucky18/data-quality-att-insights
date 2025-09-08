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
    <div className="w-full h-full bg-white p-2 sm:p-4 lg:p-6 rounded-2xl flex flex-col space-y-2 sm:space-y-4 overflow-y-auto">
        {/* Header - Responsive layout and typography */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 gap-2">
            <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-black">Insights</h2>
                {selectedProject && selectedRun && (
                    <p className="text-xs text-gray-500 truncate">
                        {selectedProject.name} - {selectedRun.runName}
                    </p>
                )}
            </div>
            {/* Expand button - Responsive sizing */}
            <button className="p-1.5 sm:p-2 bg-white rounded-lg text-black hover:bg-gray-100 transition-colors">
                <Expand size={16} className="sm:hidden" />
                <Expand size={20} className="hidden sm:block" />
            </button>
        </div>

        {!insights ? renderEmptyState() : (
            <>
                {/* Data Overview - Responsive card layout */}
                <Card className='border border-gray-300'>
                    <CardHeader title="Data Overview" />
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 truncate pr-2">Number of columns</span> 
                            <span className="text-black font-semibold flex-shrink-0">{insights.dataOverview.columns}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 truncate pr-2">Number of rows</span> 
                            <span className="text-black font-semibold flex-shrink-0">{insights.dataOverview.rows.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 truncate pr-2">Number of integer columns</span> 
                            <span className="text-black font-semibold flex-shrink-0">{insights.dataOverview.integerColumns}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 truncate pr-2">Number of boolean columns</span> 
                            <span className="text-black font-semibold flex-shrink-0">{insights.dataOverview.booleanColumns}</span>
                        </div>
                    </div>
                </Card>

                {/* Data Type Distribution - Responsive chart and legend */}
                <Card className='border border-gray-300'>
                    <CardHeader title="Data Type Distribution" />
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
                        {/* Chart - Responsive sizing */}
                        <div className="w-full sm:w-1/2" style={{ height: window.innerWidth < 640 ? 100 : 120 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie 
                                        data={insights.dataTypeDistribution} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={window.innerWidth < 640 ? 20 : 30} 
                                        outerRadius={window.innerWidth < 640 ? 40 : 50} 
                                        fill="#8884d8" 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        {insights.dataTypeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: "white", border: '1px solid #1A3A53', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend - Responsive layout and sizing */}
                        <div className="w-full sm:w-1/2 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                            {insights.dataTypeDistribution.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-gray-400 truncate">{entry.name}</span>
                                    </div>
                                    <span className="text-black font-semibold flex-shrink-0 ml-2">{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Anomalies - Responsive chart */}
                <Card className='border border-gray-300'>
                    <CardHeader title="Anomalies" />
                    <p className="text-xs text-gray-400 mb-1 sm:mb-2">Anomaly Score Distribution</p>
                    {/* Chart Container - Responsive height */}
                    <div style={{ width: '100%', height: window.innerWidth < 640 ? 120 : 150 }}>
                        <ResponsiveContainer>
                            <BarChart data={insights.anomalies} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#6B7280" 
                                    fontSize={window.innerWidth < 640 ? 8 : 10} 
                                    axisLine={false} 
                                    tickLine={false} 
                                />
                                <YAxis 
                                    stroke="#6B7280" 
                                    fontSize={window.innerWidth < 640 ? 8 : 10} 
                                    axisLine={false} 
                                    tickLine={false} 
                                />
                                <Tooltip 
                                    cursor={{ fill: '#1A3A53' }} 
                                    contentStyle={{ 
                                        backgroundColor: "white", 
                                        border: '1px solid #1A3A53',
                                        fontSize: '11px'
                                    }} 
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#38BDF8" 
                                    barSize={window.innerWidth < 640 ? 15 : 20} 
                                    radius={[4, 4, 0, 0]} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-1 sm:mt-2">
                        <button className="text-blue-400 text-xs font-semibold hover:underline">Expand View</button>
                    </div>
                </Card>
            </>
        )}
    </div>
  );
};