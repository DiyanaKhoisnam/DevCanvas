import React from 'react';
import { Layers, LayoutDashboard, Sparkles, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';

interface Props {
  activeTab: 'dashboard' | 'templates';
  onNavigate: (tab: 'dashboard' | 'templates') => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  return (
    <header className="h-16 px-8 glass-panel border-b border-slate-800 flex items-center justify-between z-20">
      {/* Brand logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            DevCanvas
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-400">
            Architecture Designer
          </span>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Projects
        </button>

        <button
          onClick={() => onNavigate('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Templates
        </button>
      </nav>

      {/* User profile & actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user && (
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-200">{user.username}</span>
                <span className="text-[10px] text-slate-500">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
