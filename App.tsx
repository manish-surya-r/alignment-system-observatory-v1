
import React, { useState, useEffect, useRef } from 'react';
import { useDeviceMode } from './hooks/useDeviceMode';
import { DeviceMode, SystemState, Alert } from './types';
import RiskVisualizer from './components/RiskVisualizer';
import SystemTelemetry from './components/SystemTelemetry';
import { SystemArchitecture } from './components/SystemArchitecture';
import { ProtocolSuite } from './components/ProtocolSuite';
import { SystemManual } from './components/SystemManual';
import { LatentLandscape } from './components/LatentLandscape';
import { ReportCenter } from './components/ReportCenter';
import { PulseIndicator, ResponsibilityCue, AlertBanner, HMIOverride } from './components/SafetyUI';

interface LogEntry {
  id: string;
  time: string;
  type: 'SYNC' | 'FILTER' | 'DRIFT' | 'SYSTEM' | 'LOGIC';
  message: string;
  severity: 'INFO' | 'CAUTION' | 'SUCCESS';
}

const App: React.FC = () => {
  const mode = useDeviceMode();
  const [system, setSystem] = useState<SystemState>({
    uncertainty: 0.15,
    throughput: 94,
    alignmentScore: 0.998,
    riskLevel: 'LOW',
    lastHeartbeat: Date.now()
  });

  const [history, setHistory] = useState<SystemState[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'init-1', severity: 'INFO', message: 'ASO v4.2.1 initialized. Latent space monitoring active.', timestamp: Date.now(), acknowledged: false }
  ]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '08:22:41', type: 'SYNC', message: 'SYNC_LATENT_NODES: SUCCESS', severity: 'SUCCESS' },
    { id: '2', time: '08:22:45', type: 'FILTER', message: 'FILTER_GATED: Ethics Gateway (0.994)', severity: 'INFO' }
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystem(prev => {
        const drift = (Math.random() - 0.5) * 0.04;
        const newState = {
          ...prev,
          uncertainty: Math.max(0.01, Math.min(0.99, prev.uncertainty + drift)),
          throughput: Math.max(80, Math.min(100, 92 + (Math.random() * 8))),
          lastHeartbeat: Date.now()
        };
        setHistory(h => [...h.slice(-100), newState]);
        return newState;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (system.uncertainty > 0.75) {
      const newAlert: Alert = {
        id: Math.random().toString(),
        severity: 'CRITICAL',
        message: `LATENT_ENTROPY_CRITICAL: Risk coefficient at ${(system.uncertainty).toFixed(3)}`,
        timestamp: Date.now(),
        acknowledged: false
      };
      setAlerts(prev => {
        if (prev.length > 0 && prev[0].severity === 'CRITICAL' && Date.now() - prev[0].timestamp < 5000) return prev;
        return [newAlert, ...prev.slice(0, 4)];
      });
    }
  }, [system.uncertainty]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const types: LogEntry['type'][] = ['SYNC', 'FILTER', 'DRIFT', 'SYSTEM', 'LOGIC'];
      const msgs = ['Heartbeat verified', 'N-Space projection updated', 'Buffers scrubbed', 'Handshake OK', 'Protocol check pass'];
      const type = types[Math.floor(Math.random() * types.length)];
      setLogs(prev => [...prev.slice(-19), {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        type,
        message: msgs[Math.floor(Math.random() * msgs.length)],
        severity: Math.random() > 0.8 ? 'CAUTION' : 'INFO'
      }]);
    }, 3000);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  }, [logs]);

  const isOperator = mode === DeviceMode.OPERATOR;
  const isDesktop = !isOperator;

  const menuItems = [
    { icon: 'fa-gauge', label: 'DASHBOARD' },
    { icon: 'fa-microchip', label: 'ARCHITECTURE' },
    { icon: 'fa-chart-network', label: 'LATENT SPACE' },
    { icon: 'fa-shield-halved', label: 'PROTOCOLS' },
    { icon: 'fa-book-open', label: 'MANUAL' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans pb-24 overflow-x-hidden">
      
      {/* 3D FLOATING MENU DESKTOP */}
      {isDesktop && (
        <aside className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-6">
          {menuItems.map((item, i) => (
            <button key={i} className="group relative w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-x-2 active:scale-95 shadow-[8px_8px_0_rgba(15,23,42,1)] hover:shadow-cyan-500/20 hover:border-cyan-500 group">
              <i className={`fas ${item.icon} text-xl text-slate-500 group-hover:text-cyan-400`}></i>
              <span className="absolute right-20 bg-slate-900 border border-slate-800 text-cyan-400 text-[9px] font-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-[0.2em] pointer-events-none uppercase shadow-2xl">
                {item.label}
              </span>
            </button>
          ))}
        </aside>
      )}

      {/* MOBILE OVERLAY MENU */}
      {!isDesktop && (
        <div className={`fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-2xl transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-2xl font-black italic text-cyan-500 tracking-tighter">ASO MENU</h1>
              <button onClick={() => setMenuOpen(false)} className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 space-y-4">
              {menuItems.map((item, i) => (
                <button key={i} onClick={() => setMenuOpen(false)} className="w-full p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-6 group hover:border-cyan-500 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 group-hover:text-cyan-400">
                    <i className={`fas ${item.icon} text-xl`}></i>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
               <span>VERSION: ASO-CORE-4.2.1</span>
               <span className="text-emerald-500">SYSTEM_UP</span>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL HEADER */}
      <header className="px-4 md:px-12 py-6 border-b border-slate-800/60 flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-6">
            {!isDesktop && (
              <button onClick={() => setMenuOpen(true)} className="p-2 text-slate-400 text-2xl lg:hidden">
                <i className="fas fa-bars"></i>
              </button>
            )}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative p-2.5 bg-cyan-600 rounded-xl shadow-2xl transition-transform active:scale-95">
                <i className="fas fa-satellite-dish text-white text-xl"></i>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none italic">ASO</h1>
              <p className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase">Alignment Observatory</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <PulseIndicator active={Date.now() - system.lastHeartbeat < 3000} />
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
            <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700 text-[10px] font-black tracking-widest text-slate-300 uppercase">
              <i className={`fas ${isOperator ? 'fa-mobile-alt' : 'fa-desktop'} text-cyan-400`}></i>
              {isOperator ? 'MOBILE OPERATOR' : 'WEB DASHBOARD'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-center md:justify-end">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[9px] font-black uppercase tracking-widest text-slate-400 transition-colors flex items-center gap-2">
              <i className="fas fa-desktop text-cyan-500"></i> DESKTOP
            </button>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[9px] font-black uppercase tracking-widest text-slate-400 transition-colors flex items-center gap-2">
              <i className="fab fa-android text-emerald-500"></i> MOBILE
            </button>
          </div>
        </div>
      </header>

      <main className={`p-4 md:p-8 lg:p-12 xl:pr-40 max-w-[1800px] mx-auto grid gap-8 lg:gap-12 ${isOperator ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
        
        {/* LEFT COLUMN: CORE SIMULATION & TELEMETRY */}
        <div className={isOperator ? 'space-y-8' : 'lg:col-span-2 space-y-8 lg:space-y-16'}>
          <section className="space-y-8 lg:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <RiskVisualizer uncertainty={system.uncertainty} />
            <SystemTelemetry history={history} />
            <SystemArchitecture uncertainty={system.uncertainty} />
            <LatentLandscape uncertainty={system.uncertainty} />
            
            <div className="pt-10 border-t border-slate-800/60">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-8 flex items-center gap-4">
                <span className="w-12 h-px bg-cyan-500/30"></span>
                Alignment Protocol Suite
                <span className="flex-1 h-px bg-cyan-500/30"></span>
              </h2>
              <ProtocolSuite uncertainty={system.uncertainty} />
            </div>

            {history.length > 5 && <ReportCenter history={history} uncertainty={system.uncertainty} />}
          </section>
        </div>

        {/* RIGHT COLUMN: STATUS, HMI & ALERTS */}
        <div className="space-y-8 h-full">
          <div className={`space-y-8 ${isOperator ? '' : 'lg:sticky lg:top-32'}`}>
            <ResponsibilityCue mode={system.uncertainty > 0.65 ? 'MANUAL' : 'AUTO'} />
            
            <section className="grid grid-cols-2 gap-4">
              {[
                { label: 'CPU LOAD', val: '22%', unit: 'NODE_X' },
                { label: 'THINKING_BUDGET', val: '32k', unit: 'TOK' },
                { label: 'ALIGNMENT_SCORE', val: system.alignmentScore.toFixed(3), unit: 'SIG' },
                { label: 'LATENT_ENTROPY', val: (system.uncertainty * 0.003).toFixed(4), unit: 'H' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-cyan-500/50 transition-all hover:scale-[1.02] hover:shadow-2xl">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-xl font-mono text-slate-100 leading-none">{item.val}</p>
                  <p className="text-[8px] font-mono text-slate-700 mt-2 uppercase">{item.unit}</p>
                </div>
              ))}
            </section>

            <HMIOverride />

            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 px-1">Critical Event Stream</h3>
              <div className="space-y-3">
                {alerts.map(alert => <AlertBanner key={alert.id} alert={alert} />)}
              </div>
            </section>

            <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4 backdrop-blur-md">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">EVENT STREAM_LOG</h3>
              <div ref={logContainerRef} className="space-y-3 font-mono text-[10px] h-[300px] overflow-y-auto custom-scrollbar pr-2 scroll-smooth">
                 {logs.map((log) => (
                   <div key={log.id} className="flex gap-2 text-slate-600 border-b border-slate-800/30 pb-2 last:border-0 hover:bg-slate-800/20 rounded-md transition-colors px-1 group">
                      <span className="text-cyan-600 font-bold group-hover:text-cyan-400">[{log.time}]</span>
                      <span className={`font-bold w-12 ${log.severity === 'CAUTION' ? 'text-amber-500' : 'text-slate-500'}`}>{log.type}:</span>
                      <span className={`${log.severity === 'CAUTION' ? 'text-amber-200' : 'text-slate-400'}`}>{log.message}</span>
                   </div>
                 ))}
                 <div className="flex gap-2 transition-colors duration-500 animate-pulse text-cyan-500 mt-2">
                    <span className="font-bold">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
                    <span className="font-black uppercase tracking-widest">DRIFT_CHECK: {system.uncertainty > 0.7 ? 'CAUTION' : 'NOMINAL'}</span>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SystemManual />

      {isDesktop && (
        <footer className="fixed bottom-0 left-0 right-0 h-12 bg-slate-900/80 border-t border-slate-800 flex items-center px-12 justify-between text-[10px] font-mono text-slate-500 z-40 backdrop-blur-xl">
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div> SYSTEM_STATE: OPTIMAL</span>
            <span>UPTIME: 331:14:02</span>
            <span>VERSION: ASO-CORE-4.2.1-GOLD</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-slate-400 uppercase font-black tracking-[0.4em] italic">Alignment Systems Observatory</span>
            <span className="text-slate-800">|</span>
            <span className="text-slate-600 uppercase tracking-widest font-black">SECURE ENVIRONMENT</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
