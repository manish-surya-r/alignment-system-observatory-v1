
import React, { useMemo, useState } from 'react';
import { SystemState } from '../types';
import { DocOverlay } from './DocOverlay';

interface TelemetryProps {
  history: SystemState[];
  maxPoints?: number;
}

const SystemTelemetry: React.FC<TelemetryProps> = ({ history, maxPoints = 50 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 800;
  const height = 180;
  const padding = 35;

  const current = history[history.length - 1] || { throughput: 0, uncertainty: 0 };
  const points = useMemo(() => history.slice(-maxPoints), [history, maxPoints]);

  const paths = useMemo(() => {
    if (points.length < 2) return { uncertainty: '', throughput: '' };
    const step = (width - padding * 2) / (maxPoints - 1);

    const uncertaintyPoints = points.map((s, i) => {
      const x = padding + i * step;
      const y = height - padding - (s.uncertainty * (height - padding * 2));
      return `${x},${y}`;
    });

    const throughputPoints = points.map((s, i) => {
      const x = padding + i * step;
      const y = height - padding - ((s.throughput / 100) * (height - padding * 2));
      return `${x},${y}`;
    });

    return {
      uncertainty: `M ${uncertaintyPoints.join(' L ')}`,
      throughput: `M ${throughputPoints.join(' L ')}`
    };
  }, [points, maxPoints]);

  const hoverData = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 md:p-6 space-y-6 backdrop-blur-sm relative group overflow-hidden">
      <DocOverlay 
        title="Live Telemetry Stream" 
        description="High-frequency system metrics. Monitor Throughput (System Load) against Latent Uncertainty (Safety Risk). Diverging signals represent alignment drift."
        units="Throughput: 0-100% | Uncertainty: 0.0-1.0 Magnitude"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pr-16">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Live Telemetry</h3>
          <div className="flex gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-cyan-400 uppercase">Throughput</span>
              <span className="text-xl font-mono text-white leading-none">
                {hoverData ? hoverData.throughput.toFixed(1) : current.throughput.toFixed(1)}
                <span className="text-[10px] opacity-40">%</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-amber-400 uppercase">Uncertainty</span>
              <span className="text-xl font-mono text-white leading-none">
                {hoverData ? hoverData.uncertainty.toFixed(3) : current.uncertainty.toFixed(3)}
                <span className="text-[10px] opacity-40">σ</span>
              </span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-4 mb-2">
          <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <div className="relative h-[180px] w-full flex">
        <div className="flex flex-col justify-between text-[9px] font-mono text-slate-600 w-10 md:w-12 py-1 pr-2 text-right border-r border-slate-800/50">
          <span>1.0</span>
          <span>0.5</span>
          <span>0.0</span>
        </div>

        <div className="relative flex-1 cursor-crosshair overflow-hidden" 
             onMouseMove={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const x = e.clientX - rect.left;
               const index = Math.min(Math.max(0, Math.floor((x / rect.width) * maxPoints)), points.length - 1);
               setHoverIndex(index);
             }} 
             onMouseLeave={() => setHoverIndex(null)}>
          
          <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line key={p} x1="0" y1={padding + p * (height - padding * 2)} x2="100%" y2={padding + p * (height - padding * 2)} stroke="white" strokeWidth="1" />
            ))}
          </svg>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]" preserveAspectRatio="none">
            <path d={paths.throughput} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={paths.uncertainty} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {hoverIndex !== null && (
              <g>
                <line 
                  x1={padding + hoverIndex * ((width - padding * 2) / (maxPoints - 1))} 
                  y1="0" 
                  x2={padding + hoverIndex * ((width - padding * 2) / (maxPoints - 1))} 
                  y2={height} 
                  stroke="#22d3ee" 
                  strokeWidth="1" 
                  strokeDasharray="2 2" 
                />
                <circle 
                  cx={padding + hoverIndex * ((width - padding * 2) / (maxPoints - 1))} 
                  cy={height - padding - ((points[hoverIndex].throughput / 100) * (height - padding * 2))} 
                  r="4" 
                  fill="#22d3ee" 
                />
                <circle 
                  cx={padding + hoverIndex * ((width - padding * 2) / (maxPoints - 1))} 
                  cy={height - padding - (points[hoverIndex].uncertainty * (height - padding * 2))} 
                  r="4" 
                  fill="#fbbf24" 
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      <div className="flex justify-between pl-12 pr-1 pt-2">
        <span className="text-[8px] md:text-[9px] font-mono text-slate-600 uppercase">T-60s</span>
        <span className="text-[8px] md:text-[9px] font-mono text-slate-600 uppercase">T-30s</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-[8px] md:text-[9px] font-mono text-cyan-500 font-black uppercase">Syncing</span>
        </div>
      </div>
    </div>
  );
};

export default SystemTelemetry;
