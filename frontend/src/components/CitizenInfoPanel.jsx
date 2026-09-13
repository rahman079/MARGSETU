/**
 * MargSetu (मार्गसेतु) - Citizen Highway Advisory, Journey Panel & Offline Queue (Phase 1, 2, 3, & 4)
 * Floating frosted-glass panel with tabbed navigation, dynamic routing, and IndexedDB Store & Forward sync queue.
 * Responsive for both desktop sidebar and mobile bottom-sheet integration.
 */

import React, { useState } from 'react';
import { useRoads } from '../context/RoadContext';
import JourneyPlanner from './JourneyPlanner';
import OfflineSyncQueue from './OfflineSyncQueue';
import { 
  Car, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  ShieldCheck, 
  Info,
  Navigation,
  ListFilter,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function CitizenInfoPanel({ className = "", isMobile = false }) {
  const { roads, selectedRoadId, setSelectedRoadId, lastUpdated, syncStatus, isOnline, offlineQueue } = useRoads();
  const [activeTab, setActiveTab] = useState('planner'); // 'planner' | 'highways'

  return (
    <aside className={`${
      isMobile 
        ? 'w-full flex flex-col gap-3 font-sans' 
        : `bg-white/92 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-glass-hover flex flex-col gap-3 font-sans max-h-[calc(100vh-100px)] ${className}`
    }`}>
      
      {/* 1. Header with Live Status Indicator (Shown on desktop or mobile) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200/80 flex-shrink-0">
            <img 
              src="/logo.svg" 
              alt="MargSetu Logo" 
              className="w-full h-full object-contain" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/favicon.svg';
              }}
            />
          </div>
          <div>
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight flex items-center gap-1.5">
              <span>MargSetu Navigator</span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                v4.0
              </span>
            </h2>
            <p className="text-[10px] font-medium text-slate-500">
              Real-Time Dynamic Routing &amp; Sentinel GIS
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-xs ${
          isOnline
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
            : 'bg-amber-50 text-amber-800 border-amber-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>{isOnline ? 'Govt Live Sync' : 'Offline / SMS'}</span>
        </div>
      </div>

      {/* Feature C: Phase 4 Offline Sync Queue Card (Appears if offline or pending items) */}
      <OfflineSyncQueue />

      {/* 2. Navigation Mode Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'planner'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Journey Planner</span>
        </button>

        <button
          onClick={() => setActiveTab('highways')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'highways'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>All Corridors ({roads.length})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      <div className="overflow-y-auto pr-1 flex-1 space-y-3 max-h-[50vh] sm:max-h-none">
        {activeTab === 'planner' ? (
          /* Journey Planner with Detour Logic and Delay Impact (Phase 2) */
          <JourneyPlanner />
        ) : (
          /* Corridor Cards List (Phase 1) */
          <div className="space-y-2.5">
            {roads.map(road => {
              const isSelected = selectedRoadId === road.id;

              let statusBadge = {
                bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
                text: 'Safe & Clear',
                ringColor: 'ring-emerald-500/20'
              };

              if (road.status === 'warning') {
                statusBadge = {
                  bg: 'bg-amber-50 border-amber-200 text-amber-700',
                  icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
                  text: 'Hazard Warning',
                  ringColor: 'ring-amber-500/20'
                };
              } else if (road.status === 'blocked') {
                statusBadge = {
                  bg: 'bg-rose-50 border-rose-200 text-rose-700',
                  icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
                  text: 'Road Closed',
                  ringColor: 'ring-rose-500/20'
                };
              }

              return (
                <div
                  key={road.id}
                  onClick={() => setSelectedRoadId(road.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? `bg-slate-50 border-slate-400 shadow-sm ring-2 ${statusBadge.ringColor}` 
                      : 'bg-white/80 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {road.highway_code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {road.state}
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                      {statusBadge.icon}
                      <span>{statusBadge.text}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-800 mb-1">
                    {road.road_name}
                  </h3>
                  
                  <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{road.origin} ➔ {road.destination} ({road.length_km} km)</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[10px] text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800">Ground Advisory: </span>
                    {road.hazard_notes}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>{isOnline ? 'Online Mesh Active' : 'Offline Mode'}</span>
        </div>
        <span>Sync: {lastUpdated.toLocaleTimeString()}</span>
      </div>

    </aside>
  );
}
