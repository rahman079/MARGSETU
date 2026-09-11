/**
 * MargSetu (मार्गसेतु) - Offline Sync Queue UI Component (Phase 4)
 * Displays locally cached hazard reports waiting for cellular connectivity,
 * with real-time sync progress animations and manual flush triggers.
 */

import React from 'react';
import { useRoads } from '../context/RoadContext';
import { 
  Database, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Clock, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineSyncQueue({ className = "" }) {
  const { 
    offlineQueue, 
    isSyncingOfflineQueue, 
    flushOfflineQueue, 
    isOnline,
    refreshOfflineQueue 
  } = useRoads();

  if (offlineQueue.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 space-y-3 font-sans ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
              <span>Offline Hazard Queue</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                {offlineQueue.length}
              </span>
            </h4>
            <p className="text-[10px] text-amber-700 font-medium">
              IndexedDB Store &amp; Forward Active
            </p>
          </div>
        </div>

        {/* Sync Button */}
        <button
          onClick={flushOfflineQueue}
          disabled={isSyncingOfflineQueue || !isOnline}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
            isOnline
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOfflineQueue ? 'animate-spin' : ''}`} />
          <span>{isSyncingOfflineQueue ? 'Syncing...' : (isOnline ? 'Sync Now' : 'Awaiting Signal')}</span>
        </button>
      </div>

      {/* Queue Items List */}
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
        {offlineQueue.map(item => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-white/90 border border-amber-200/80 flex items-center justify-between gap-2 text-xs shadow-2xs"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 truncate">
                  {item.incidentType}
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {item.latitude}° N, {item.longitude}° E
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {item.nearestHighway || 'Mountain Highway Corridor'}
              </p>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex-shrink-0">
              Cached
            </span>
          </div>
        ))}
      </div>

      {/* Sync Status Banner */}
      <div className="pt-1 text-[10px] flex items-center justify-between text-amber-800">
        <span className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="w-3 h-3 text-emerald-600" />
          ) : (
            <WifiOff className="w-3 h-3 text-amber-600" />
          )}
          <span>{isOnline ? 'Online - Auto-syncing queue...' : 'Dead-zone detected. Reports queued.'}</span>
        </span>
        <span className="font-medium text-slate-400">
          SMS Dispatch: Sent
        </span>
      </div>
    </motion.div>
  );
}
