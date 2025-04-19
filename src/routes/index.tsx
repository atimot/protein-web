import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Timeline } from "../pages/Timeline";
import { isAuthenticated } from "../lib/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Timeline />} />
      </Routes>
    </BrowserRouter>
  );
};
