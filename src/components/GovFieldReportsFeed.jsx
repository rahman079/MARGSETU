/**
 * MargSetu (मार्गसेतु) - Government Verification Feed (Phase 3)
 * Live streaming panel for Disaster Authorities to review incoming geo-tagged citizen evidence,
 * view photo proofs, execute "Verify & Block Route", and reject/dismiss false alarms (removing them from map).
 */

import React, { useState } from 'react';
import { useRoads } from '../context/RoadContext';
import { PRESET_INCIDENT_PHOTOS, createIncidentSVG } from '../data/sampleReports';
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
  Compass,
  EyeOff,
  RotateCcw,
  Ban,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REJECTION_REASONS = [
  'False alarm / Spurious submission',
  'Duplicate citizen report',
  'Hazard already cleared / Road passable',
  'Insufficient photo evidence / Unverifiable',
  'Location mismatch / Inaccurate coordinates'
];

export default function GovFieldReportsFeed({ className = "" }) {
  const { 
    fieldReports, 
    verifyAndBlockReport, 
    rejectFieldReport, 
    reopenFieldReport,
    setSelectedRoadId,
    setSelectedReportId,
    selectedReportId
  } = useRoads();

  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending' | 'verified' | 'rejected' | 'all'
  const [lightboxImage, setLightboxImage] = useState(null);

  // Reject Modal State
  const [rejectingReport, setRejectingReport] = useState(null);
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const pendingCount = fieldReports.filter(r => r.status === 'pending').length;
  const verifiedCount = fieldReports.filter(r => r.status === 'verified').length;
  const rejectedCount = fieldReports.filter(r => r.status === 'rejected').length;

  const filteredReports = fieldReports.filter(report => {
    if (activeFilter === 'pending') return report.status === 'pending';
    if (activeFilter === 'verified') return report.status === 'verified';
    if (activeFilter === 'rejected') return report.status === 'rejected';
    return true;
  });

  const handleVerify = (report) => {
    verifyAndBlockReport(
      report.id, 
      report.linkedRoadId, 
      `[VERIFIED DISASTER PROOF] ${report.incidentType}: ${report.description}`
    );
  };

  const handleOpenRejectModal = (report) => {
    setRejectingReport(report);
    setSelectedReason(REJECTION_REASONS[0]);
    setCustomReason('');
  };

  const handleConfirmReject = () => {
    if (!rejectingReport) return;
    const finalReason = selectedReason === 'Other' ? (customReason.trim() || 'Custom dismissal reason') : selectedReason;
    rejectFieldReport(rejectingReport.id, finalReason);
    setRejectingReport(null);
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
      
      {/* 1. Filter Tabs (Pending, Verified, Rejected, All) */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 text-[11px]">
        
        {/* Pending Tab */}
        <button
          onClick={() => setActiveFilter('pending')}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold transition-all ${
            activeFilter === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Pending</span>
          {pendingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
              activeFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>

        {/* Verified Tab */}
        <button
          onClick={() => setActiveFilter('verified')}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold transition-all ${
            activeFilter === 'verified'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Verified</span>
          {verifiedCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
              activeFilter === 'verified' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {verifiedCount}
            </span>
          )}
        </button>

        {/* Rejected Tab */}
        <button
          onClick={() => setActiveFilter('rejected')}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold transition-all ${
            activeFilter === 'rejected'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Rejected</span>
          {rejectedCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
              activeFilter === 'rejected' ? 'bg-rose-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {rejectedCount}
            </span>
          )}
        </button>

        {/* All Tab */}
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
            activeFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {fieldReports.length}
          </span>
        </button>
      </div>

      {/* 2. Feed Cards List */}
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-340px)] pr-1">
        {filteredReports.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-xs text-slate-800">No Reports in this Queue</h4>
            <p className="text-[11px] text-slate-400">
              {activeFilter === 'rejected' 
                ? 'No rejected reports. All active reports are visible on map.'
                : 'No field reports matching this filter.'}
            </p>
          </div>
        ) : (
          filteredReports.map(report => {
            const isSelected = selectedReportId === report.id;
            const isRejected = report.status === 'rejected';
            const isVerified = report.status === 'verified';
            const isPending = report.status === 'pending';

            return (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border transition-all ${
                  isRejected 
                    ? 'bg-slate-50/70 border-slate-200 opacity-90'
                    : (isSelected 
                        ? 'bg-slate-50 border-slate-400 shadow-md ring-2 ring-slate-900/5' 
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs')
                }`}
              >
                {/* Header: Incident Type, Status Pill & Time */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
                      isPending
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : (isVerified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200')
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{report.incidentType}</span>
                    </span>

                    {isRejected && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1">
                        <EyeOff className="w-3 h-3 text-slate-500" />
                        <span>Hidden from Map</span>
                      </span>
                    )}
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
                      className={`w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
                        isRejected ? 'grayscale-[40%]' : ''
                      }`}
                      onClick={() => {
                        const fallback = report.fallbackSvg || (PRESET_INCIDENT_PHOTOS.find(p => p.incidentType === report.incidentType)?.fallbackSvg) || createIncidentSVG(report.incidentType || 'HAZARD PROOF', '#ef4444', '');
                        setLightboxImage(report.photoUrl || fallback);
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        const fallback = report.fallbackSvg || (PRESET_INCIDENT_PHOTOS.find(p => p.incidentType === report.incidentType)?.fallbackSvg) || createIncidentSVG(report.incidentType || 'HAZARD PROOF', '#ef4444', '');
                        e.target.src = fallback;
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
                  {report.reporterRole && (
                    <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-200/50">
                      Reporter: {report.reporterRole}
                    </div>
                  )}
                </div>

                {/* Rejection Details Banner if Rejected */}
                {isRejected && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-900 text-xs">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-700">
                      <Ban className="w-3.5 h-3.5" />
                      <span>Report Rejected &amp; Excluded from Map</span>
                    </div>
                    <p className="text-[11px] text-rose-800 leading-snug">
                      <strong>Reason:</strong> {report.rejectReason || 'False alarm / Duplicate submission'}
                    </p>
                    {report.rejectedAt && (
                      <span className="text-[10px] text-rose-600/80 block mt-1">
                        Rejected {formatTimeAgo(report.rejectedAt)}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {isPending ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    
                    {/* Reject Button (Opens Modal with Reason selection) */}
                    <button
                      onClick={() => handleOpenRejectModal(report)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reject</span>
                    </button>

                    {/* Verify & Block Route Button */}
                    <button
                      onClick={() => handleVerify(report)}
                      className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify &amp; Block Route</span>
                    </button>

                  </div>
                ) : isRejected ? (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Excluded from Map</span>
                    </span>

                    {/* Restore / Reopen Button */}
                    <button
                      onClick={() => reopenFieldReport(report.id)}
                      className="py-1 px-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold transition-colors flex items-center gap-1"
                      title="Restore report back to pending queue and map"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore to Map</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <span className="font-bold inline-flex items-center gap-1 text-rose-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Roadblock Actioned &amp; Detour Active</span>
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

      {/* 3. Reject Reason Modal */}
      <AnimatePresence>
        {rejectingReport && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setRejectingReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl p-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <Ban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Reject Field Report</h3>
                    <p className="text-[11px] text-slate-500">Report will be dismissed and removed from map.</p>
                  </div>
                </div>
                <button
                  onClick={() => setRejectingReport(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Rejection Reason:
                </label>
                
                <div className="space-y-1.5">
                  {REJECTION_REASONS.map(reason => (
                    <label 
                      key={reason}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                        selectedReason === reason 
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rejectReason"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}

                  <label 
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      selectedReason === 'Other' 
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      checked={selectedReason === 'Other'}
                      onChange={() => setSelectedReason('Other')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Other custom note</span>
                  </label>
                </div>

                {selectedReason === 'Other' && (
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter reason for rejecting this report..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setRejectingReport(null)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Lightbox Modal */}
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
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PRESET_INCIDENT_PHOTOS[0].fallbackSvg;
                }}
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
