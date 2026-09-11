import React from 'react';
import { useRoads } from '../context/RoadContext';

export default function FloatingLegend({ className = "" }) {
  const { stats } = useRoads();

  return (
    <div className={`bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-glass ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          Highway Status Legend
        </span>
        <span className="text-[10px] font-bold text-slate-400">
          3 Monitored Corridors
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Clear */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/80">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-xs font-bold text-emerald-800">Clear ({stats.clear})</span>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200/80">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span className="text-xs font-bold text-amber-800">Warning ({stats.warning})</span>
        </div>

        {/* Blocked */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-50/80 border border-rose-200/80">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span className="text-xs font-bold text-rose-800">Blocked ({stats.blocked})</span>
        </div>
      </div>
    </div>
  );
}
