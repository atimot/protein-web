import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  MdOutlineHome, MdHome,
  MdOutlineSearch, MdSearch,
  MdOutlinePerson, MdPerson,
  MdOutlineSettings, MdSettings
} from "react-icons/md";

export const Footer: React.FC = () => {
  const location = useLocation();
  const footerClasses = cn(
    "sticky bottom-0 z-50 bg-white border-t border-gray-200 mt-auto",
    "dark:bg-gray-900 dark:border-gray-800",
  );

  const containerClasses = cn(
    "max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-8"
  );

  const navClasses = cn(
    "flex justify-center items-center gap-8"
  );

  const IconButton = ({ 
    to, 
    ariaLabel, 
    outlineIcon: OutlineIcon, 
    filledIcon: FilledIcon 
  }: { 
    to: string; 
    ariaLabel: string;
    outlineIcon: React.ComponentType<{ className?: string }>;
    filledIcon: React.ComponentType<{ className?: string }>;
  }) => {
    const isActive = location.pathname === to;
    
    const iconButtonClasses = cn(
      "p-2 rounded-lg transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
      isActive 
        ? "text-amber-900 dark:text-amber-800" 
        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
    );

    const IconComponent = isActive ? FilledIcon : OutlineIcon;

    return (
      <Link to={to} className={iconButtonClasses} aria-label={ariaLabel}>
        <IconComponent className="w-6 h-6" />
      </Link>
    );
  };

  return (
    <footer className={footerClasses}>
      <div className={containerClasses}>
        <nav className={navClasses}>
          <IconButton 
            to="/" 
            ariaLabel="ホーム" 
            outlineIcon={MdOutlineHome}
            filledIcon={MdHome}
          />
          <IconButton 
            to="/discover" 
            ariaLabel="発見" 
            outlineIcon={MdOutlineSearch}
            filledIcon={MdSearch}
          />
          <IconButton 
            to="/profile" 
            ariaLabel="プロフィール" 
            outlineIcon={MdOutlinePerson}
            filledIcon={MdPerson}
          />
          <IconButton 
            to="/settings" 
            ariaLabel="設定" 
            outlineIcon={MdOutlineSettings}
            filledIcon={MdSettings}
          />
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 
