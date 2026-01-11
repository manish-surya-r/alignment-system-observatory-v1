
import React, { useState } from 'react';

export const SystemManual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'protocols'>('overview');

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-12 mt-20 mb-32 max-w-6xl mx-auto shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <i className="fas fa-satellite-dish text-[150px] text-cyan-400"></i>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="p-6 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 transform group-hover:rotate-12 transition-transform duration-500">
          <i className="fas fa-book-open text-cyan-400 text-4xl"></i>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">ASO SYSTEM SPECIFICATION</h2>
          <p className="text-[11px] font-black text-slate-500 tracking-[0.4em] uppercase mt-2">v4.2.1 | Field Operations Manual</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 mb-12 border-b border-slate-800 no-scrollbar">
        {(['overview', 'components', 'protocols'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-8 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
              activeTab === tab 
                ? 'text-cyan-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_15px_cyan]"></div>}
          </button>
        ))}
      </div>

      <div className="prose prose-invert max-w-none">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Observatory Architecture Overview</h3>
            <p className="text-base text-slate-400 leading-relaxed">
              The <span className="text-cyan-400 font-bold uppercase tracking-widest">Alignment Systems Observatory</span> is a mission-critical supervision platform. Its primary architecture is built on three pillars: <span className="text-white italic">Real-time Latent Inspection</span>, <span className="text-white italic">Stochastic Drift Detection</span>, and <span className="text-white italic">Hardware-Level Intervention</span>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-colors">
                <i className="fas fa-eye text-cyan-500 text-2xl mb-4"></i>
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-3">Transparency</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">Provides clear visibility into high-dimensional decision logic, rendering the "black box" of LLMs into interpretable geometric projections via UMAP/t-SNE algorithms.</p>
              </div>
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-colors">
                <i className="fas fa-microchip text-amber-500 text-2xl mb-4"></i>
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">Safety</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">Continuous calculation of latent entropy allows for proactive intervention before alignment drift reaches the output layer of the reasoning engine.</p>
              </div>
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-red-500/50 transition-colors">
                <i className="fas fa-lock text-red-500 text-2xl mb-4"></i>
                <h4 className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Control</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">A direct HMI (Human-Machine Interface) that bypasses software abstraction layers for immediate system containment and memory scrubbing.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
            {[
              { id: '01', title: 'SYSTEM DYNAMICS ENGINE', desc: 'A WebGL-powered 3D point cloud representing the current thermal state of the latent model. Jitter intensity maps directly to logical coherence loss.' },
              { id: '02', title: 'LATENT LANDSCAPE', desc: 'High-density N-Space projection. Nodes represent logical clusters. Connections reveal reasoning dependencies and potential semantic drift.' },
              { id: '03', title: 'ARCHITECTURE MAPPING', desc: 'Futuristic schematic of the alignment stack. Visualizes the path from raw user intake through safety guardrails into the core logic nodes.' },
              { id: '04', title: 'LIVE TELEMETRY', desc: 'High-frequency time-series tracking. Monitors system throughput against uncertainty magnitude to detect diverging safety-critical signals.' }
            ].map((comp, i) => (
              <div key={i} className="flex gap-8 p-6 rounded-2xl bg-slate-950/50 border border-slate-800 hover:bg-slate-800/20 transition-all group">
                <span className="text-4xl font-black text-slate-800 font-mono italic group-hover:text-cyan-500 transition-colors">{comp.id}</span>
                <div>
                  <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-2">{comp.title}</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{comp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'protocols' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Observatory Safety Protocols</h3>
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: 'HANDOVER_PROTOCOLS', desc: 'When uncertainty magnitude crosses the 0.65 threshold, the system triggers a MANDATORY HANDOVER. The operator must manually authorize all subsequent logic gate transitions.' },
                { title: 'E-STOP_EXECUTION', desc: 'Emergency Shutdown initiates a hardware-level relay separation and triggers a complete volatile memory scrub of all latent buffers and reasoning caches.' },
                { title: 'DIAGNOSTIC_CADENCE', desc: 'Standard operating procedure requires an adversarial probe injection every 6 hours. This tests the resilience of the constitutional gates against semantic jailbreaking.' },
                { title: 'AUDIT_LOG_INTEGRITY', desc: 'All telemetry and event logs are cryptographically hashed and stored in an immutable ledger to ensure traceability of all alignment interventions.' }
              ].map((p, i) => (
                <div key={i} className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800 group hover:border-cyan-500/30 transition-all flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <i className="fas fa-shield-halved text-cyan-500"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-cyan-500 uppercase tracking-widest mb-2">{p.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-20 p-8 border-t border-slate-800 text-center relative overflow-hidden rounded-b-3xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">End of Documentation</div>
        <p className="text-[11px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-4">ASO_SPEC_V4.2.1 | AUTH: CORE_ALIGNMENT_SUPERVISOR</p>
      </div>
    </div>
  );
};
