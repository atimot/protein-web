import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FiLogOut } from "react-icons/fi";

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { 
      state: { message: "ログアウトしました" } 
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <FiLogOut className="h-4 w-4" />
      <span className="hidden sm:inline">ログアウト</span>
    </Button>
  );
};

export default LogoutButton;