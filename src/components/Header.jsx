/**
 * MargSetu (मार्गसेतु) - Header Navigation & Real-Time Network Sentinel (Phase 1, 2, 3, & 4)
 * Features animated Network Status Indicator (Live / Offline Sentinel Mode),
 * offline simulation toggle for evaluators, and portal navigation.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRoads } from '../context/RoadContext';
import { 
  Shield, 
  Car, 
  Navigation, 
  Radio, 
  Wifi, 
  WifiOff, 
  Zap, 
  Layers,
  Inbox
} from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const { isOnline, isSimulatedOffline, toggleOfflineSimulation, offlineQueue } = useRoads();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200/80 transition-transform group-hover:scale-105">
            <img src="/logo.svg" alt="MargSetu Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                MargSetu
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                v4.0 PWA
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 hidden md:block">
              North Eastern Regional Highway Sentinel
            </p>
          </div>
        </Link>

        {/* Feature A: Network Status Indicator & Offline Simulator */}
        <div className="flex items-center gap-2">
          
          {/* Animated Network Indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-xs'
              : 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs animate-pulse'
          }`}>
            <span className="relative flex h-2 w-2">
              {isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </>
              )}
            </span>

            {isOnline ? (
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-600 hidden sm:inline" />
                <span className="hidden xs:inline">Live Connected</span>
                <span className="xs:hidden">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-amber-600 hidden sm:inline" />
                <span>Offline / SMS Mode</span>
              </div>
            )}

            {offlineQueue.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[9px] font-black" title="Pending Offline Reports">
                {offlineQueue.length} Queued
              </span>
            )}
          </div>

          {/* Quick Evaluator Toggle for Offline Simulation */}
          <button
            onClick={toggleOfflineSimulation}
            id="network-simulator-btn"
            title="Simulate Remote Mountain Dead Zone (Zero Internet)"
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1 shadow-xs ${
              isSimulatedOffline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">
              {isSimulatedOffline ? 'Restore Network' : 'Simulate Offline'}
            </span>
            <span className="sm:hidden">
              {isSimulatedOffline ? 'Online' : 'Offline'}
            </span>
          </button>

        </div>

        {/* Navigation Portals */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <Link
            to="/citizen"
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              path === '/citizen'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Citizen</span>
          </Link>

          <Link
            to="/govt"
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              path === '/govt'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Govt</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}
