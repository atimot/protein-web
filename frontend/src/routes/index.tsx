import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Profile } from "@/pages/Profile";
import { Discover } from "@/pages/Discover";
import { Registration } from "@/pages/Registration";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公開ルート（ログイン不要） */}
        <Route path="/register" element={<Registration />} />
        
        {/* 保護されたルート（ログイン必須） */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/discover" element={
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};
