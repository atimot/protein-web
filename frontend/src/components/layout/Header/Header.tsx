import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  const headerClasses = cn(
    "sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200",
    "dark:bg-gray-900 dark:border-gray-800"
  );

  const containerClasses = cn(
    "flex items-center justify-between max-w-4xl mx-auto",
    "px-4 py-3 md:px-6 md:py-4 lg:px-8"
  );

  const logoLinkClasses = cn(
    "inline-flex items-center transition-colors duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
    "no-underline"
  );

  const titleClasses = cn(
    "m-0 font-bold text-2xl md:text-3xl"
  );

  const proteInClasses = cn(
    "font-sans tracking-tight text-amber-900",
    "dark:text-amber-600"
  );

  const ternetClasses = cn(
    "font-sans tracking-tight text-amber-700",
    "dark:text-amber-500"
  );

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        <h1 className={titleClasses}>
          <Link 
            to="/" 
            className={logoLinkClasses}
            aria-label="ホームに戻る"
          >
            <span className={proteInClasses}>proteIn</span>
            <span className={ternetClasses}>ternet</span>
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
