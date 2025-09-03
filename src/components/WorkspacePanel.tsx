import { MoreVertical, ChevronDown } from 'lucide-react';
import { DQProject } from '../lib/types';
// import { useState } from 'react'; // Removed unused import

// It's good practice to define the component's props interface

const hoverColorDQProject = "#cfe6ff";
const activeColorDQProject = "#0d8b09";

interface WorkspacePanelProps {
    // Renamed prop to follow camelCase convention (dqProjects instead of DQProjects)
    dqProjects: DQProject[];
}

// Reusable Card Component (No changes needed here, it's well-written)
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
        {children}
    </div>
);

// Corrected WorkspacePanel Component
export const WorkspacePanel = ({ dqProjects = [] }: WorkspacePanelProps) => (
    // Note: The destructuring is done directly in the function arguments.
    // We also provide a default empty array `[]` to prevent errors if the prop is not passed.
    <div className="w-1/4 max-w-sm  p-4  flex flex-col space-y-4">
        {/* Toggle Workspace */}
        <div className="flex items-center rounded-full border border-black bg-white px-2 py-1 text-sm font-semibold text-black">
            <button className="bg-[#0a5bb6] text-white py-3 px-4 rounded-full text-sm font-semibold w-1/2">Team's Workspace</button>
            <button className="text-gray-400 py-2 px-4 rounded-lg text-sm font-semibold w-1/2 hover:bg-white">My Workspace</button>
        </div>

        {/* Mapped directly over the correctly-named and destructured `dqProjects` prop */}
        {dqProjects.map((project, index) => (
            // Card component for displaying project details
            <Card
                key={index}
                className="space-y-3 active:bg-[#cfe6ff] cursor-pointer"
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
                        {/* Conditional styling for status */}
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${project.status === 'active'
                                    ? 'bg-[#0d8b09] text-white'  // Active → green badge
                                    : 'bg-[#b3a100] text-white' // Otherwise → yellow badge
                                }`}
                        >
                            {project.status} {/* e.g., active/inactive */}
                        </span>

                        {/* "More" icon button (3 dots menu) */}
                        <button className="text-gray-400 hover:text-white">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Bottom section: Project stats (runs, status %, last run) */}
                <div className="flex justify-between text-xs text-gray-300">

                    {/* Total Runs */}
                    <div>
                        <p className="text-gray-500">Total:</p>
                        <p className="font-semibold">{project.totalRuns} runs</p>
                    </div>

                    {/* Status Percentage */}
                    <div>
                        <p className="text-gray-500">Status:</p>
                        <p className="font-semibold">{project.statusPercent}%</p>
                    </div>

                    {/* Last Run Timestamp */}
                    <div>
                        <p className="text-gray-500">Last Run:</p>
                        <p className="font-semibold">{project.lastRun}</p>
                    </div>
                </div>
            </Card>

        ))}

        <div className="flex-grow"></div>
        <button className="w-full text-center text-gray-400 hover:text-white py-2 rounded-lg bg-white text-sm flex items-center justify-center">
            More <ChevronDown size={16} className="ml-1" />
        </button>
    </div>
);