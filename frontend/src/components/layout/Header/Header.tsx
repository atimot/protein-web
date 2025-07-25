import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-8">
        <Logo />

        {isAuthenticated ? <LogoutButton /> : <></>}
      </div>
    </header>
  );
};

export default Header;
