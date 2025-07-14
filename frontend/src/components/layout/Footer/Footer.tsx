import React from "react";
import { cn } from "@/lib/utils";

export const Footer: React.FC = () => {
  const footerClasses = cn(
    "sticky bottom-0 z-50 bg-white border-t border-gray-200 mt-auto",
    "dark:bg-gray-900 dark:border-gray-800",
  );

  const containerClasses = cn(
    "max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8"
  );

  const contentClasses = cn(
    "text-center text-sm text-gray-600 dark:text-gray-400"
  );

  return (
    <footer className={footerClasses}>
      <div className={containerClasses}>
        <div className={contentClasses}>
          <p>© 2024 proteInternet. All rights reserved.</p>
          <p className="mt-2">プロテインレビューサイト</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
