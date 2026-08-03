import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon, Lightbulb } from 'lucide-react';
import { useCanvasStore } from '../../stores/useCanvasStore';
import { useUIStore } from '../../stores/useUIStore';

export const ValidationDrawer: React.FC = () => {
  const { healthScore, validationIssues, selectNode } = useCanvasStore();
  const { isValidationDrawerOpen, setValidationDrawerOpen } = useUIStore();

  if (!isValidationDrawerOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-72 glass-panel border-t border-slate-800 z-30 shadow-2xl flex flex-col transition-all">
      {/* Drawer Header */}
      <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {healthScore >= 90 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-amber-400" />
            )}
            <h2 className="text-sm font-bold text-slate-100">Architecture Health Diagnostics</h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
            Score: {healthScore}/100
          </span>
        </div>

        <button
          onClick={() => setValidationDrawerOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Issues list */}
      <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {validationIssues.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-200">No Architectural Violations Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your software architecture follows secure, well-structured multi-tier design patterns!
            </p>
          </div>
        ) : (
          validationIssues.map((issue, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer ${
                issue.severity === 'error'
                  ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
                  : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
              }`}
              onClick={() => {
                if (issue.nodeIds.length > 0) {
                  selectNode(issue.nodeIds[0]);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {issue.severity === 'error' ? (
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-xs font-bold text-slate-200">{issue.title}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    issue.severity === 'error' ? 'bg-rose-900/60 text-rose-300' : 'bg-amber-900/60 text-amber-300'
                  }`}
                >
                  {issue.severity}
                </span>
              </div>

              <p className="text-xs text-slate-300">{issue.message}</p>

              {issue.recommendation && (
                <div className="mt-1 flex items-start gap-1.5 text-[11px] text-cyan-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{issue.recommendation}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
