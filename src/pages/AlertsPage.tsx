import { TitleHeader } from "@/components/TitleHeader";
import { alertsData } from "@/constants";
import { Search, Bell, MoreVertical, Menu } from "lucide-react";

// Alert Item Component
const AlertItem = ({ title, description, timestamp }) => {
  return (
    <div
      className="
        flex
        py-5 px-2
        border-b border-gray-200
        transition-colors
        items-start last:border-b-0 hover:bg-gray-50
      "
    >
      <div
        className="
          mt-1 mr-4
          text-gray-400
        "
      >
        <Bell size={24} />
      </div>
      <div
        className="
          flex-grow
        "
      >
        <h3
          className="
            font-semibold text-gray-800
          "
        >
          {title}
        </h3>
        <p
          className="
            mt-1
            text-sm text-gray-600
          "
        >
          {description}
        </p>
      </div>
      <div
        className="
          flex
          space-x-4 ml-8
          items-center
        "
      >
        <p
          className="
            text-sm text-gray-500 whitespace-nowrap
          "
        >
          {timestamp}
        </p>
        <button
          className="
            text-gray-400
            hover:text-gray-700
          "
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

interface AlertsPageProps {
  userInfo: { userid: string } | null;
  onLogout: () => void;
}

// Main Content Component
export const AlertsPage = ({ userInfo, onLogout }: AlertsPageProps) => {
  return (
    <div>
      <TitleHeader title="Alerts" suffix={true} />
      <div
        className="
          max-w-full
          mx-auto
        "
      >
        {/* Alerts Section */}
        <div>
          <div
            className="
              flex
              p-6
              justify-between
            "
          >
            <div
              className="
                flex
                space-x-3
                text-blue-800 font-bold text-2xl
                items-center
              "
            >
              Alerts
            </div>
            <div
              className="
                flex
                space-x-4
                items-right
              "
            >
              <button
                className="
                  text-gray-500
                  hover:text-gray-800
                "
              >
                <Search size={20} />
              </button>
              <button
                className="
                  text-gray-500
                  hover:text-gray-800
                "
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
          <div
            className="
              divide-y divide-gray-200
            "
          >
            {alertsData.map((alert, index) => (
              <AlertItem
                key={index}
                title={alert.title}
                description={alert.description}
                timestamp={alert.timestamp}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
