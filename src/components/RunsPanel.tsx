import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {  Search, Plus, List, ChevronDown, ChevronRight } from 'lucide-react';


const recentRuns = [
  { id: '#A103', startTime: '12 Aug 2025  10:18:01 AM', endTime: '13 Aug 2025  11:13:02 AM', status: 'Error', alerts: '2/3' },
  { id: '#A102', startTime: '11 Aug 2025  10:18:23 AM', endTime: '12 Aug 2025  09:12:45 AM', status: 'Error', alerts: '1/3' },
  { id: '#A101', startTime: '10 Aug 2025  10:18:23 AM', endTime: '11 Aug 2025  09:12:45 AM', status: 'Complete', alerts: '3/3' },
  { id: '#A100', startTime: '09 Aug 2025  08:13:26 AM', endTime: '09 Aug 2025  07:15:35 AM', status: 'Complete', alerts: '2/3' },
];

const dataQualityData = [
    { name: 'A101', 'Data Quality %': 20 },
    { name: 'A102', 'Data Quality %': 55 },
    { name: 'A103', 'Data Quality %': 40 },
    { name: 'A104', 'Data Quality %': 78 },
    { name: 'A105', 'Data Quality %': 60 },
    { name: 'A106', 'Data Quality %': 95 },
    { name: 'A107', 'Data Quality %': 70 },
];

// Reusable Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#0F2C3F] rounded-xl p-4 ${className}`}>
    {children}
  </div>
);


export const RunsPanel = () => (
    <div className="flex-1 bg-[#0A2232] p-6 rounded-2xl flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Runs</h2>
            <div className="flex items-center space-x-2">
                <button className="bg-white hover:bg-blue-700 text-black font-semibold py-2 px-4 rounded-lg flex items-center">
                    <Plus size={16} className="mr-2"/> Execute Run
                </button>
                <button className="p-2 bg-[#0F2C3F] rounded-lg text-gray-400 hover:text-white"><Search size={20}/></button>
                <button className="p-2 bg-[#0F2C3F] rounded-lg text-gray-400 hover:text-white"><List size={20}/></button>
            </div>
        </div>

        {/* Most Recent Runs */}
        <Card className="flex-1">
            <h3 className="text-white font-semibold mb-4">Most Recent Runs</h3>
            <div className="space-y-2">
                {recentRuns.map(run => (
                    <div key={run.id} className="grid grid-cols-12 items-center text-sm p-2 rounded-lg hover:bg-[#1A3A53]">
                        <div className="col-span-1 font-bold text-white">{run.id}</div>
                        <div className="col-span-4 text-gray-400">
                            <p>Start Time: <span className="text-gray-300">{run.startTime}</span></p>
                            <p>End Time: <span className="text-gray-300">{run.endTime}</span></p>
                        </div>
                        <div className="col-span-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${run.status === 'Complete' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                Status: {run.status}
                            </span>
                        </div>
                        <div className="col-span-2 text-gray-300 flex items-center">
                           <ChevronRight size={16} className="text-gray-500 mr-1"/> View Alerts
                        </div>
                        <div className="col-span-1">
                            <span className={`px-3 py-1 text-xs font-bold rounded ${run.alerts === '3/3' || run.alerts === '2/3' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {run.alerts}
                            </span>
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <button className="bg-[#1A3A53] hover:bg-blue-600 text-white text-xs font-semibold py-2 px-4 rounded-lg">View</button>
                        </div>
                    </div>
                ))}
            </div>
             <div className="text-center mt-4">
                <button className="text-blue-400 text-sm font-semibold hover:underline">More <ChevronDown size={16} className="inline"/></button>
            </div>
        </Card>

        {/* 7 Last Runs Chart */}
        <Card>
            <h3 className="text-white font-semibold mb-4">7 Last Runs - Data Quality %</h3>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <LineChart data={dataQualityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A3A53" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: '#0F2C3F', border: '1px solid #1A3A53' }} />
                        <Legend />
                        <Line type="monotone" dataKey="Data Quality %" stroke="#38BDF8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    </div>
);
