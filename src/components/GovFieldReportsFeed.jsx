/**
 * MargSetu (मार्गसेतु) - Government Verification Feed (Phase 3)
 * Live streaming panel for Disaster Authorities to review incoming geo-tagged citizen evidence,
 * view photo proofs, and execute one-click "Verify & Block Route" (triggering Phase 1 & 2 detour logic).
 */

import React, { useState } from 'react';
import { useRoads } from '../context/RoadContext';
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  X,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GovFieldReportsFeed({ className = "" }) {
  const { 
    fieldReports, 
    verifyAndBlockReport, 
    rejectFieldReport, 
    setSelectedRoadId,
    setSelectedReportId,
    selectedReportId
  } = useRoads();

  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending' | 'verified' | 'all'
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredReports = fieldReports.filter(report => {
    if (activeFilter === 'pending') return report.status === 'pending';
    if (activeFilter === 'verified') return report.status === 'verified';
    return true;
  });

  const pendingCount = fieldReports.filter(r => r.status === 'pending').length;

  const handleVerify = (report) => {
    verifyAndBlockReport(
      report.id, 
      report.linkedRoadId, 
      `[VERIFIED DISASTER PROOF] ${report.incidentType}: ${report.description}`
    );
  };

  const handleReject = (reportId) => {
    rejectFieldReport(reportId, 'Insufficient evidence / False alarm confirmed by Sentinel.');
  };

  const formatTimeAgo = (isoString) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / (1000 * 60));
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      return `${hrs}h ${mins % 60}m ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className={`space-y-3 font-sans text-slate-800 ${className}`}>
      
      {/* 1. Filter Tabs */}
      <div className="flex items-center justify-between gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
        <button
          onClick={() => setActiveFilter('pending')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Pending</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            activeFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('verified')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'verified'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Verified</span>
        </button>

        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All ({fieldReports.length})</span>
        </button>
      </div>

      {/* 2. Feed Cards List */}
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-340px)] pr-1">
        {filteredReports.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-xs text-slate-800">All Clear</h4>
            <p className="text-[11px] text-slate-400">
              No pending citizen field reports awaiting verification in this queue.
            </p>
          </div>
        ) : (
          filteredReports.map(report => {
            const isSelected = selectedReportId === report.id;

            return (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected 
                    ? 'bg-slate-50 border-slate-400 shadow-md ring-2 ring-slate-900/5' 
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Header: Incident Type & Time */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
                      report.status === 'pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : (report.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200')
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{report.incidentType}</span>
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(report.timestamp)}</span>
                  </span>
                </div>

                {/* Evidence Photo Preview */}
                {(report.photoUrl || report.fallbackSvg) && (
                  <div className="relative mb-3 rounded-xl overflow-hidden bg-slate-900 group cursor-pointer border border-slate-200">
                    <img
                      src={report.photoUrl || report.fallbackSvg}
                      alt="Field Proof"
                      className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onClick={() => setLightboxImage(report.photoUrl || report.fallbackSvg)}
                      onError={(e) => {
                        e.target.onerror = null;
                        if (report.fallbackSvg) e.target.src = report.fallbackSvg;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-bold pointer-events-none">
                      <Eye className="w-4 h-4" />
                      <span>Inspect Evidence Full-Size</span>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white font-mono text-[9px] px-2 py-0.5 rounded backdrop-blur-sm">
                      {report.latitude}° N, {report.longitude}° E
                    </div>
                  </div>
                )}

                {/* Report Text & Meta */}
                <p className="text-xs font-medium text-slate-700 mb-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="space-y-1 text-[11px] text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span><strong>Sector:</strong> {report.nearestHighway}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span><strong>GPS:</strong> {report.latitude}° N, {report.longitude}° E (&plusmn;{report.accuracyMeters}m)</span>
                  </div>
                </div>

                {/* Status Badges & Action Buttons (Feature D) */}
                {report.status === 'pending' ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    
                    {/* Reject Button */}
                    <button
                      onClick={() => handleReject(report.id)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reject</span>
                    </button>

                    {/* Verify & Block Route Button */}
                    <button
                      onClick={() => handleVerify(report)}
                      className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Block Route</span>
                    </button>

                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <span className={`font-bold inline-flex items-center gap-1 ${
                      report.status === 'verified' ? 'text-rose-600' : 'text-slate-500'
                    }`}>
                      {report.status === 'verified' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Roadblock Actioned & Detour Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Report Dismissed</span>
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedReportId(report.id);
                        if (report.linkedRoadId) setSelectedRoadId(report.linkedRoadId);
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>Focus on Map</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

              </motion.div>
            );
          })
        )}
      </div>

      {/* 3. Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl p-2"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="Evidence Lightbox"
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
