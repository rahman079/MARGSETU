import React from 'react';
import { Link } from 'react-router-dom';
import { useRoads } from '../context/RoadContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Shield, Car, ArrowRight, Radio, MapPin, CheckCircle, AlertTriangle, XCircle, Navigation, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { roads, stats } = useRoads();
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 text-center">
        
        {/* Top Tagline Pill with Logo & Active Language */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md border border-slate-200/90 transition-transform hover:scale-105">
            <img src="/logo.svg" alt="MargSetu Logo" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>North Eastern Region &bull; Phase 1 Real-Time Geospatial Sentinel</span>
            {currentLang.code !== 'en' && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {currentLang.nativeName} ({currentLang.isoCode})
              </span>
            )}
          </div>
        </motion.div>

        {/* Main Title with Dynamic Translation */}
        <motion.h1
          key={`title-${currentLang.code}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] max-w-4xl mx-auto"
        >
          {t('heroTitle', 'Real-Time Accessibility & Disaster-Routing for the')}{' '}
          <span className="text-emerald-600">
            {t('heroRegion', 'North Eastern Region')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          key={`sub-${currentLang.code}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          {t('heroSubtitle', 'Empowering citizens and disaster authorities across 8 North Eastern states with instant highway status intelligence, live PostGIS mapping, and rapid incident rerouting.')}
        </motion.p>

        {/* Dual Portal Entry Cards (Feature A & Layout Guidelines) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto text-left"
        >
          
          {/* Card 1: Citizen & Driver Portal */}
          <Link
            to="/citizen"
            className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-glass hover:shadow-glass-hover hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-100/60 transition-colors" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Car className="w-7 h-7" />
              </div>

              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 font-mono">
                {t('publicAccess', 'Public Access Portal')}
              </span>

              <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2.5 tracking-tight group-hover:text-emerald-700 transition-colors">
                {t('citizenPortal', 'Enter as Citizen / Driver')}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Check live highway accessibility across Meghalaya, Assam, Arunachal, and Nagaland. View real-time color-coded routes and official road advisories before travel.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              <span>{t('liveMapBtn', 'Launch Live Map')}</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 2: Government Control Portal */}
          <Link
            to="/govt"
            className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-glass hover:shadow-glass-hover hover:border-slate-800 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-slate-200/60 transition-colors" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-105 transition-all duration-300 shadow-sm">
                <Shield className="w-7 h-7" />
              </div>

              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                {t('commandDispatch', 'Command & Dispatch')}
              </span>

              <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2.5 tracking-tight group-hover:text-slate-700 transition-colors">
                {t('govtPortal', 'Enter as Government Official')}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor 3 critical North Eastern highway corridors. Update real-time road conditions from Clear to Blocked, deploy advisories, and instantly synchronize with citizen maps.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
              <span>{t('controlRoomBtn', 'Access Control Room')}</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

        </motion.div>

        {/* Live Monitored Corridors Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 max-w-4xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Phase 1 Highway Sentinel Network
              </h3>
              <p className="text-xs text-slate-500">
                Live PostGIS geospatial corridors with dynamic color-coded telemetry
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                {stats.clear} Clear
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stats.warning} Warning
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <XCircle className="w-3.5 h-3.5" />
                {stats.blocked} Blocked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roads.map(road => (
              <div key={road.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-extrabold text-xs text-slate-800">{road.highway_code}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    road.status === 'clear' ? 'bg-emerald-100 text-emerald-800' :
                    road.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {road.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-600 truncate">{road.road_name}</p>
                <p className="text-[10px] text-slate-400 mt-1">{road.state} &bull; {road.length_km} km</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Clean GovTech Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">MargSetu (मार्गसेतु)</span>
            <span>&bull; Ministry of Development of North Eastern Region (MDoNER)</span>
          </div>
          <div>
            <span>PostGIS LineString Geometry &bull; CartoDB Positron Tile Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
