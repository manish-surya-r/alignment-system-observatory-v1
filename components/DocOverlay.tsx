
import React, { useState } from 'react';

interface DocOverlayProps {
  title: string;
  description: string;
  units?: string;
}

export const DocOverlay: React.FC<DocOverlayProps> = ({ title, description, units }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-3 right-3 z-30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${
          isOpen ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
        }`}
      >
        {isOpen ? 'CLOSE DOCS' : 'DOCS'}
      </button>
      
      {isOpen && (
        <div className="absolute top-8 right-0 w-64 bg-slate-900 border border-slate-700 shadow-2xl rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
            {title}
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            {description}
          </p>
          {units && (
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Standard Units:</span>
              <p className="text-[10px] font-mono text-emerald-400">{units}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
