import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-8">
        <h1 className="m-0 font-bold text-2xl md:text-3xl">
          <Link 
            to="/" 
            className="inline-flex items-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 no-underline"
            aria-label="ホームに戻る"
          >
            <span className="font-sans tracking-tight text-amber-900 dark:text-amber-600">proteIn</span>
            <span className="font-sans tracking-tight text-amber-700 dark:text-amber-500">ternet</span>
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
