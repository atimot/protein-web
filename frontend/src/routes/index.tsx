import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Timeline } from "@/pages/Timeline";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Timeline />} />
      </Routes>
    </BrowserRouter>
  );
};
