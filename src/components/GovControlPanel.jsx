/**
 * MargSetu (मार्गसेतु) - Government Control Panel & Sentinel Command (Phase 1 + Phase 3 + Auth)
 * Frosted-glass command center with tabbed switching between Highway Corridors and Live Citizen Field Reports.
 * Stamped with active Officer Credentials & Clearance badges.
 * Fully responsive for both desktop floating sidebar and mobile bottom-sheet integration.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoads } from '../context/RoadContext';
import { useAuth } from '../context/AuthContext';
import GovFieldReportsFeed from './GovFieldReportsFeed';
import { 
  Shield, 
  Radio, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RotateCcw, 
  MapPin, 
  ChevronRight, 
  Edit3, 
  Check,
  Camera,
  Layers,
  User,
  LogIn,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GovControlPanel({ className = "", isMobile = false }) {
  const { 
    roads, 
    updateRoadStatus, 
    resetToDefault, 
    selectedRoadId, 
    setSelectedRoadId, 
    syncStatus,
    fieldReports 
  } = useRoads();

  const { user, isGovAuthenticated, demoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'highways'
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesInput, setNotesInput] = useState({});
  const [lastActionToast, setLastActionToast] = useState(null);

  const pendingReportsCount = fieldReports.filter(r => r.status === 'pending').length;

  const currentOfficerStamp = isGovAuthenticated && user
    ? `${user.name} (${user.badgeId || user.department || 'Gov Official'})`
    : 'NER Emergency Control Room (Govt ID #NER-409)';

  const handleStatusChange = async (roadId, newStatus) => {
    const road = roads.find(r => r.id === roadId);
    const updated = await updateRoadStatus(roadId, newStatus, null, currentOfficerStamp);
    
    // Trigger feedback notification
    setLastActionToast({
      roadCode: road?.highway_code || 'Corridor',
      newStatus,
      time: new Date().toLocaleTimeString()
    });

    setTimeout(() => {
      setLastActionToast(null);
    }, 4000);
  };

  const handleSaveNotes = async (roadId) => {
    const newNote = notesInput[roadId];
    if (newNote !== undefined) {
      await updateRoadStatus(roadId, roads.find(r => r.id === roadId).status, newNote, currentOfficerStamp);
    }
    setEditingNotesId(null);
  };

  return (
    <aside className={`${
      isMobile 
        ? 'w-full flex flex-col gap-3 font-sans' 
        : `bg-white/92 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-glass-hover flex flex-col gap-3.5 font-sans max-h-[calc(100vh-100px)] ${className}`
    }`}>
      
      {/* 1. Header with Gov Badge & Live Broadcast Pill */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200/80 flex-shrink-0">
            <img src="/logo.svg" alt="MargSetu Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight flex items-center gap-1.5">
              <span>Control Room Dispatch</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400">Gov</span>
            </h2>
            <p className="text-[10px] font-medium text-slate-500">
              North Eastern Regional Command (NER)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-emerald-700">
          <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
          <span>BRO Sentinel</span>
        </div>
      </div>

      {/* 1.1 Officer Badge / Active Clearance Strip */}
      {isGovAuthenticated && user ? (
        <div className="p-2 px-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="truncate">
              <div className="text-[11px] font-bold truncate text-emerald-400">{user.name}</div>
              <div className="text-[9px] text-slate-400 truncate">{user.department} &bull; {user.badgeId}</div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono font-bold text-slate-300 flex-shrink-0">
            Active
          </span>
        </div>
      ) : (
        <div className="p-2 px-2.5 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-between gap-2 text-[11px]">
          <span className="text-slate-600 font-medium truncate">
            Session: Evaluator Dispatch Mode
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => demoLogin('govt', 'govt_bro')}
              className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 flex items-center gap-1"
              title="1-Click Demo BRO Official"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Demo Login</span>
            </button>
            <Link
              to="/login?role=govt"
              className="px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-[10px] font-bold hover:bg-slate-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* 2. Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
        
        {/* Tab: Live Field Reports */}
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'reports'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-rose-500" />
          <span>Field Reports</span>
          {pendingReportsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
              {pendingReportsCount}
            </span>
          )}
        </button>

        {/* Tab: Highway Controls */}
        <button
          onClick={() => setActiveTab('highways')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'highways'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Highway Network</span>
        </button>

      </div>

      {/* Action Toast Feedback */}
      <AnimatePresence>
        {lastActionToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-2 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                lastActionToast.newStatus === 'clear' ? 'bg-emerald-400' :
                lastActionToast.newStatus === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span><strong>{lastActionToast.roadCode}</strong> updated to <strong>{lastActionToast.newStatus.toUpperCase()}</strong></span>
            </div>
            <span className="text-[10px] text-slate-400">{lastActionToast.time}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Tab Contents Container */}
      <div className="flex-1 overflow-y-auto pr-1">
        
        {activeTab === 'reports' ? (
          /* TAB 1: Live Citizen Field Reports Feed */
          <GovFieldReportsFeed />
        ) : (
          /* TAB 2: Highway Status Controls */
          <div className="space-y-3">
            {roads.map(road => {
              const isSelected = selectedRoadId === road.id;
              const isEditingNotes = editingNotesId === road.id;

              return (
                <div
                  key={road.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20' 
                      : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  
                  {/* Road Info Header */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {road.highway_code}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {road.road_name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {road.state} &bull; {road.length_km} km &bull; {road.origin} &rarr; {road.destination}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedRoadId(isSelected ? null : road.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={isSelected ? 'Clear Focus' : 'Focus on Map'}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl mb-2.5">
                    
                    {/* Clear Button */}
                    <button
                      onClick={() => handleStatusChange(road.id, 'clear')}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                        road.status === 'clear'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Clear</span>
                    </button>

                    {/* Warning Button */}
                    <button
                      onClick={() => handleStatusChange(road.id, 'warning')}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                        road.status === 'warning'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Warning</span>
                    </button>

                    {/* Blocked Button */}
                    <button
                      onClick={() => handleStatusChange(road.id, 'blocked')}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                        road.status === 'blocked'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Blocked</span>
                    </button>
                  </div>

                  {/* Advisory Notes Section */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesInput[road.id] !== undefined ? notesInput[road.id] : road.hazard_notes}
                          onChange={(e) => setNotesInput({ ...notesInput, [road.id]: e.target.value })}
                          className="w-full text-[11px] p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                          rows={2}
                          placeholder="Enter official advisory notes..."
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(road.id)}
                            className="px-2.5 py-0.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="text-slate-600 text-[10px] leading-relaxed">
                          <strong className="text-slate-800">Advisory:</strong> {road.hazard_notes}
                        </p>
                        <button
                          onClick={() => {
                            setEditingNotesId(road.id);
                            setNotesInput({ ...notesInput, [road.id]: road.hazard_notes });
                          }}
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                          title="Edit Advisory"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Reset Baseline State */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <span>Broadcast Channel: <strong>Active</strong></span>
        <button
          onClick={resetToDefault}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-900 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All State</span>
        </button>
      </div>

    </aside>
  );
}
