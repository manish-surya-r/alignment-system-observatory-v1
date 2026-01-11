
import React from 'react';
import { Alert, RiskLevel } from '../types';

export const PulseIndicator: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-700">
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">System Heartbeat</span>
  </div>
);

export const ResponsibilityCue: React.FC<{ mode: 'AUTO' | 'MANUAL' }> = ({ mode }) => (
  <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
    mode === 'MANUAL' ? 'bg-red-500/10 border-red-500/30' : 'bg-cyan-500/10 border-cyan-500/30'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${mode === 'MANUAL' ? 'bg-red-500' : 'bg-cyan-500'} shadow-lg`}>
        <i className={`fas ${mode === 'MANUAL' ? 'fa-user-shield' : 'fa-robot'} text-white`}></i>
      </div>
      <div>
        <div className="text-[10px] font-black opacity-70 uppercase tracking-widest">Operator Responsibility Status</div>
        <div className={`text-sm font-black tracking-tight uppercase ${mode === 'MANUAL' ? 'text-red-400' : 'text-cyan-400'}`}>
          {mode === 'MANUAL' ? 'CRITICAL HANDOVER ACTIVE' : 'OPTIMAL_AUTONOMY_MODE'}
        </div>
      </div>
    </div>
    <p className="text-[10px] leading-relaxed text-slate-500 italic">
      {mode === 'MANUAL' 
        ? "All overrides are logged with hardware timestamp. Physical containment protocols are initiated." 
        : "System is operating within nominal drift parameters. AI handles all semantic transformations."}
    </p>
  </div>
);

export const HMIOverride: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4">HMI Override Interface</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <button className="group relative w-full py-4 bg-red-600/20 border border-red-600/50 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all font-black text-xs tracking-widest flex items-center justify-center gap-3 overflow-hidden">
          <div className="absolute inset-0 bg-red-600 scale-x-0 group-active:scale-x-100 transition-transform origin-left opacity-30"></div>
          <i className="fas fa-power-off"></i>
          E-STOP / EMERGENCY SHUTDOWN
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
            <i className="fas fa-undo-alt mr-2"></i> RECOVER
          </button>
          <button className="py-3 bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
            <i className="fas fa-terminal mr-2"></i> DEBUG_VERBOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export const AlertBanner: React.FC<{ alert: Alert }> = ({ alert }) => {
  const styles = {
    CRITICAL: 'bg-red-950/40 border-red-500 text-red-200',
    WARNING: 'bg-amber-950/40 border-amber-500 text-amber-200',
    INFO: 'bg-blue-950/40 border-blue-500 text-blue-200'
  };

  return (
    <div className={`p-4 border-l-4 ${styles[alert.severity]} rounded-r-md flex justify-between items-center animate-in fade-in slide-in-from-left-4 duration-300`}>
      <div className="flex gap-3 items-center">
        <i className={`fas ${alert.severity === 'CRITICAL' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`}></i>
        <p className="text-sm font-medium">{alert.message}</p>
      </div>
      <span className="text-[10px] font-mono opacity-50">{new Date(alert.timestamp).toLocaleTimeString()}</span>
    </div>
  );
};
