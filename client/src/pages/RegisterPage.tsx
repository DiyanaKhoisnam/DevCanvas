import React, { useState } from 'react';
import { Layers, ArrowRight, Lock, Mail, User as UserIcon, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { api } from '../services/api';

interface Props {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { email, username, password });
      setAuth(res.data.user, res.data.accessToken);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between p-6 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-4">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          Back to Home
        </button>

        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
            DevCanvas
          </span>
        </div>
      </header>

      {/* Register Card */}
      <div className="w-full max-w-md mx-auto glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6 my-auto">
        <div className="flex flex-col items-center text-center gap-2">
          <div
            onClick={() => onNavigate('landing')}
            className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Create DevCanvas Account</h1>
          <p className="text-xs text-slate-400">Start visually designing software architectures</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Username</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="tech_architect"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="architect@devcanvas.io"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-blue-400 font-bold hover:underline">
            Sign in
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500 py-4">
        © 2026 DevCanvas Architecture Designer
      </footer>
    </div>
  );
};
