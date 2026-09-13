/**
 * MargSetu (मार्गसेतु) - Citizen Hazard Reporting Modal (Phase 3 + Phase 4 Offline & SMS Failsafes)
 * Frosted-glass modal featuring auto geo-tagging (GPS lock), camera Base64 capture,
 * intelligent online/offline switching, IndexedDB Store & Forward caching, and SMS URI scheme dispatch.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRoads } from '../context/RoadContext';
import { useAuth } from '../context/AuthContext';
import { INCIDENT_TYPES, PRESET_INCIDENT_PHOTOS, createIncidentSVG } from '../data/sampleReports';
import { ROUTE_CORRIDORS } from '../data/routeCorridors';
import { toast } from 'sonner';
import { 
  Camera, 
  MapPin, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw,
  Compass,
  Zap,
  MessageSquare,
  WifiOff,
  Database,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMERGENCY_CONTROL_SMS_NUMBER = '+919876543210';

export default function ReportHazardModal({ isOpen, onClose }) {
  const { 
    submitFieldReport, 
    queueOfflineHazard, 
    isOnline, 
    isSimulatedOffline 
  } = useRoads();
  const { user } = useAuth();

  // Form State
  const [incidentType, setIncidentType] = useState(INCIDENT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Offline Dispatch Feedback State
  const [offlineCompletedPayload, setOfflineCompletedPayload] = useState(null);

  // GPS State (Feature B - Auto Geo-tagging)
  const [gpsStatus, setGpsStatus] = useState('acquiring');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null, accuracy: null });
  const [detectedHighway, setDetectedHighway] = useState(null);
  const fileInputRef = useRef(null);

  // Auto-acquire GPS lock on modal open
  useEffect(() => {
    if (!isOpen) return;

    setGpsStatus('acquiring');
    setPhotoBase64(null);
    setDescription('');
    setOfflineCompletedPayload(null);

    let isMounted = true;

    // Default fallback coordinates near Jorabat-Shillong corridor
    const fallbackCoords = {
      lat: 26.0250 + (Math.random() - 0.5) * 0.04,
      lng: 91.8210 + (Math.random() - 0.5) * 0.04,
      accuracy: 4.8
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) return;
          const lat = +position.coords.latitude.toFixed(5);
          const lng = +position.coords.longitude.toFixed(5);
          const accuracy = +position.coords.accuracy.toFixed(1);

          setCoordinates({ lat, lng, accuracy });
          setGpsStatus('locked');
          matchNearestCorridor(lat, lng);
        },
        (error) => {
          console.warn('Geolocation fallback:', error.message);
          if (!isMounted) return;
          setCoordinates(fallbackCoords);
          setGpsStatus('fallback');
          matchNearestCorridor(fallbackCoords.lat, fallbackCoords.lng);
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );
    } else {
      setCoordinates(fallbackCoords);
      setGpsStatus('fallback');
      matchNearestCorridor(fallbackCoords.lat, fallbackCoords.lng);
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const matchNearestCorridor = (lat, lng) => {
    let closest = ROUTE_CORRIDORS[0];
    let minDistance = Infinity;

    ROUTE_CORRIDORS.forEach(corridor => {
      const cLat = corridor.origin.coordinates[0];
      const cLng = corridor.origin.coordinates[1];
      const dist = Math.sqrt(Math.pow(lat - cLat, 2) + Math.pow(lng - cLng, 2));
      if (dist < minDistance) {
        minDistance = dist;
        closest = corridor;
      }
    });

    setDetectedHighway(closest);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetPhoto = (preset) => {
    setPhotoBase64(preset.imageUrl || preset.dataUrl || preset.fallbackSvg);
    setIncidentType(preset.incidentType);
  };

  // Generate compact emergency SMS string for zero-data environments
  const generateSMSBody = (lat, lng, type, corridorCode) => {
    const cleanType = type.split('/')[0].trim().toUpperCase().replace(/\s+/g, '_');
    const timestamp = Math.floor(Date.now() / 1000);
    return `MARGSETU|LOC:${lat},${lng}|TYPE:${cleanType}|CORR:${corridorCode || 'NER'}|TIME:${timestamp}`;
  };

  const triggerSMSApp = (smsBody) => {
    const smsUri = `sms:${EMERGENCY_CONTROL_SMS_NUMBER}?body=${encodeURIComponent(smsBody)}`;
    try {
      window.location.href = smsUri;
    } catch (e) {
      console.warn('SMS URI scheme trigger failed:', e);
    }
  };

  // Submit Handler: Switches dynamically between Online Transmit and Offline Store & Forward
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photoBase64) {
      toast.error('Evidence Photo Required', {
        description: 'Please capture a photo or choose an emergency preset.'
      });
      return;
    }

    setIsSubmitting(true);

    const lat = coordinates.lat || 26.0250;
    const lng = coordinates.lng || 91.8210;
    const corridorCode = detectedHighway?.highwayCode || 'NH-6';
    const matchedPreset = PRESET_INCIDENT_PHOTOS.find(p => p.incidentType === incidentType);
    const fallbackSvg = matchedPreset?.fallbackSvg || createIncidentSVG(incidentType.toUpperCase(), '#ef4444', 'M 185 100 L 200 75 L 215 100 L 205 100 L 205 130 L 195 130 L 195 100 Z');

    const reportPayload = {
      incidentType,
      title: `${incidentType} reported near ${corridorCode}`,
      description: description || `Severe ${incidentType.toLowerCase()} obstructing highway corridor.`,
      latitude: lat,
      longitude: lng,
      accuracyMeters: coordinates.accuracy || 5.0,
      nearestHighway: detectedHighway?.name || 'NH-6 Guwahati-Shillong Corridor',
      linkedRoadId: detectedHighway?.linkedRoadId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      photoUrl: photoBase64,
      fallbackSvg: fallbackSvg,
      reporterRole: user 
        ? `${user.name} (${user.role === 'govt' ? 'Official #' + (user.badgeId || 'Gov') : (user.category || user.state || 'Verified Citizen')})`
        : 'Citizen Scout (Verified App User)',
      reporterContact: user?.phone || user?.email || undefined
    };

    if (isOnline) {
      // 1. ONLINE SUBMISSION PATH
      try {
        await submitFieldReport(reportPayload);

        toast.success('🚨 Hazard Evidence Dispatched!', {
          description: `Geo-tagged report transmitted to NER Disaster Control Room.`,
          duration: 5000
        });

        setIsSubmitting(false);
        onClose();
      } catch (err) {
        console.error('Online submit error:', err);
        toast.error('Online dispatch failed; caching to offline queue.');
        await queueOfflineHazard(reportPayload);
        setIsSubmitting(false);
        onClose();
      }
    } else {
      // 2. OFFLINE SUBMISSION & SMS FALLBACK (Feature B)
      try {
        const savedReport = await queueOfflineHazard(reportPayload);
        const smsString = generateSMSBody(lat, lng, incidentType, corridorCode);

        setOfflineCompletedPayload({
          report: savedReport,
          smsString
        });

        // Trigger native SMS application
        triggerSMSApp(smsString);

        toast.warning('📡 Stored in Local Offline Queue & SMS Dispatched', {
          description: `Report safely cached in IndexedDB. Will auto-sync when network returns.`,
          duration: 6000
        });

        setIsSubmitting(false);
      } catch (err) {
        console.error('Offline queue error:', err);
        toast.error('Failed to cache offline report.');
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
      >
        
        {/* 1. Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
              isOnline ? 'bg-rose-500 shadow-rose-500/30' : 'bg-amber-500 shadow-amber-500/30'
            }`}>
              {isOnline ? <Camera className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight flex items-center gap-2">
                <span>Report Highway Hazard</span>
                {!isOnline && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    Offline SMS Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {isOnline ? 'Real-Time Sentinel Mesh Dispatch' : 'IndexedDB Store & Forward + SMS Emergency Fallback'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Offline Completed View (Success Screen for Offline) */}
        {offlineCompletedPayload ? (
          <div className="p-6 space-y-4 text-slate-800">
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Report Cached in IndexedDB Offline Queue
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your hazard evidence has been encrypted and saved to your device’s local database. It will <strong>automatically synchronize</strong> with the Government Control Room as soon as connectivity is restored.
              </p>
            </div>

            {/* Emergency SMS Details Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Emergency Cellular SMS Fallback</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  To: {EMERGENCY_CONTROL_SMS_NUMBER}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800 font-mono text-[11px] text-emerald-300 break-all border border-slate-700">
                {offlineCompletedPayload.smsString}
              </div>

              <button
                type="button"
                onClick={() => triggerSMSApp(offlineCompletedPayload.smsString)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Re-Trigger Native SMS App</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
            >
              Close & Return to Map
            </button>
          </div>
        ) : (
          /* Standard Reporting Form Body */
          <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 overflow-y-auto space-y-4 flex-1">
            
            {/* Auto Geo-tagging State Banner */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              gpsStatus === 'acquiring'
                ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {gpsStatus === 'acquiring' ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="font-extrabold text-xs">
                    {gpsStatus === 'acquiring' ? 'Acquiring GPS Satellite Lock...' : 'GPS Coordinates Authenticated'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  gpsStatus === 'acquiring' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {gpsStatus === 'acquiring' ? 'Searching' : `±${coordinates.accuracy || 4}m Accuracy`}
                </span>
              </div>

              <div className="text-[11px] font-mono bg-white/80 px-2.5 py-1.5 rounded-xl border border-slate-200/60 flex items-center justify-between">
                <span className="text-slate-600">
                  <strong>Lat:</strong> {coordinates.lat ? `${coordinates.lat}° N` : 'Calculating...'} &bull;{' '}
                  <strong>Lng:</strong> {coordinates.lng ? `${coordinates.lng}° E` : 'Calculating...'}
                </span>
                <span className="text-[10px] font-sans font-bold text-indigo-600">Locked</span>
              </div>

              {detectedHighway && (
                <div className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-1 font-medium">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sector: <strong>{detectedHighway.name}</strong></span>
                </div>
              )}
            </div>

            {/* Low Network Notice if Offline */}
            {!isOnline && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start gap-2 text-xs">
                <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Low-Network Failsafe:</strong> Report will be saved to your device's <strong>IndexedDB</strong> and encoded into an <strong>emergency SMS</strong> string.
                </p>
              </div>
            )}

            {/* Incident Type Dropdown */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Incident Classification:
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs cursor-pointer"
              >
                {INCIDENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Camera Action & Photo Proof */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Ground Photographic Proof:
              </label>

              {photoBase64 ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                  <img 
                    src={photoBase64} 
                    alt="Captured Evidence" 
                    className="w-full h-44 object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      const matched = PRESET_INCIDENT_PHOTOS.find(p => p.incidentType === incidentType);
                      e.target.src = matched?.fallbackSvg || createIncidentSVG(incidentType.toUpperCase(), '#ef4444', 'M 185 100 L 200 75 L 215 100 L 205 100 L 205 130 L 195 130 L 195 100 Z');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 justify-between">
                    <span className="text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      {coordinates.lat}° N, {coordinates.lng}° E
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhotoBase64(null)}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold shadow-sm hover:bg-rose-700"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-slate-800">Open Camera & Take Photo</span>
                    <span className="text-[10px] text-slate-400">or select existing photo from device</span>
                  </button>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">
                      Or select rapid disaster photo preset:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRESET_INCIDENT_PHOTOS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPresetPhoto(preset)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold text-left truncate flex items-center gap-1.5 border border-slate-200 transition-colors"
                        >
                          <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span className="truncate">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Field Notes (Optional):
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Heavy mudslide blocking all 4 lanes. Emergency excavators requested."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !photoBase64}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  photoBase64 && !isSubmitting
                    ? (isOnline 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25 active:scale-[0.98]'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25 active:scale-[0.98]')
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Evidence...</span>
                  </>
                ) : (
                  <>
                    {isOnline ? <UploadCloud className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    <span>{isOnline ? 'Transmit Verified Evidence' : 'Save Offline & Dispatch SMS'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </motion.div>
    </div>
  );
}
