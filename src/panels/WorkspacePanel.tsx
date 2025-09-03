import { MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { DQProject } from '../lib/types';
import { useState } from 'react';

// It's good practice to define the component's props interface
interface WorkspacePanelProps {
    dqProjects: DQProject[];
}

// Reusable Card Component
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
        {children}
    </div>
);

// Complete WorkspacePanel Component
export const WorkspacePanel = ({ dqProjects = [] }: WorkspacePanelProps) => {
    // State to track if the project list is expanded
    const [isExpanded, setIsExpanded] = useState(false);

    // The number of projects to show before the "More" button appears
    const DISPLAY_LIMIT = 4;

    // Logic to determine which projects to display
    const projectsToShow = isExpanded ? dqProjects : dqProjects.slice(0, DISPLAY_LIMIT);

    return (
        <div className="w-1/4 max-w-sm p-4 flex flex-col space-y-4">
            {/* Toggle Workspace */}
            <div className="flex items-center rounded-full border border-black bg-white px-2 py-1 text-sm font-semibold text-black">
                <button className="bg-[#0a5bb6] text-white py-3 px-4 rounded-full text-sm font-semibold w-1/2">Team's Workspace</button>
                <button className="text-gray-400 py-2 px-4 rounded-lg text-sm font-semibold w-1/2 hover:bg-white">My Workspace</button>
            </div>

            {/* Mapped list of projects to be displayed */}
            {projectsToShow.map((project, index) => (
                <Card
                    key={index}
                    className="space-y-3 active:bg-[#cfe6ff] cursor-pointer overflow-hidden"
                >
                    {/* Top section: Project title + creator info + status + menu button */}
                    <div className="flex justify-between items-start">
                        {/* Project Name & Creator */}
                        <div>
                            <h4 className="text-black font-bold">{project.name}</h4>
                            <p className="text-xs text-gray-400">
                                Created by: {project.createdBy}
                            </p>
                        </div>

                        {/* Project Status Badge + Menu Button */}
                        <div className="flex items-center space-x-2">
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${project.status === 'active'
                                        ? 'bg-[#0d8b09] text-white'  // Active → green badge
                                        : 'bg-[#b3a100] text-white' // Otherwise → yellow badge
                                    }`}
                            >
                                {project.status}
                            </span>
                            <button className="text-gray-400 hover:text-black p-1 rounded-fullx">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Bottom section: Project stats (runs, status %, last run) */}
                    <div className="flex justify-between text-xs text-gray-300">
                        <div>
                            <p className="text-gray-500">Total:</p>
                            <p className="font-semibold">{project.totalRuns} runs</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Status:</p>
                            <p className="font-semibold">{project.statusPercent}%</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Last Run:</p>
                            <p className="font-semibold">{project.lastRun}</p>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Conditionally render the "More" / "Less" button */}
            {dqProjects.length > DISPLAY_LIMIT && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full text-center text-gray-400 hover:text-white py-2 rounded-lg bg-white text-sm flex items-center justify-center"
                >
                    {isExpanded ? 'Less' : 'More'}
                    {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                </button>
            )}
        </div>
    );
};