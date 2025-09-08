// src/components/Header.jsx

import React, { useState, useRef, useEffect } from "react";
import "@/constants";
import { Bell, Search } from "lucide-react";
import { searchBarColor, searchBarTextColor } from "@/constants";
import { useNavigate } from "react-router-dom";

// A good practice is to create a dedicated component for list items
// to keep the main component clean and readable.
const AlertItem = ({ alert }) => {
  // ... (No changes needed in this component)
};

// Main Header Component - Updated to be responsive
export const Header = ({ userInfo, alerts, onLogout }) => {
  const navigate = useNavigate();
  const [isAlertsVisible, setIsAlertsVisible] = useState(false);
  const alertsButtonRef = useRef(null);
  const alertsTooltipRef = useRef(null);
  const notificationCount = alerts ? alerts.length : 0;

  const toggleAlertsTooltip = () => {
    setIsAlertsVisible((prev) => !prev);
    navigate(`/alerts`);
    console.log("Alerts button clicked");
  };

  // Effect to handle clicks outside the alerts tooltip to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isAlertsVisible &&
        alertsButtonRef.current &&
        !alertsButtonRef.current.contains(event.target) &&
        alertsTooltipRef.current &&
        !alertsTooltipRef.current.contains(event.target)
      ) {
        setIsAlertsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAlertsVisible]);

  return (
    // The header is full-width on mobile and adjusts for the sidebar on medium screens (md) and up
    <header
      style={{
        height: "90px",
        background:
          "linear-gradient(90deg, #08182d 0%, #02356c 70%, #034a7e 100%)",
      }}
      className="
        z-40
        w-full
        shadow-md
        fixed top-0 left-0
        md:w-[calc(100%-5rem)] md:left-20
      "
    >
      {/* Main container with adjusted padding for mobile */}
      <div
        className="
          flex
          w-full h-full
          px-4
          relative items-center justify-between
          md:px-6
        "
      >
        {/* Left Section - Hidden on mobile, visible on medium screens and up */}
        <div
          className="
            hidden
            space-x-4
            items-center
            md:flex
          "
        >
          <h1
            className="
              text-xl font-bold text-white
            "
          >
            Data Quality
          </h1>
        </div>

        {/* Center Section (Search Bar) - Hidden on mobile, visible on medium screens and up */}
        <div
          className="
            w-[calc(100%-5rem)] max-w-2xl
            relative left-1/3 transform -translate-x-1/2
            md:block
          "
        >
          <div
            className="
              relative
            "
          >
            <Search
              className="
                w-5 h-5
                text-gray-300
                absolute left-4 top-1/2 -translate-y-1/2
              "
            />
            <input
              type="text"
              placeholder="Search Pages, Data, etc..."
              style={{
                backgroundColor: searchBarColor,
                color: searchBarTextColor,
              }}
              className="
                h-11 w-full
                pl-11 pr-4
                rounded-full
                placeholder:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400
              "
            />
          </div>
        </div>

        {/* Right Section - Always visible, but spacing and content adapts */}
        <div
          className="
            flex
            space-x-3 ml-auto
            text-white
            items-center
            md:space-x-5
          "
        >
          {/* Alerts */}
          <button
            type="button"
            ref={alertsButtonRef}
            onClick={toggleAlertsTooltip}
            className="
              p-2
              text-cyan-300
              rounded-lg
              relative focus:ring-4 focus:outline-none focus:ring-blue-500
            "
          >
            <span
              className="
                sr-only
              "
            >
              Notifications
            </span>
            <Bell size={28} />
            {notificationCount > 0 && (
              <div
                className="
                  inline-flex
                  w-6 h-6
                  text-xs font-bold text-black
                  bg-cyan-400
                  border-2 border-white rounded-full
                  absolute items-center justify-center -top-1 -right-1
                "
              >
                {notificationCount}
              </div>
            )}
          </button>

          {/* User Info - Text is hidden until large screens (lg) */}
          <div
            className="
              hidden
              font-medium text-white text-right
              lg:block
            "
          >
            <div
              className="
                font-semibold
              "
            >
              Hi, {userInfo?.userid}!
            </div>
            <div
              className="
                flex
                space-x-1
                text-xs text-gray-200
                items-center
              "
            >
              <span>Tenency:</span>
              <span
                className="
                  font-bold
                "
              >
                {userInfo?.isAdmin ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* Profile Picture - Always visible */}
          <div>
            <button
              type="button"
              onClick={onLogout}
              className="
                overflow-hidden
                w-11 h-11
                rounded-full
                shadow-lg transition-transform
                relative transform hover:scale-105 duration-300
              "
            >
              <img
                src={
                  userInfo?.profileImageURL ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9zilY2Yu2hc19pDZFxgWDTUDy5DId7ITqA&s"
                }
                alt="Profile image"
                className="
                  object-cover
                  w-full h-full
                "
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
