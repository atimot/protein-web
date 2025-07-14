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
    "inline-flex items-center rounded-lg transition-colors duration-200",
    "p-2 -ml-2 md:p-3 md:-ml-3",
    "hover:bg-gray-100 dark:hover:bg-gray-800",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    "no-underline" // リンクのデフォルトスタイルを無効化
  );

  const titleClasses = cn(
    "m-0 font-bold text-2xl md:text-3xl"
  );

  const spanClasses = cn(
    "text-transparent bg-clip-text bg-gradient-to-r font-sans tracking-tight",
    "from-blue-600 to-purple-600",
    "dark:from-blue-400 dark:to-purple-400"
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
            <span className={spanClasses}>
              proteInternet
            </span>
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
