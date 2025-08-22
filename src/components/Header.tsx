import React, { useState, useRef, useEffect } from 'react';
import "@/constants";
import { Bell, Search, ShieldCheck } from 'lucide-react';


// A good practice is to create a dedicated component for list items
// to keep the main component clean and readable.
const AlertItem = ({ alert }) => {
  // ... (No changes needed in this component)
};


// Main Header Component - Updated to include the notification count
const Header = ({ userInfo, alerts, onLogout }) => {
  const [isAlertsVisible, setIsAlertsVisible] = useState(false);
  const alertsButtonRef = useRef(null);
  const alertsTooltipRef = useRef(null);
  const notificationCount = alerts.length ? 0 : 3;

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
    // Header with gradient background to match the image
    <header className="w-full bg-gradient-to-r from-[#1995A2] to-[#0B4F6C]">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">

        {/* Left Section: Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#1995A2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ATT Data Quality</h1>
          </div>
        </div>

        {/* Center Section: Search Bar */}
        <div className="relative flex-grow max-w-2xl mx-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 " />
          <input
            type="text"
            placeholder="Search Pages, Data, etc..."
            className="h-11 w-full pl-11 pr-4 rounded-full bg-[#2f3a3f] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Right Section: User Info and Actions */}
        <div className="flex items-center space-x-5 text-white">

          {/* Alerts Button with Notification Count restored */}
          <button
            type="button"
            className="relative p-2 text-cyan-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-500"
            ref={alertsButtonRef}
            onClick={toggleAlertsTooltip}
          >
            <span className="sr-only">Notifications</span>
            <Bell size={28} />

            {/* Notification Badge: This will now render */}
            {notificationCount > 0 && (
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-black bg-cyan-400 border-2 border-white rounded-full -top-1 -right-1">
                {notificationCount}
              </div>
            )}
          </button>

          {/* Salutation of User's Name */}
          <div className="font-medium text-white">
            {/* Main Greeting */}
            <div className="font-semibold text-white">
              Hi, {userInfo?.userid}!
            </div>
            {/* Subheading with Role and Icon */}
            <div className="text-xs text-gray-200 flex items-center justify-start space-x-1">
              <span>Tenency:</span>
              {/* Use the font-bold class to make the text bold */}
              <span className='font-bold'>{userInfo?.isAdmin ? "Admin" : "User"}</span>
            </div>
          </div>


          {/* User Profile Picture */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onLogout}
              className="relative w-11 h-11 rounded-full aspect-square overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={userInfo?.profileImageURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9zilY2Yu2hc19pDZFxgWDTUDy5DId7ITqA&s"}
                alt="Profile image"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
      <script>
        console.log(userInfo?.profileImageURL);
      </script>
    </header>
  );
};

export { Header };