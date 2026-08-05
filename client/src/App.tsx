import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CanvasWorkspacePage } from './pages/CanvasWorkspacePage';

export function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'landing';
  });
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const navigateTo = useCallback((page: string, pushHistory = true) => {
    setCurrentPage(page);
    if (pushHistory) {
      window.history.pushState({ page }, '', `#${page}`);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for Browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        const hash = window.location.hash.replace('#', '');
        setCurrentPage(hash || 'landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
        navigateTo('dashboard', false);
      }
    }
  }, [isAuthenticated, isLoading, currentPage, navigateTo]);

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
    navigateTo('canvas');
  };

  if (currentPage === 'canvas' && activeProjectId) {
    return (
      <CanvasWorkspacePage
        projectId={activeProjectId}
        onBack={() => navigateTo('dashboard')}
      />
    );
  }

  if (currentPage === 'templates') {
    return (
      <TemplatesPage
        onOpenCanvas={handleOpenCanvas}
        onNavigate={page => navigateTo(page)}
      />
    );
  }

  if (currentPage === 'dashboard' && isAuthenticated) {
    return (
      <DashboardPage
        onOpenCanvas={handleOpenCanvas}
        onNavigate={page => navigateTo(page)}
      />
    );
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={page => navigateTo(page)} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onNavigate={page => navigateTo(page)} />;
  }

  return <LandingPage onNavigate={page => navigateTo(page)} />;
}

export default App;
