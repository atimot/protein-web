import React from 'react';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8 text-center">
      <AppRoutes />
    </div>
  );
};
