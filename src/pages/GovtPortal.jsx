/**
 * MargSetu (मार्गसेतु) - Government Control Room Map Page (Phase 1)
 * Full-bleed edge-to-edge interactive map with floating frosted-glass command & dispatch controls.
 */

import React from 'react';
import BaseMap from '../components/BaseMap';
import GovControlPanel from '../components/GovControlPanel';
import FloatingLegend from '../components/FloatingLegend';
import { motion } from 'framer-motion';

export default function GovtPortal() {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-100 font-sans">
      
      {/* 1. Full-Bleed Edge-to-Edge Map in Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <BaseMap />
      </div>

      {/* 2. Floating Frosted-Glass Government Dispatch Dashboard (Top-Left) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-4 left-4 z-20 w-[92vw] sm:w-[420px] lg:w-[460px] max-h-[calc(100vh-100px)] pointer-events-auto"
      >
        <GovControlPanel />
      </motion.div>

      {/* 3. Floating Frosted-Glass Legend (Bottom-Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute bottom-6 right-4 sm:right-6 z-20 pointer-events-auto hidden sm:block"
      >
        <FloatingLegend />
      </motion.div>

    </div>
  );
}
