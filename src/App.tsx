import React from 'react';
import { AppRoutes } from './routes';
import './App.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
};
