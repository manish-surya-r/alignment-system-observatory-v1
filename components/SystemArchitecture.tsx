
import React from 'react';
import { DocOverlay } from './DocOverlay';

interface NodeProps {
  label: string;
  status: 'active' | 'warning' | 'idle';
  type: 'core' | 'filter' | 'gate' | 'user';
  subtext?: string;
}

const Node: React.FC<NodeProps> = ({ label, status, type, subtext }) => {
  const statusColors = {
    active: {
      text: 'text-cyan-400',
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/5',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.15)]',
      icon: 'text-cyan-300',
    },
    warning: {
      text: 'text-amber-400',
      border: 'border-amber-500/50',
      bg: 'bg-amber-500/5',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]',
      icon: 'text-amber-300',
    },
    idle: {
      text: 'text-slate-500',
      border: 'border-slate-800',
      bg: 'bg-slate-900/40',
      glow: '',
      icon: 'text-slate-600',
    }
  };

  const icons = {
    core: 'fa-microchip',
    filter: 'fa-shield-halved',
    gate: 'fa-bolt-lightning',
    user: 'fa-user-gear'
  };

  const currentStatus = statusColors[status];

  return (
    <div className={`relative p-5 rounded-2xl border ${currentStatus.border} ${currentStatus.bg} ${currentStatus.glow} backdrop-blur-md flex flex-col items-center justify-center gap-3 min-w-[140px] transition-all duration-500 group hover:scale-105 hover:bg-slate-800/20`}>
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-40 group-hover:opacity-100"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-40 group-hover:opacity-100"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-40 group-hover:opacity-100"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-40 group-hover:opacity-100"></div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-950 border border-slate-800 shadow-inner group-hover:border-cyan-500/50 transition-colors duration-500`}>
        <i className={`fas ${icons[type]} ${currentStatus.icon} text-xl group-hover:scale-110 transition-transform`}></i>
      </div>
      
      <div className="text-center">
        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStatus.text} block`}>{label}</span>
        {subtext && <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter block mt-0.5">{subtext}</span>}
      </div>

      <div className={`flex gap-1 mt-1`}>
        <div className={`w-1 h-1 rounded-full ${status === 'active' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`}></div>
        <div className={`w-1 h-1 rounded-full ${status === 'active' ? 'bg-cyan-500/40 animate-pulse delay-75' : 'bg-slate-700'}`}></div>
      </div>
    </div>
  );
};

const FlowParticles = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
    <defs>
      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
        <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Connection Lines (Desktop) */}
    <g className="hidden lg:block">
      {/* Path 1 */}
      <path d="M 180 250 L 320 250" stroke="rgba(34,211,238,0.1)" strokeWidth="1" fill="none" />
      <circle r="2" fill="#22d3ee" filter="url(#glow)">
        <animateMotion path="M 180 250 L 320 250" dur="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Path 2 */}
      <path d="M 480 250 L 620 250" stroke="rgba(34,211,238,0.1)" strokeWidth="1" fill="none" />
      <circle r="2" fill="#22d3ee" filter="url(#glow)">
        <animateMotion path="M 480 250 L 620 250" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Cross Connections */}
      <path d="M 180 150 Q 250 150, 250 250" stroke="rgba(34,211,238,0.05)" strokeWidth="1" fill="none" />
      <path d="M 180 350 Q 250 350, 250 250" stroke="rgba(34,211,238,0.05)" strokeWidth="1" fill="none" />
    </g>
  </svg>
);

export const SystemArchitecture: React.FC<{ uncertainty: number }> = ({ uncertainty }) => {
  const isHighRisk = uncertainty > 0.6;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.05),transparent)]"></div>
      
      <DocOverlay 
        title="Structural Logic Engine" 
        description="A blueprint of the alignment stack. Data streams move from the Input Layer through serialized Safety Guardrails before processing by the Alignment Core."
        units="Throughput: Op/s | Latency: ms"
      />
      
      <div className="relative z-10 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">System Architecture Mapping</h3>
          <p className="text-[9px] font-mono text-cyan-500/60 mt-1">LOGIC_FLOW_REVISION: 4.2.1-GOLD</p>
        </div>
        <div className="flex gap-4">
          <div className="px-3 py-1 bg-slate-950/80 rounded border border-slate-800 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Active Relay</span>
          </div>
          <div className="px-3 py-1 bg-slate-950/80 rounded border border-slate-800 flex items-center gap-2">
             <span className="text-[9px] font-mono text-slate-500">LATENCY:</span>
             <span className="text-[9px] font-mono text-emerald-400 font-bold">12.4ms</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-4 min-h-[400px]">
        <FlowParticles />

        {/* Column 1: Input / Intake */}
        <div className="flex flex-col gap-10 items-center lg:w-1/4">
          <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-[-20px] bg-slate-950 px-2 relative z-20">Input Layer</div>
          <Node label="User Prompt" status="active" type="user" subtext="Inbound_01" />
          <Node label="Relay Gate" status="active" type="gate" subtext="UDP_Buffer" />
        </div>

        {/* Separator / Connection (Mobile) */}
        <div className="lg:hidden w-px h-12 bg-gradient-to-b from-cyan-500/20 to-transparent"></div>

        {/* Column 2: Guardrails / Filtering */}
        <div className="flex flex-col gap-10 items-center lg:w-1/4">
          <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-[-20px] bg-slate-950 px-2 relative z-20">Security</div>
          <Node 
            label="Safety Filter" 
            status={isHighRisk ? 'warning' : 'active'} 
            type="filter" 
            subtext="L3_Heuristics" 
          />
          <Node label="Constitutional" status="active" type="filter" subtext="Policy_Engine" />
        </div>

        {/* Separator / Connection (Mobile) */}
        <div className="lg:hidden w-px h-12 bg-gradient-to-b from-cyan-500/20 to-transparent"></div>

        {/* Column 3: Processing / Core */}
        <div className="flex flex-col gap-10 items-center lg:w-1/4">
          <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-[-20px] bg-slate-950 px-2 relative z-20">Core Logic</div>
          <Node 
            label="Decision Core" 
            status={isHighRisk ? 'warning' : 'active'} 
            type="core" 
            subtext="Cluster_B" 
          />
          <div className="group relative p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center transition-all hover:border-slate-700">
             <i className="fas fa-microchip text-slate-800 text-lg mb-2 group-hover:text-slate-700"></i>
             <p className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Standby Node<br/>BETA_09</p>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="relative z-10 mt-16 pt-8 border-t border-slate-800/50 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Relay Integrity', val: '99.98%', color: 'text-emerald-500' },
          { label: 'Flow Velocity', val: '1.2 TB/s', color: 'text-cyan-500' },
          { label: 'Node Uptime', val: '42d 12h', color: 'text-slate-400' },
          { label: 'Error Rate', val: isHighRisk ? '0.042%' : '0.001%', color: isHighRisk ? 'text-amber-500' : 'text-emerald-600' }
        ].map((m, i) => (
          <div key={i} className="space-y-1">
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{m.label}</p>
            <p className={`text-xs font-mono font-black ${m.color}`}>{m.val}</p>
          </div>
        ))}
      </div>
      
      {/* Schematic Background Text */}
      <div className="absolute bottom-4 right-8 text-[40px] font-black text-slate-800/10 pointer-events-none select-none uppercase italic tracking-tighter">
        Alignment Stack_V4
      </div>
    </div>
  );
};
