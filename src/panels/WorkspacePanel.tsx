import { MoreVertical, ChevronDown, ChevronUp, Copy, Pencil, Upload, Trash } from 'lucide-react';
import { DQProject } from '../lib/types';
import { useState, useEffect } from 'react';

// Define the props for the WorkspacePanel component
interface WorkspacePanelProps {
    dqProjects: DQProject[];
    onProjectSelect: (projectId: string | null) => void;
    selectedProjectId: string | null;
    handleDeleteProject: (projectId: string) => void;
    handleCloneProject: (project: DQProject) => void;
}

// Reusable Card component for project display
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
        style={{ overflow: 'visible', position: 'relative' }}
    >
        {children}
    </div>
);

export const WorkspacePanel = ({
    dqProjects = [],
    onProjectSelect,
    selectedProjectId,
    handleDeleteProject,
    handleCloneProject,
}: WorkspacePanelProps) => {
    // State variables
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeWorkspace, setActiveWorkspace] = useState<'team' | 'myworkspace'>('team');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Constant for the number of projects to display initially
    const DISPLAY_LIMIT = 3;

    // Effect to handle clicks outside the menu to close it
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            // Check if the click is outside any open menu
            if (openMenuId && !document.getElementById(`menu-${openMenuId}`)?.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        if (openMenuId) {
            window.addEventListener('click', handleOutsideClick);
        }

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [openMenuId]);

    // Filter and sort projects based on the active workspace and creation date
    const filteredProjects = dqProjects.filter(
        (project) => (project.published ? 'team' : 'myworkspace') === activeWorkspace
    );
    const sortedProjects = [...filteredProjects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Determine which projects to show based on the 'isExpanded' state
    const projectsToShow = isExpanded
        ? sortedProjects
        : sortedProjects.slice(0, DISPLAY_LIMIT);

    // Handle menu button click to toggle the dropdown menu
    const handleMenuClick = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation(); // Prevent the card's onClick from firing
        setOpenMenuId(openMenuId === projectId ? null : projectId);
    };

    // --- Unused or Incomplete Functions ---
    // These functions are defined but not fully implemented with business logic
    // and are marked for future development or refactoring.
    const handlePublishProject = (projectId: string) => {
        console.log(`Publishing project with ID: ${projectId}`);
        // TODO: Add logic to publish the project, e.g., an API call.
        // Close the menu after the action.
        setOpenMenuId(null);
    };

    const handleEditProject = (projectId: string) => {
        console.log(`Editing project with ID: ${projectId}`);
        // TODO: Add logic to navigate to an edit page or open a modal.
        // Close the menu after the action.
        setOpenMenuId(null);
    };

    // --- Component JSX ---
    return (
        <div className="w-full h-full p-4 flex flex-col space-y-4">
            {/* Workspace Toggle Buttons */}
            <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 text-sm font-semibold">
                <button
                    onClick={() => {
                        setActiveWorkspace('team');
                        onProjectSelect(null); // Reset selection when switching workspaces
                    }}
                    className={`w-1/2 rounded-full py-2 px-4 transition-colors duration-300 ${activeWorkspace === 'team'
                        ? 'bg-[#0a5bb6] text-white'
                        : 'text-[#0a5bb6] hover:bg-gray-100'
                        }`}
                >
                    Team's Workspace
                </button>
                <button
                    onClick={() => {
                        setActiveWorkspace('myworkspace');
                        onProjectSelect(null); // Reset selection
                    }}
                    className={`w-1/2 rounded-full py-2 px-4 transition-colors duration-300 ${activeWorkspace === 'myworkspace'
                        ? 'bg-[#0a5bb6] text-white'
                        : 'text-[#0a5bb6] hover:bg-gray-100'
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
                        <div className="flex items-center space-x-2 relative" id={`menu-${project.id}`}>
                            {/* Project Status Badge */}
                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${project.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Unknown'}
                            </span>

                            {/* Menu Button */}
                            <button
                                onClick={(e) => handleMenuClick(e, project.id)}
                                className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-200"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Menu based on project's published status */}
                            {openMenuId === project.id && (
                                <div
                                    className="absolute top-full right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="max-h-40 overflow-y-auto">
                                        <ul className="py-1 text-sm text-gray-700">
                                            {/* Edit Option */}
                                            <li>
                                                <a
                                                    href="#"
                                                    className="flex items-center justify-left px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => handleEditProject(project.id)}
                                                >
                                                    <Pencil size={16} className="text-gray-400 mr-2" />
                                                    Edit
                                                </a>
                                            </li>
                                            {/* Clone Option */}
                                            <li>
                                                <a
                                                    href="#"
                                                    className="flex items-center justify-left px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => { handleCloneProject(project); setOpenMenuId(null); }}
                                                >
                                                    <Copy size={16} className="text-gray-400 mr-2" />
                                                    Clone
                                                </a>
                                            </li>
                                            {/* Publish Option (only for 'My Workspace') */}
                                            {!project.published && (
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="flex items-center justify-left px-4 py-2 hover:bg-gray-100"
                                                        onClick={() => handlePublishProject(project.id)}
                                                    >
                                                        <Upload size={16} className="text-gray-400 mr-2" />
                                                        Publish
                                                    </a>
                                                </li>
                                            )}
                                            {/* Delete Option (only for 'My Workspace') */}
                                            {!project.published && (
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="flex items-center justify-left px-4 py-2 hover:bg-gray-100"
                                                        onClick={() => handleDeleteProject(project.id)}
                                                    >
                                                        <Trash size={16} className="text-gray-400 mr-2" />
                                                        Delete
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Footer with project stats */}
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
                            <p className="font-semibold text-black">{new Date(project.lastRun).toLocaleDateString("en-GB")}</p>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Show More / Show Less Button */}
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