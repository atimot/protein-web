import React from "react";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
};
