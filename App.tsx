
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

/**
 * ErrorBoundary Component
 * Fixed typing to resolve "Property 'state'/'props' does not exist" and children requirement errors.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ASO UI Crash Intercepted:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8 text-center font-sans">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
            </div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Critical System Failure</h1>
            <p className="text-slate-500 text-sm font-mono leading-relaxed">
              An unrecoverable error occurred in the ASO UI layer. Intercepting to prevent system-wide cascade.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20"
            >
              Reload Terminal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Main Application Component
 */
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
      setLogs(prev => {
        const newLog: LogEntry = {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          type,
          message: msgs[Math.floor(Math.random() * msgs.length)],
          severity: Math.random() > 0.8 ? 'CAUTION' : 'INFO'
        };
        return [...prev.slice(-19), newLog];
      });
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
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans pb-24 overflow-x-hidden">
        
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-[110] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20">
              <i className="fas fa-eye text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">ASO OBSERVATORY</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">ALIGNMENT SYSTEMS V4.2.1</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <PulseIndicator active={Date.now() - system.lastHeartbeat < 2000} />
            <div className="hidden md:block h-8 w-px bg-slate-800"></div>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Device Mode</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{mode}</span>
            </div>
          </div>
        </header>

        {/* 3D FLOATING MENU DESKTOP */}
        {isDesktop && (
          <aside className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-6">
            {menuItems.map((item, i) => (
              <button key={i} className="group relative w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-x-2 active:scale-95 shadow-[8px_8px_0_rgba(15,23,42,1)] hover:shadow-cyan-500/20 hover:border-cyan-500 group">
                <i className={`fas ${item.icon} text-xl text-slate-500 group-hover:text-cyan-400`}></i>
                <span className="absolute right-20 bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
                  {item.label}
                </span>
              </button>
            ))}
          </aside>
        )}

        <main className="container mx-auto px-4 pt-32 space-y-8 max-w-7xl">
          
          {/* TOP ALERTS SECTION */}
          <div className="space-y-4">
            {alerts.map(alert => (
              <AlertBanner key={alert.id} alert={alert} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* MAIN VISUALIZER COLUMN */}
            <div className="lg:col-span-8 space-y-8">
              <RiskVisualizer uncertainty={system.uncertainty} />
              <SystemTelemetry history={history} />
              <SystemArchitecture uncertainty={system.uncertainty} />
              <LatentLandscape uncertainty={system.uncertainty} />
            </div>

            {/* SIDEBAR CONTROLS COLUMN */}
            <div className="lg:col-span-4 space-y-8">
              <ResponsibilityCue mode={system.uncertainty > 0.65 ? 'MANUAL' : 'AUTO'} />
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Live System Log</h3>
                <div 
                  ref={logContainerRef}
                  className="h-[400px] overflow-y-auto pr-2 space-y-3 font-mono text-[10px] scroll-smooth custom-scrollbar"
                >
                  {logs.map(log => (
                    <div key={log.id} className="flex gap-4 border-b border-slate-800/50 pb-2 group hover:bg-slate-800/20 p-1 rounded transition-colors">
                      <span className="text-slate-600 shrink-0">{log.time}</span>
                      <span className={`font-black shrink-0 ${
                        log.severity === 'CAUTION' ? 'text-amber-500' : 'text-cyan-600'
                      }`}>[{log.type}]</span>
                      <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              <ProtocolSuite uncertainty={system.uncertainty} />
              <HMIOverride />
            </div>
          </div>

          <ReportCenter history={history} uncertainty={system.uncertainty} />
          <SystemManual />
        </main>

        {/* MOBILE NAVIGATION */}
        {isOperator && (
          <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 p-4 flex justify-around items-center z-[110]">
            {menuItems.slice(0, 4).map((item, i) => (
              <button key={i} className="flex flex-col items-center gap-1">
                <i className={`fas ${item.icon} text-lg text-slate-500`}></i>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">{item.label}</span>
              </button>
            ))}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-900/40 -translate-y-4 border-4 border-slate-950"
            >
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-plus'}`}></i>
            </button>
          </nav>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
