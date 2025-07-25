import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FiLogOut } from "react-icons/fi";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { 
      state: { message: "ログアウトしました" } 
    });
  };

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

        {/* Authentication Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <FiLogOut className="h-4 w-4" />
                <span className="hidden sm:inline">ログアウト</span>
              </Button>
            </>
          ) : (
            /* Login/Register Links for unauthenticated users */
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                ログイン
              </Link>
              <Link to="/register">
                <Button size="sm">
                  新規登録
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
