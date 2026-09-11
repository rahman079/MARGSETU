/**
 * MargSetu (मार्गसेतु) - Citizen Journey Planner & Automated Safety Routing Engine
 * Features:
 * - NER Logistics Corridor Selection (NH-6, NH-13, NH-8, NH-2)
 * - Dynamic Origin & Destination Selectors with Auto-Population
 * - Automated Red Zone vs Green Zone Safety Evaluation
 * - Instant Detour Synthesis with Delay Time & Topography Analysis
 * - Evaluator Simulation Trigger for Red Zone Roadblocks
 */

import React, { useState, useEffect } from 'react';
import { useRoads } from '../context/RoadContext';
import { NER_CORRIDORS, formatDuration } from '../data/routeCorridors';
import { calculateRoute } from '../services/routingService';
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  Info, 
  CheckCircle2, 
  SlidersHorizontal, 
  Mountain, 
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JourneyPlanner() {
  const { 
    roads, 
    activeCorridorId, 
    setActiveCorridorId, 
    isJourneyActive, 
    setIsJourneyActive, 
    toggleActiveCorridorBlockage,
    routeVersion
  } = useRoads();

  const [routeData, setRouteData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Active corridor
  const activeCorridor = NER_CORRIDORS.find(c => c.id === activeCorridorId) || NER_CORRIDORS[0];

  // Recalculate route whenever road status, active corridor, or route version updates
  useEffect(() => {
    let isMounted = true;
    const compute = async () => {
      setIsCalculating(true);
      const res = await calculateRoute({
        corridorId: activeCorridorId,
        roads
      });
      if (isMounted) {
        setRouteData(res);
        setIsCalculating(false);
      }
    };
    compute();

    return () => {
      isMounted = false;
    };
  }, [activeCorridorId, roads, routeVersion]);

  // Handler when user picks a logistics corridor from the dropdown
  const handleCorridorChange = (e) => {
    const newCorridorId = e.target.value;
    setActiveCorridorId(newCorridorId);
    setIsJourneyActive(true);
  };

  // Handler when user picks an origin from the select field
  const handleOriginChange = (e) => {
    const selectedOriginName = e.target.value;
    const matching = NER_CORRIDORS.find(c => c.origin.name === selectedOriginName);
    if (matching) {
      setActiveCorridorId(matching.id);
      setIsJourneyActive(true);
    }
  };

  // Handler when user picks a destination from the select field
  const handleDestinationChange = (e) => {
    const selectedDestName = e.target.value;
    const matching = NER_CORRIDORS.find(c => c.destination.name === selectedDestName);
    if (matching) {
      setActiveCorridorId(matching.id);
      setIsJourneyActive(true);
    }
  };

  // Swap / Cycle corridor
  const handleSwapPoints = () => {
    const currentIndex = NER_CORRIDORS.findIndex(c => c.id === activeCorridorId);
    const nextIndex = (currentIndex + 1) % NER_CORRIDORS.length;
    setActiveCorridorId(NER_CORRIDORS[nextIndex].id);
    setIsJourneyActive(true);
  };

  const handleStartJourney = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsJourneyActive(true);
      setIsCalculating(false);
    }, 350);
  };

  return (
    <div className="space-y-3.5 font-sans text-slate-800">
      
      {/* 1. Origin, Destination & Logistics Corridor Selector Card */}
      <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3 shadow-xs">
        
        {/* A. Select Logistics Corridor Dropdown */}
        <div>
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
            Select Logistics Corridor:
          </label>
          <div className="relative">
            <select
              value={activeCorridorId}
              onChange={handleCorridorChange}
              className="w-full text-xs font-bold py-2.5 px-3 pr-8 rounded-xl bg-white border border-slate-300/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 shadow-xs appearance-none cursor-pointer"
            >
              {NER_CORRIDORS.map(corridor => (
                <option key={corridor.id} value={corridor.id}>
                  {corridor.highwayCode}: {corridor.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* B. Start Point (Origin) & Destination (End Point) Select Fields */}
        <div className="space-y-2 relative pt-1">
          {/* Vertical Connecting Dashed Line */}
          <div className="absolute left-4 top-7 bottom-7 w-0.5 border-l-2 border-dashed border-indigo-200 pointer-events-none" />

          {/* Start Point (Origin) Field */}
          <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block leading-none mb-0.5">
                Start Point (Origin)
              </label>
              <select
                value={activeCorridor.origin.name}
                onChange={handleOriginChange}
                className="w-full text-xs font-bold bg-transparent text-slate-900 border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
              >
                {NER_CORRIDORS.map(c => (
                  <option key={c.id} value={c.origin.name}>
                    {c.origin.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button In-Between */}
          <div className="flex justify-end -my-1 pr-3 relative z-10">
            <button
              type="button"
              onClick={handleSwapPoints}
              title="Switch Corridor / Reverse Route"
              className="p-1 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-indigo-600 shadow-2xs transition-all active:rotate-180"
            >
              <ArrowRightLeft className="w-3 h-3" />
            </button>
          </div>

          {/* Destination (End Point) Field */}
          <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block leading-none mb-0.5">
                Destination (End Point)
              </label>
              <select
                value={activeCorridor.destination.name}
                onChange={handleDestinationChange}
                className="w-full text-xs font-bold bg-transparent text-slate-900 border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
              >
                {NER_CORRIDORS.map(c => (
                  <option key={c.id} value={c.destination.name}>
                    {c.destination.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* C. Action Buttons: Start Journey & Simulation Toggle */}
        <div className="pt-1 flex gap-2">
          <button
            onClick={handleStartJourney}
            disabled={isCalculating}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Evaluating Safety...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isJourneyActive ? 'Recalculate Route' : 'Start Journey'}</span>
              </>
            )}
          </button>

          {/* Evaluator Roadblock Simulator Button */}
          <button
            onClick={toggleActiveCorridorBlockage}
            title="Simulate Red Zone Roadblock or Clear Highway for Evaluators"
            className={`px-3 py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 shadow-2xs ${
              routeData?.isBlocked
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {routeData?.isBlocked ? 'Clear Zone' : 'Simulate Red Zone'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Automated Safety Evaluation Badges (Green Zone vs Red Zone) */}
      <AnimatePresence mode="wait">
        {routeData && (
          <motion.div
            key={routeData.isBlocked ? 'blocked' : 'safe'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {routeData.isBlocked ? (
              /* Red Zone Blocked Alert Badge with Auto-Reroute */
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white shadow-lg shadow-rose-500/25 border border-rose-400 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs tracking-tight">
                        Red Zone Detected &bull; Safe-Zone Active
                      </h4>
                      <p className="text-[11px] text-rose-100 font-medium">
                        Primary route blocked. Automatically redirected to safest detour.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-400 text-slate-900 uppercase shadow-xs">
                    Auto-Rerouted
                  </span>
                </div>

                <div className="text-[11px] bg-rose-800/60 p-2.5 rounded-xl border border-rose-400/50 text-rose-50 leading-snug">
                  <div><strong>Obstruction:</strong> {routeData.hazardInfo?.locationName}</div>
                  <div className="text-[10px] text-rose-200 mt-0.5">
                    <strong>Cause:</strong> {routeData.hazardInfo?.hazardType}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold bg-white/15 px-2.5 py-1.5 rounded-lg">
                  <span>Auto-Redirected Via:</span>
                  <span className="text-cyan-200 font-bold text-[11px] truncate max-w-[180px]">
                    {(activeCorridor.safeAlternateRoute || activeCorridor.detourRoute)?.title}
                  </span>
                </div>
              </div>
            ) : (
              /* Green Zone Safe Success Badge */
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-emerald-900 leading-tight">
                      Safest Route Active.
                    </h4>
                    <p className="text-[10px] font-medium text-emerald-700 mt-0.5">
                      Direct {activeCorridor.highwayCode} Expressway path is 100% open and clear
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase flex-shrink-0">
                  Green Zone
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Transit Metrics, ETA, Delay & Topography Card */}
      {routeData && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3.5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-extrabold text-xs text-slate-900">
                Transit &amp; Telemetry (Auto-Selected Route)
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Live Logistics Engine
            </span>
          </div>

          {/* Time & Delay Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* ETA Box - Automatically updated based on safe route */}
            <div className={`p-3 rounded-xl border transition-all ${
              routeData.isBlocked ? 'bg-cyan-50/80 border-cyan-200' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <span className="text-[9px] uppercase font-extrabold text-slate-400 block mb-0.5">
                {routeData.isBlocked ? 'Safe Detour ETA' : 'Standard ETA'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-base sm:text-lg font-black ${routeData.isBlocked ? 'text-cyan-950' : 'text-slate-900'}`}>
                  {formatDuration(routeData.metrics.totalDuration)}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                {routeData.isBlocked ? 'Auto-Redirected Time' : 'Travel Window'}
              </span>
            </div>

            {/* Delay Delta Badge Box */}
            <div className={`p-3 rounded-xl border transition-all ${
              routeData.metrics.delayMinutes > 0
                ? 'bg-amber-50/90 border-amber-300/80 text-amber-900'
                : 'bg-emerald-50/90 border-emerald-200/80 text-emerald-900'
            }`}>
              <span className="text-[9px] uppercase font-extrabold opacity-70 block mb-0.5">
                Estimated Delay
              </span>
              <div className="flex items-center gap-1">
                <span className={`text-xs sm:text-sm font-black px-1.5 py-0.5 rounded-md ${
                  routeData.metrics.delayMinutes > 0
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {routeData.metrics.delayMinutes > 0 
                    ? `+${routeData.metrics.delayMinutes} mins delay` 
                    : '0 min delay'}
                </span>
              </div>
              <span className="text-[10px] opacity-80 font-medium block mt-0.5">
                {routeData.metrics.delayMinutes > 0 ? 'Via alternate detour' : 'Optimal transit path'}
              </span>
            </div>

          </div>

          {/* Metrics Breakdown Table */}
          <div className="space-y-1.5 text-xs">
            
            <div className="flex items-center justify-between py-1 border-b border-slate-100 text-slate-600">
              <span className="text-[11px] text-slate-500">Active Transit Corridor:</span>
              <span className="font-bold text-slate-900 text-[11px] text-right truncate max-w-[190px]">
                {routeData.metrics.activeVia}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100 text-slate-600">
              <span className="text-[11px] text-slate-500">Route Distance:</span>
              <span className="font-bold text-slate-900 text-[11px]">
                {routeData.metrics.totalDistance} km{' '}
                {routeData.metrics.distanceDiffKm > 0 && (
                  <span className="text-amber-600 font-extrabold">
                    (+{routeData.metrics.distanceDiffKm} km)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100 text-slate-600">
              <span className="text-[11px] text-slate-500">Safety Rating:</span>
              <span className="font-extrabold text-emerald-600 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {routeData.metrics.safetyScore}
              </span>
            </div>

            {/* Topography & Elevation Data from Open-Elevation API */}
            <div className="flex items-center justify-between py-1 text-slate-600">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-indigo-500" />
                <span>Elevation Range:</span>
              </span>
              <span className="font-bold text-indigo-700 text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {routeData.metrics.elevation}
              </span>
            </div>

          </div>

          {/* Explanatory Advisory Footer */}
          {routeData.isBlocked && (
            <div className="p-2.5 rounded-xl bg-cyan-50/90 border border-cyan-200/80 text-[11px] text-cyan-900 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Detour Advisory: </strong>
                {(activeCorridor.safeAlternateRoute || activeCorridor.detourRoute)?.advisory}
              </span>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
