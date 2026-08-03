import React, { useEffect, useState } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CanvasWorkspacePage } from './pages/CanvasWorkspacePage';

export function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
        setCurrentPage('dashboard');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#0b0f17] flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Loading DevCanvas...</span>
      </div>
    );
  }

  const handleOpenCanvas = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentPage('canvas');
  };

  if (currentPage === 'canvas' && activeProjectId) {
    return (
      <CanvasWorkspacePage
        projectId={activeProjectId}
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }

  if (currentPage === 'templates') {
    return (
      <TemplatesPage
        onOpenCanvas={handleOpenCanvas}
        onNavigate={page => setCurrentPage(page)}
      />
    );
  }

  if (currentPage === 'dashboard' && isAuthenticated) {
    return (
      <DashboardPage
        onOpenCanvas={handleOpenCanvas}
        onNavigate={page => setCurrentPage(page)}
      />
    );
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={page => setCurrentPage(page)} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onNavigate={page => setCurrentPage(page)} />;
  }

  return <LandingPage onNavigate={page => setCurrentPage(page)} />;
}

export default App;
