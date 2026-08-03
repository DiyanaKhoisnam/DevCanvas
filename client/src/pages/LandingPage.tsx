import React from 'react';
import { Layers, ArrowRight, ShieldCheck, Sparkles, Code2, Cpu, CheckCircle2, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { api } from '../services/api';

interface Props {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLaunchDemo = async () => {
    const demoEmail = `demo_${Math.floor(Math.random() * 10000)}@devcanvas.io`;
    const demoPassword = 'demopassword123';

    try {
      const res = await api.post('/auth/register', {
        email: demoEmail,
        username: `architect_${Math.floor(Math.random() * 1000)}`,
        password: demoPassword,
      });
      setAuth(res.data.user, res.data.accessToken);
      onNavigate('dashboard');
    } catch (err) {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-800/80 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            DevCanvas
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-24 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Production-Ready Software Architecture Designer
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Visual Software Architecture with Real-Time Linting & Code Export
        </h1>

        <p className="text-base md:text-lg text-slate-400 mt-6 max-w-2xl leading-relaxed">
          Design, document, validate, and export software systems in minutes. Experience a Figma-grade canvas built explicitly for backend engineers and software architects.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            Launch Visual Canvas
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleLaunchDemo}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass-card text-slate-200 hover:text-white font-bold text-sm transition-all hover:bg-slate-800/80"
          >
            Try Interactive Demo
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="p-6 glass-card rounded-2xl border flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Drag & Drop Component Library</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-built multi-tier components (Frontend, API Gateway, Microservice, PostgreSQL DB, Redis, Message Queues, Cloud Storage).
            </p>
          </div>

          <div className="p-6 glass-card rounded-2xl border flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Real-Time Architecture Linting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated rule engine detects direct DB exposure, unencrypted HTTP traffic, isolated nodes, and computes system Health Scores.
            </p>
          </div>

          <div className="p-6 glass-card rounded-2xl border flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 w-fit">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Terraform & Markdown Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              One-click export into Terraform (HCL) cloud configuration, Markdown system docs, high-DPI PNGs, and print-ready PDFs.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-slate-800 text-center text-xs text-slate-500 glass-panel">
        © 2026 DevCanvas Architecture Designer. Engineered for modern full-stack development teams.
      </footer>
    </div>
  );
};
