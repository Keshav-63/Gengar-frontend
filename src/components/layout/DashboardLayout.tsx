import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};
