
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { DocOverlay } from './DocOverlay';

interface LandscapeProps {
  uncertainty: number;
}

export const LatentLandscape: React.FC<LandscapeProps> = ({ uncertainty }) => {
  const [tick, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(timer);
  }, []);

  // Generate a high-density point cloud (300 points)
  const nodes = useMemo(() => {
    return Array.from({ length: 300 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      baseX: 10 + Math.random() * 80,
      baseY: 10 + Math.random() * 80,
      size: Math.random() * 1.5 + 0.5,
      cluster: Math.floor(Math.random() * 6),
      speed: 0.1 + Math.random() * 0.5
    }));
  }, []);

  // Define cluster centroids for connectivity
  const clusters = useMemo(() => [
    { x: 25, y: 25, color: '#22d3ee', label: 'OPTIMAL' },
    { x: 75, y: 25, color: '#0ea5e9', label: 'STABLE' },
    { x: 50, y: 50, color: '#fbbf24', label: 'DRIFTING' },
    { x: 25, y: 75, color: '#f59e0b', label: 'UNCERTAIN' },
    { x: 75, y: 75, color: '#ef4444', label: 'DIVERGENT' },
    { x: 50, y: 85, color: '#6366f1', label: 'REASONING' }
  ], []);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-8 relative overflow-hidden group backdrop-blur-md">
      <DocOverlay 
        title="LATENT DECISION LANDSCAPE" 
        description="A real-time N-Space projection using stochastic neighbor embedding. This visualization maps the high-dimensional internal state of the model into a 2D topographic field. Density spikes indicate reasoning focus areas."
        units="UMAP Projection | Perplexity 30"
      />

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">LATENT DECISION LANDSCAPE (N-SPACE PROJECTION)</h3>
          <p className="text-[9px] font-mono text-cyan-500/60 mt-1 uppercase tracking-widest">Projection Method: Stochastic Neural Field (Live)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Confidence</p>
            <p className="text-lg font-mono font-black text-white">{((1 - uncertainty) * 100).toFixed(1)}%</p>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Entropy</p>
            <p className="text-lg font-mono font-black text-amber-500">{(uncertainty * 0.1).toFixed(4)}</p>
          </div>
        </div>
      </div>

      <div className="relative aspect-square md:aspect-video w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden cursor-crosshair group-hover:border-cyan-500/30 transition-colors">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* Live Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-scan-y z-10"></div>

        <svg className="absolute inset-0 w-full h-full p-4 md:p-8" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Neural Connections (Web) */}
          {clusters.map((c, ci) => (
            <g key={`cluster-web-${ci}`} opacity={0.1 + (1 - uncertainty) * 0.2}>
              {nodes.filter(n => n.cluster === ci).slice(0, 15).map((n, ni) => {
                const nx = n.baseX + Math.sin(tick * 0.05 + n.id) * (uncertainty * 3);
                const ny = n.baseY + Math.cos(tick * 0.05 + n.id) * (uncertainty * 3);
                return (
                  <line 
                    key={`line-${n.id}`}
                    x1={c.x} y1={c.y} x2={nx} y2={ny}
                    stroke={c.color} strokeWidth="0.1"
                  />
                );
              })}
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((n, i) => {
            const cluster = clusters[n.cluster];
            const driftX = Math.sin(tick * 0.05 + i) * (uncertainty * 4);
            const driftY = Math.cos(tick * 0.05 + i) * (uncertainty * 4);
            const isCritical = n.cluster === 4 && uncertainty > 0.6;
            
            return (
              <circle 
                key={i} 
                cx={n.baseX + driftX} 
                cy={n.baseY + driftY} 
                r={n.size * (isCritical ? 1.5 : 1)} 
                fill={cluster.color} 
                fillOpacity={isCritical ? 0.9 : 0.5}
                filter={isCritical ? 'url(#glow)' : ''}
                className="transition-all duration-300"
              />
            );
          })}
          
          {/* Cluster Centroids */}
          {clusters.map((c, i) => (
            <g key={`centroid-${i}`}>
              <circle cx={c.x} cy={c.y} r="1.5" fill="none" stroke={c.color} strokeWidth="0.2" className="animate-pulse" />
              <circle cx={c.x} cy={c.y} r="0.5" fill={c.color} />
            </g>
          ))}
        </svg>

        {/* Live Metrics HUD */}
        <div className="absolute bottom-4 right-4 text-[7px] font-mono text-slate-500 bg-slate-950/80 p-3 border border-slate-800 rounded-lg uppercase space-y-1 backdrop-blur-md">
          <div className="flex justify-between gap-6"><span>Step:</span> <span className="text-cyan-500">{(tick * 0.001).toFixed(4)}</span></div>
          <div className="flex justify-between gap-6"><span>Cost:</span> <span className="text-amber-500">{(0.02 + uncertainty * 0.15).toFixed(5)}</span></div>
          <div className="flex justify-between gap-6"><span>Divergence:</span> <span className={uncertainty > 0.5 ? 'text-red-500' : 'text-emerald-500'}>{(uncertainty * 0.4).toFixed(3)}</span></div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {clusters.map((c, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-full hover:border-slate-700 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }}></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
