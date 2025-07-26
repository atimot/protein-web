import React from "react";
import { HomeButton } from "./HomeButton";

export const Footer: React.FC = () => {

  return (
    <footer className="sticky bottom-0 z-50 bg-white border-t border-gray-200 mt-auto dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-8">
        <nav className="flex justify-center items-center gap-8">
          <HomeButton />
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 
