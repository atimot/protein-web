import React from "react";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};
