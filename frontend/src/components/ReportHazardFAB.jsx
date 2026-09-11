/**
 * MargSetu (मार्गसेतु) - Citizen Floating Action Button (FAB) for Hazard Reporting (Phase 3)
 * Floating radar-pulsing action button anchored on the Citizen dashboard.
 */

import React from 'react';
import { Camera, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportHazardFAB({ onClick, className = "" }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-30 pointer-events-auto ${className}`}
    >
      {/* Outer Glow Pulse Effect */}
      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 opacity-60 blur-md animate-pulse" />

      <button
        onClick={onClick}
        id="report-hazard-fab-btn"
        className="relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-slate-900 text-white font-bold text-xs shadow-2xl border border-slate-700/80 hover:bg-slate-800 transition-all group"
      >
        <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:rotate-12 transition-transform">
          <Camera className="w-3.5 h-3.5" />
        </div>
        
        <span className="tracking-wide">Report Hazard</span>

        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      </button>
    </motion.div>
  );
}
