import React from 'react';
import { Navigation } from './Navigation';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activeTab, onNavigate }) => {
  return (
    <div className="min-h-screen bg-kayfabe-black flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {children}
      </main>
      <Navigation activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  );
};
