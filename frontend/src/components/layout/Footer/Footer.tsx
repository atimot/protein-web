import React from "react";
import { HomeButton } from "./HomeButton";

export const Footer: React.FC = () => {

  return (
    <footer className="sticky bottom-0 z-50 h-14 md:h-16 bg-white border-t border-gray-200 mt-auto dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-center">
        <nav className="flex gap-8">
          <HomeButton />
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 
