/**
 * MargSetu (मार्गसेतु) - Citizen & Driver Map Page (Phase 1, 2, 3, & 4)
 * Fully responsive across Mobile, Tablet, Laptop, and Desktop.
 * Full-bleed edge-to-edge interactive map with responsive floating/bottom-sheet advisory panels,
 * real-time alternate routing, and floating Hazard Reporting Action Button (FAB).
 */

import React, { useState } from 'react';
import BaseMap from '../components/BaseMap';
import CitizenInfoPanel from '../components/CitizenInfoPanel';
import FloatingLegend from '../components/FloatingLegend';
import ReportHazardFAB from '../components/ReportHazardFAB';
import ReportHazardModal from '../components/ReportHazardModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Map as MapIcon, ChevronUp, ChevronDown, ListFilter } from 'lucide-react';
import { useRoads } from '../context/RoadContext';

export default function CitizenPortal() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  // Mobile panel state: true = expanded, false = collapsed to mini bar
  const [isMobilePanelExpanded, setIsMobilePanelExpanded] = useState(true);
  const { roads } = useRoads();

  return (
    <div className="relative w-full h-[calc(100vh-64px)] h-[calc(100dvh-64px)] overflow-hidden bg-slate-100 font-sans">
      
      {/* 1. Full-Bleed Edge-to-Edge Map in Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <BaseMap />
      </div>

      {/* 2. Desktop / Tablet Floating Panel (Left) */}
      <div className="hidden md:block absolute top-4 left-4 z-20 w-[380px] lg:w-[420px] max-h-[calc(100vh-96px)] pointer-events-auto">
        <CitizenInfoPanel />
      </div>

      {/* 3. Mobile Collapsible Bottom Sheet (< 768px) */}
      <div className="md:hidden absolute inset-x-0 bottom-0 z-20 pointer-events-auto flex flex-col justify-end">
        
        {/* Toggle Pill Bar (Always visible on mobile) */}
        <div className="px-3 pb-2 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => setIsMobilePanelExpanded(!isMobilePanelExpanded)}
            className="pointer-events-auto mx-auto flex items-center gap-2 px-4 py-2 bg-slate-900/90 text-white backdrop-blur-xl rounded-full text-xs font-bold shadow-2xl border border-slate-700/80 transition-transform active:scale-95"
          >
            {isMobilePanelExpanded ? (
              <>
                <ChevronDown className="w-4 h-4 text-emerald-400" />
                <span>Minimize to View Full Map</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Open Journey Planner ({roads.length} Corridors)</span>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </>
            )}
          </button>
        </div>

        {/* Expandable Panel Sheet */}
        <AnimatePresence>
          {isMobilePanelExpanded && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-h-[72vh] bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Drag handle bar */}
              <div 
                onClick={() => setIsMobilePanelExpanded(false)}
                className="w-full pt-3 pb-1 flex justify-center cursor-pointer"
              >
                <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
              </div>

              {/* Inner Citizen Info Panel */}
              <div className="overflow-y-auto p-3 flex-1">
                <CitizenInfoPanel isMobile />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Floating Frosted-Glass Legend (Desktop/Tablet) */}
      <div className="hidden lg:block absolute bottom-6 left-[450px] z-20 pointer-events-auto">
        <FloatingLegend />
      </div>

      {/* 5. Phase 3: Floating Action Button (FAB) */}
      <ReportHazardFAB 
        onClick={() => setIsReportModalOpen(true)} 
        className={isMobilePanelExpanded ? 'bottom-20 right-4 sm:bottom-6 sm:right-6' : 'bottom-6 right-4 sm:bottom-6 sm:right-6'}
      />

      {/* 6. Phase 3: Geo-tagged Hazard Reporting Modal */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
}
