const WorkspacePanel = () => (
  <div className="w-1/4 max-w-sm bg-[#0A2232] p-4 rounded-2xl flex flex-col space-y-4">
    <div className="flex space-x-2">
      <button className="bg-[#0F2C3F] text-white py-2 px-4 rounded-lg text-sm font-semibold w-1/2">My Workspace</button>
      <button className="text-gray-400 py-2 px-4 rounded-lg text-sm font-semibold w-1/2 hover:bg-[#0F2C3F]">Team's Workspace</button>
    </div>
    
    {projects.map((project, index) => (
      <Card key={index} className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-white font-bold">{project.name}</h4>
            <p className="text-xs text-gray-400">Created by: {project.createdBy}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {project.status}
            </span>
            <button className="text-gray-400 hover:text-white"><MoreVertical size={18} /></button>
          </div>
        </div>
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

    <div className="flex-grow"></div>
    <button className="w-full text-center text-gray-400 hover:text-white py-2 rounded-lg bg-[#0F2C3F] text-sm flex items-center justify-center">
      More <ChevronDown size={16} className="ml-1"/>
    </button>
  </div>
);