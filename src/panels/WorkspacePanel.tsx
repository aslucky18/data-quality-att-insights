import { MoreVertical, ChevronDown, ChevronUp, Copy, Pencil } from 'lucide-react';
import { DQProject } from '../lib/types';
import { useState, useEffect } from 'react';

interface WorkspacePanelProps {
    dqProjects: DQProject[];
    onProjectSelect: (projectId: string) => void;
    selectedProjectId: string | null;
}

// ✅ Updated Card component to ensure menu is not clipped
const Card = ({
    children,
    className = '',
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => (
    <div
        className={`bg-white rounded-xl p-4 ${className}`}
        onClick={onClick}
        style={{ overflow: 'visible', position: 'relative' }} // Important for menu visibility
    >
        {children}
    </div>
);

export const WorkspacePanel = ({
    dqProjects = [],
    onProjectSelect,
    selectedProjectId,
}: WorkspacePanelProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeWorkspace, setActiveWorkspace] = useState<'team' | 'myworkspace'>('team');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const DISPLAY_LIMIT = 3;

    useEffect(() => {
        const handleOutsideClick = () => {
            setOpenMenuId(null);
        };
        if (openMenuId) {
            window.addEventListener('click', handleOutsideClick);
        }
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [openMenuId]);

    const filteredProjects = dqProjects.filter(
        (project) => (project.published ? 'team' : 'myworkspace') === activeWorkspace
    );

    const projectsToShow = isExpanded
        ? filteredProjects
        : filteredProjects.slice(0, DISPLAY_LIMIT);

    const handleMenuClick = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === projectId ? null : projectId);
    };

    return (
        <div className="w-full h-full p-4 flex flex-col space-y-4">
            {/* Workspace Toggle */}
            <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 text-sm font-semibold">
                <button
                    onClick={() => setActiveWorkspace('team')}
                    className={`w-1/2 rounded-full py-2 px-4 transition-colors duration-300 ${activeWorkspace === 'team'
                            ? 'bg-[#0a5bb6] text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    Team's Workspace
                </button>
                <button
                    onClick={() => setActiveWorkspace('myworkspace')}
                    className={`w-1/2 rounded-full py-2 px-4 transition-colors duration-300 ${activeWorkspace === 'myworkspace'
                            ? 'bg-[#0a5bb6] text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    My Workspace
                </button>
            </div>

            {/* Project Cards */}
            {projectsToShow.map((project) => (
                <Card
                    key={project.id}
                    className={`space-y-3 cursor-pointer transition-all duration-300 border-2 ${selectedProjectId === project.id
                            ? 'bg-[#cfe6ff] border-[#0a5bb6]'
                            : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                        }`}
                    onClick={() => onProjectSelect(project.id)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-black font-bold">{project.name}</h4>
                            <p className="text-xs text-gray-500">
                                Created by: {project.createdBy}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 relative">
                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${project.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>

                            {/* Menu Button */}
                            <button
                                onClick={(e) => handleMenuClick(e, project.id)}
                                className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-200"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === project.id && (
                                <div
                                    className="absolute top-full right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="max-h-40 overflow-y-auto">
                                        <ul className="py-1 text-sm text-gray-700">
                                            <li>
                                                <a
                                                    href="#"
                                                    className="flex items-center justify-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    <Pencil size={16} className="text-gray-400 mr-2" />
                                                    Edit
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="flex items-center justify-left   px-4 py-2 hover:bg-gray-100"
                                                >
                                                    <Copy size={16} className="text-gray-400  mr-2" />
                                                    Clone
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex justify-between text-xs text-gray-400 pt-2">
                        <div className="text-center">
                            <p className="text-gray-500">Total:</p>
                            <p className="font-semibold text-black">{project.totalRuns} runs</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500">Status:</p>
                            <p className="font-semibold text-black">{project.statusPercent}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500">Last Run:</p>
                            <p className="font-semibold text-black">{project.lastRun}</p>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Show More / Show Less */}
            {filteredProjects.length > DISPLAY_LIMIT && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full text-center text-gray-500 hover:text-black py-2 rounded-lg bg-white text-sm flex items-center justify-center font-semibold hover:bg-gray-100"
                >
                    {isExpanded ? 'Show Less' : 'Show More'}
                    {isExpanded ? (
                        <ChevronUp size={16} className="ml-1" />
                    ) : (
                        <ChevronDown size={16} className="ml-1" />
                    )}
                </button>
            )}
        </div>
    );
};
