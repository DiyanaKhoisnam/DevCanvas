import React, { useState } from 'react';
import { X, FileText, Code2, Image as ImageIcon, Download, Copy, Check } from 'lucide-react';
import { useCanvasStore } from '../../stores/useCanvasStore';
import { useUIStore } from '../../stores/useUIStore';
import { api } from '../../services/api';
import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';

interface Props {
  projectTitle: string;
}

export const ExportModal: React.FC<Props> = ({ projectTitle }) => {
  const { nodes, edges } = useCanvasStore();
  const { isExportModalOpen, setExportModalOpen } = useUIStore();

  const [activeTab, setActiveTab] = useState<'image' | 'markdown' | 'terraform' | 'json'>('image');
  const [markdownContent, setMarkdownContent] = useState('');
  const [terraformContent, setTerraformContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const handleFetchMarkdown = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/export/markdown', { title: projectTitle, nodes, edges });
      setMarkdownContent(res.data.markdown);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTerraform = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/export/terraform', { title: projectTitle, nodes, edges });
      setTerraformContent(res.data.terraform);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPNG = async () => {
    const canvasElement = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!canvasElement) return;

    try {
      const dataUrl = await toPng(canvasElement, { backgroundColor: '#0b0f17', quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${projectTitle.toLowerCase().replace(/\s+/g, '_')}_architecture.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export failed', err);
    }
  };

  const handleExportPDF = async () => {
    const canvasElement = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!canvasElement) return;

    try {
      const dataUrl = await toPng(canvasElement, { backgroundColor: '#0b0f17' });
      const pdf = new jsPDF('landscape', 'px', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${projectTitle.toLowerCase().replace(/\s+/g, '_')}_architecture.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ title: projectTitle, nodes, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${projectTitle.toLowerCase().replace(/\s+/g, '_')}_diagram.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl glass-panel rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">Export & Documentation Generator</h2>
          <button
            onClick={() => setExportModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'image' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image & PDF
          </button>
          <button
            onClick={() => {
              setActiveTab('markdown');
              handleFetchMarkdown();
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'markdown' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Markdown Docs
          </button>
          <button
            onClick={() => {
              setActiveTab('terraform');
              handleFetchTerraform();
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'terraform' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Terraform (HCL)
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'json' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            JSON Schema
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'image' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 glass-card rounded-xl border flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">High-Resolution PNG Image</h3>
                  <p className="text-xs text-slate-400 mt-1">Export high-DPI rasterized image suitable for presentations and pitch decks.</p>
                </div>
                <button
                  onClick={handleExportPNG}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
              </div>

              <div className="p-5 glass-card rounded-xl border flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">PDF Architectural Document</h3>
                  <p className="text-xs text-slate-400 mt-1">Export vector print-ready PDF document containing visual canvas view.</p>
                </div>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {(activeTab === 'markdown' || activeTab === 'terraform') && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Generated Code Preview</span>
                <button
                  onClick={() => copyToClipboard(activeTab === 'markdown' ? markdownContent : terraformContent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              {isLoading ? (
                <div className="h-60 flex items-center justify-center text-xs text-slate-400">
                  Generating export artifact...
                </div>
              ) : (
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-80 leading-relaxed">
                  {activeTab === 'markdown' ? markdownContent : terraformContent}
                </pre>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">JSON Blueprint Payload</h3>
                <p className="text-xs text-slate-400 mt-1">Export raw architecture JSON definition for version control or migration.</p>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-60">
                {JSON.stringify({ title: projectTitle, nodes, edges }, null, 2)}
              </pre>
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                Download JSON File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
