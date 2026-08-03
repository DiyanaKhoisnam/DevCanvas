import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Sparkles, ArrowRight, Layers, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { TemplateItem } from '../types';

interface Props {
  onOpenCanvas: (projectId: string) => void;
  onNavigate: (page: string) => void;
}

export const TemplatesPage: React.FC<Props> = ({ onOpenCanvas, onNavigate }) => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/templates');
        setTemplates(res.data.templates);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleUseTemplate = async (template: TemplateItem) => {
    try {
      const res = await api.post('/projects', {
        title: `${template.title} Project`,
        description: template.description,
        templateId: template.id,
      });
      onOpenCanvas(res.data.project.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Navbar activeTab="templates" onNavigate={tab => onNavigate(tab)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Official Blueprints
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Architecture Templates</h1>
          <p className="text-xs text-slate-400 mt-1">Instantiate pre-configured industry standard software architecture blueprints</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-52 glass-card rounded-2xl animate-pulse bg-slate-900/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(template => (
              <div
                key={template.id}
                className="p-6 glass-card rounded-2xl border border-slate-800 flex flex-col justify-between gap-6 hover:border-blue-500/40 transition-all"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-950/80 text-blue-400 border border-blue-500/30">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified Pattern
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{template.title}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{template.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <span className="text-xs text-slate-500 font-mono">
                    {template.nodes.length} Components • {template.edges.length} Links
                  </span>

                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
                  >
                    Use Blueprint
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
