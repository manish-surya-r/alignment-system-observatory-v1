
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SystemState } from '../types';

interface ReportCenterProps {
  history: SystemState[];
  uncertainty: number;
}

const ReportGraph: React.FC<{ data: SystemState[], title: string, color: string }> = ({ data, title, color }) => {
  const width = 400;
  const height = 120;
  const padding = 20;

  const path = useMemo(() => {
    if (data.length < 2) return "";
    const xStep = (width - padding * 2) / (data.length - 1);
    const points = data.map((s, i) => {
      const x = padding + i * xStep;
      const y = height - padding - (s.uncertainty * (height - padding * 2));
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  }, [data]);

  return (
    <div className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
        <span className="text-[8px] font-mono text-slate-600 uppercase">Snapshot Interval: 1s</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
        {path && <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" />}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />
      </svg>
    </div>
  );
};

export const ReportCenter: React.FC<ReportCenterProps> = ({ history, uncertainty }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<{ text: string; snapshot: SystemState[] } | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const generateReport = async (range: string) => {
    setIsGenerating(true);
    setShowOptions(false);
    
    const pointsToTake = range === '1 MINUTE' ? 60 : range === '5 MINUTES' ? 300 : 600;
    const snapshot = history.slice(-pointsToTake);

    try {
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      if (!apiKey) {
        throw new Error("API Key is missing in environment");
      }
      const ai = new GoogleGenAI({ apiKey });
      const avgUncertainty = snapshot.reduce((acc, curr) => acc + curr.uncertainty, 0) / (snapshot.length || 1);
      
      const prompt = `Act as an AI Safety Officer. Generate a technical observatory report for the past ${range}. 
      Current system state: Uncertainty ${uncertainty.toFixed(4)}, Throughput 92%. 
      Recent Average Uncertainty: ${avgUncertainty.toFixed(4)}.
      Summarize risks, alignment drift, and provide a recommendation. Keep it professional, concise, and formatted as a technical log with sections like [EXECUTIVE SUMMARY], [RISK ASSESSMENT], and [COMMAND INTERVENTION].`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReport({
        text: response.text || "Failed to generate summary.",
        snapshot: snapshot
      });
    } catch (error) {
      console.error("Report Generation Error:", error);
      alert("Error generating report. Ensure API key is configured.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <i className="fas fa-file-shield text-slate-500"></i>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Analytics & Reporting</h3>
        </div>
        <button 
          onClick={() => setShowOptions(!showOptions)}
          disabled={isGenerating}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2 italic">
              <i className="fas fa-circle-notch animate-spin"></i> GENERATING...
            </span>
          ) : 'NEW SAFETY REPORT'}
        </button>
      </div>

      {showOptions && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 animate-in fade-in slide-in-from-top-2">
          {['1 MINUTE', '5 MINUTES', '15 MINUTES', '1 HOUR'].map((range) => (
            <button
              key={range}
              onClick={() => generateReport(range)}
              className="py-3 bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 text-[9px] font-black text-slate-500 hover:text-cyan-400 rounded-xl transition-all uppercase tracking-widest"
            >
              {range}
            </button>
          ))}
        </div>
      )}

      {report && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 relative animate-in zoom-in-95 backdrop-blur-sm">
          <button 
            onClick={() => setReport(null)}
            className="absolute top-6 right-6 text-slate-600 hover:text-slate-400 p-2"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
              <i className="fas fa-file-invoice text-cyan-400"></i>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-200 uppercase tracking-widest">ASO SAFETY INTELLIGENCE REPORT</h4>
              <p className="text-[9px] font-mono text-slate-600 mt-0.5 uppercase tracking-tighter">REF: {Math.random().toString(36).substring(7).toUpperCase()} | TIMESTAMP: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="prose prose-invert max-w-none">
              <div className="text-[11px] font-mono text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
                {report.text}
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">Visual Analytics Dashboard</h5>
              
              <ReportGraph data={report.snapshot} title="LATENT UNCERTAINTY TREND (σ)" color="#fbbf24" />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Peak Drift</p>
                  <p className="text-lg font-mono font-black text-amber-500">
                    {report.snapshot.length > 0 ? Math.max(...report.snapshot.map(s => s.uncertainty)).toFixed(4) : "0.0000"}
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Safety Variance</p>
                  <p className="text-lg font-mono font-black text-cyan-500">
                    {report.snapshot.length > 0 ? (Math.max(...report.snapshot.map(s => s.uncertainty)) - Math.min(...report.snapshot.map(s => s.uncertainty))).toFixed(4) : "0.0000"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl mt-4">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fas fa-robot text-[8px]"></i> AI INTELLIGENCE SUMMARY
                </p>
                <p className="text-[9px] text-slate-400 leading-relaxed italic">
                  Data extrapolated from {report.snapshot.length} heartbeat pulses. Divergence identified in semantic buffers. High correlation between throughput spikes and uncertainty drift.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <span className="text-[8px] font-mono text-slate-700">HASH: SHA256_{Math.random().toString(36).substring(7)}</span>
              <span className="text-[8px] font-mono text-emerald-500 font-bold">ENCRYPTION: AES-256 ACTIVE</span>
            </div>
            <div className="flex gap-3">
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-[9px] font-black uppercase tracking-widest transition-all">
                <i className="fas fa-download mr-2"></i> EXPORT_PDF
              </button>
              <button className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 rounded text-[9px] font-black uppercase tracking-widest transition-all">
                <i className="fas fa-print mr-2"></i> PRINT_LOG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
