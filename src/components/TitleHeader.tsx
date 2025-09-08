import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; // 1. Import from 'lucide-react'
import { TitleHeaderColor } from "../constants";

export const TitleHeader = ({
  title,
  suffix,
}: {
  title: string;
  suffix: boolean;
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  return (
    <div
      style={{ backgroundColor: TitleHeaderColor }}
      className="
            flex z-10
            h-28 w-full
            px-6
            items-center fixed top-20 left-20
          "
    >
      {/* ✅ This now correctly shows the button only when suffix is true */}
      {suffix && (
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="
                    mr-4 p-2
                    rounded-full
                    transition-colors
                    hover:bg-white/20
                  "
        >
          <ChevronLeft
            className="
                        h-7 w-7
                        text-white
                      "
          />
        </button>
      )}

      <h1
        className="
                text-2xl font-semibold text-white
              "
      >
        {title}
      </h1>
    </div>
  );
};
