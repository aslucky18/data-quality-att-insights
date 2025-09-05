// filepath: c:\Users\pemmani.anjaneyulu\Documents\GitHub\data-quality-att-insights\src\components\SideBar.tsx
import React, { useState } from 'react';
import { LayoutGrid, BarChart3, Database, LogOut, Webhook, Shield, Moon } from 'lucide-react';

// Removed import from '@/constants'

// A reusable component for sidebar items
const SidebarItem = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative flex items-center justify-center
      w-16 h-16 p-4 my-2
      rounded-lg cursor-pointer
      text-gray-400 hover:bg-blue-900/50 hover:text-gray-300
      transition-colors duration-200
      group
      ${active ? 'bg-blue-900/50 text-gray-400' : ''}
    `}
  >
    {icon}
    {active && (
      <div className="absolute right-0 w-1 h-3/4 bg-gray-400 rounded-l-lg" />
    )}
    <span
      className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md
      text-white bg-gray-800 text-xs font-bold
      transform scale-0 group-hover:scale-100 transition-transform duration-200 origin-left z-10"
    >
      {text}
    </span>
  </button>
);

export const Sidebar = ({ onLogout, setCurrentTitleHeader }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: <LayoutGrid size={28} /> },
    { name: 'Analytics', icon: <BarChart3 size={28} /> },
    { name: 'Data Sources', icon: <Database size={28} /> },
  ];

  const handleNavClick = (item) => {
    setActiveItem(item.name);
    setCurrentTitleHeader(item.name);
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 bg-[#08182d] flex flex-col items-center justify-between py-4 z-50 shadow-lg">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 mb-6 flex items-center justify-center bg-gray-900/50 rounded-full">
          <Shield size={32} className="text-white" />
        </div>
        <nav>
          {navItems.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              text={item.name}
              active={activeItem === item.name}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </nav>
      </div>
      <div className="flex flex-col items-center">
        <button
          // onClick={/* onLogout */}
          className="
            flex flex-col items-center justify-center
            w-full py-4
            text-gray-400 hover:text-gray-300
            transition-colors duration-200
            group
          "
        >
          <Moon size={28} />
        </button>
        <hr style={{
          backgroundColor: 'white',
          height: 2,
          overflow: 'hidden',
          width: '100%',
        }} />
        <button
          onClick={onLogout}
          className="
            flex flex-col items-center justify-center
            w-full py-4
            text-gray-400 hover:text-gray-300
            transition-colors duration-200
            group
          "
        >
          <span className="mt-1 text-xs text-center">Log out</span>
        </button>
      </div>
    </aside>
  );
};