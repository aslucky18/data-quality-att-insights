import React, { useState, useRef, useEffect } from 'react';
import { Building2, User, AlertTriangle, LogOut, Info, Search } from 'lucide-react';

// A good practice is to create a dedicated component for list items
// to keep the main component clean and readable.
const AlertItem = ({ alert }) => {
  // Define styles and icons based on alert level for cleaner logic
  const alertConfig = {
    error: {
      Icon: AlertTriangle,
      containerClasses: 'text-red-700 bg-red-50',
      iconClasses: 'text-red-500',
    },
    warn: {
      Icon: AlertTriangle,
      containerClasses: 'text-yellow-700 bg-yellow-50',
      iconClasses: 'text-yellow-500',
    },
    info: {
      Icon: Info,
      containerClasses: 'text-gray-700 bg-gray-50',
      iconClasses: 'text-blue-500',
    },
  };

  const { Icon, containerClasses, iconClasses } = alertConfig[alert.level] || alertConfig.info;

  return (
    <li className={`p-2.5 text-sm rounded-md cursor-pointer flex items-start space-x-2 ${containerClasses}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconClasses}`} />
      <div className="flex-1">
        <p className="font-medium">{alert.message}</p>
        <p className="text-xs text-gray-500">Project: {alert.projectName} | Run ID: {alert.runId}</p>
      </div>
    </li>
  );
};

// Main Header Component
const Header = ({ userInfo, alerts, onLogout }) => {
  const [isAlertsVisible, setIsAlertsVisible] = useState(false);
  const alertsButtonRef = useRef(null);
  const alertsTooltipRef = useRef(null);

  const toggleAlertsTooltip = () => {
    setIsAlertsVisible((prev) => !prev);
  };
  
  // Effect to handle clicks outside the alerts tooltip to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isAlertsVisible &&
        alertsButtonRef.current && !alertsButtonRef.current.contains(event.target) &&
        alertsTooltipRef.current && !alertsTooltipRef.current.contains(event.target)
      ) {
        setIsAlertsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAlertsVisible]);

  return (
    <header className="container mx-auto px-4 py-4 flex items-center justify-between border-b">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">ATT Data Quality</h1>
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="relative flex-grow max-w-md mx-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="h-9 w-full pl-9 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Section: User Info and Actions */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{userInfo?.userid || 'Guest'}</span>
        </div>

        {/* Alerts Button and Dropdown */}
        <div className="relative">
          <button
            ref={alertsButtonRef}
            onClick={toggleAlertsTooltip}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 space-x-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="font-medium">Alerts</span>
          </button>

          {isAlertsVisible && (
            <div
              ref={alertsTooltipRef}
              className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20"
            >
              <div className="p-2">
                <h3 className="text-md font-bold text-center text-gray-800 mb-2 p-2 border-b">System Alerts</h3>
                <ul className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <AlertItem key={alert.id} alert={alert} />
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-500 p-4">No new alerts.</p>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export  {Header};