/**
 * MargSetu (मार्गसेतु) - Citizen & Driver Map Page (Phase 1, 2, & 3)
 * Full-bleed edge-to-edge interactive map with floating frosted-glass advisory panels,
 * real-time alternate routing, and floating Hazard Reporting Action Button (FAB).
 */

import React, { useState } from 'react';
import BaseMap from '../components/BaseMap';
import CitizenInfoPanel from '../components/CitizenInfoPanel';
import FloatingLegend from '../components/FloatingLegend';
import ReportHazardFAB from '../components/ReportHazardFAB';
import ReportHazardModal from '../components/ReportHazardModal';
import { motion } from 'framer-motion';

export default function CitizenPortal() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-100 font-sans">
      
      {/* 1. Full-Bleed Edge-to-Edge Map in Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <BaseMap />
      </div>

      {/* 2. Floating Frosted-Glass Citizen Panel (Top-Left) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-4 left-4 z-20 w-[92vw] sm:w-[410px] lg:w-[430px] max-h-[calc(100vh-100px)] pointer-events-auto"
      >
        <CitizenInfoPanel />
      </motion.div>

      {/* 3. Floating Frosted-Glass Legend (Bottom-Left / Mid-Bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute bottom-6 left-4 sm:left-[450px] z-20 pointer-events-auto hidden md:block"
      >
        <FloatingLegend />
      </motion.div>

      {/* 4. Phase 3: Floating Action Button (FAB) - Bottom-Right */}
      <ReportHazardFAB onClick={() => setIsReportModalOpen(true)} />

      {/* 5. Phase 3: Geo-tagged Hazard Reporting Modal */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
}
