
import React, { useState } from 'react';
import { DocOverlay } from './DocOverlay';

/**
 * ProtocolSuite Component
 * This section implements the active intervention tools of the ASO.
 * Features:
 * 1. Diagnostic Runner: Simulates safety probe execution.
 * 2. Constitutional Override: UI for adjusting alignment constraints.
 * 3. Event Log: High-fidelity system audit stream.
 */
export const ProtocolSuite: React.FC<{ uncertainty: number }> = ({ uncertainty }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [alignmentStrength, setAlignmentStrength] = useState(0.85);

  const runDiagnostic = () => {
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Alignment Control Panel */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative">
          <DocOverlay 
            title="Alignment Control Panel" 
            description="Allows operators to dynamically scale the influence of the Constitution on model outputs. Higher strength enforces stricter adherence to safety guidelines but may increase latency or reduce output variance."
            units="Constraint Multiplier: 0.0 - 2.0x"
          />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Alignment Control</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-2">
                <span className="text-slate-400">CONSTITUTIONAL STRENGTH</span>
                <span className="text-cyan-400">{(alignmentStrength * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={alignmentStrength}
                onChange={(e) => setAlignmentStrength(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Safety Margin</p>
                <p className="text-sm font-mono text-emerald-400">+{(alignmentStrength * 0.4).toFixed(3)}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Drift Tolerance</p>
                <p className="text-sm font-mono text-amber-400">{(1.1 - alignmentStrength).toFixed(2)}ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Laboratory */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative">
          <DocOverlay 
            title="Diagnostic Laboratory" 
            description="Execute non-destructive safety probes. These probes inject 'adversarial latents' into the core to test the robustness of current alignment filters."
            units="Probe Intensity: Measured in Jitter Units (J)"
          />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">System Diagnostics</h3>
          
          <div className="flex flex-col h-full justify-between gap-4">
            <div className={`flex-1 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center p-4 transition-all ${isTesting ? 'bg-cyan-500/5 border-cyan-500/30' : ''}`}>
              {isTesting ? (
                <>
                  <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase">Injecting Adversarial Probe...</p>
                </>
              ) : (
                <>
                  <i className="fas fa-vial text-slate-700 text-2xl mb-2"></i>
                  <p className="text-[10px] font-mono text-slate-600 uppercase">Lab Ready for Injection</p>
                </>
              )}
            </div>
            
            <button 
              onClick={runDiagnostic}
              disabled={isTesting}
              className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                isTesting ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-950 hover:bg-white active:scale-95 shadow-lg shadow-white/5'
              }`}
            >
              Initialize Safety Probe
            </button>
          </div>
        </div>
      </div>

      {/* Constitutional Audit Log */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative">
        <DocOverlay 
          title="Constitutional Audit Log" 
          description="A real-time stream of the model's internal self-correction steps. This shows how the system filters potential violations before they reach the output stage."
          units="Audit Rate: Entries/min"
        />
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Constitutional Audit Log</h3>
        <div className="h-48 overflow-y-auto pr-2 space-y-2 font-mono text-[10px] custom-scrollbar">
          {[
            { tag: 'AUDIT', msg: 'Checking intent vector against Principle 4 (Non-Harm)...', status: 'PASS' },
            { tag: 'FILTER', msg: 'Suppressed latent deviation in layer 42 (0.003 variance)', status: 'ACTIVE' },
            { tag: 'AUDIT', msg: 'Verifying transparency requirements for downstream nodes...', status: 'PASS' },
            { tag: 'MONITOR', msg: 'Detected slight uptick in semantic ambiguity. Increasing probe frequency.', status: 'INFO' },
            { tag: 'AUDIT', msg: 'Alignment handshake complete with external relay.', status: 'OK' },
            { tag: 'SECURITY', msg: 'Memory scrubbing initiated for cleared latent buffers.', status: 'DONE' },
          ].map((log, i) => (
            <div key={i} className="flex gap-4 p-2 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 rounded transition-colors group">
              <span className={`w-16 font-black ${log.status === 'PASS' || log.status === 'OK' ? 'text-emerald-500' : 'text-cyan-500'}`}>{log.tag}</span>
              <span className="flex-1 text-slate-400 group-hover:text-slate-300">{log.msg}</span>
              <span className="text-slate-600 font-bold uppercase">{log.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
