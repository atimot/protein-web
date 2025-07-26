import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineHome, MdHome } from "react-icons/md";

export const HomeButton: React.FC = () => {
  const location = useLocation();
  const isActive = location.pathname === "/";
  const IconComponent = isActive ? MdHome : MdOutlineHome;

  return (
    <Link 
      to="/" 
      className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
        isActive 
          ? "text-amber-900 dark:text-amber-800" 
          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      }`}
      aria-label="ホーム"
    >
      <IconComponent className="w-6 h-6" />
    </Link>
  );
};

export default HomeButton;