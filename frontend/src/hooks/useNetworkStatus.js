/**
 * MargSetu (मार्गसेतु) - React Network Status Listener & Dead-Zone Simulator Hook (Phase 4)
 * Listens to browser online/offline events, provides zero-network simulation capabilities for evaluators,
 * and broadcasts alerts upon connectivity changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function useNetworkStatus() {
  const [isBrowserOnline, setIsBrowserOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Effective online status: True only if browser is online AND not in simulated offline mode
  const isOnline = isBrowserOnline && !isSimulatedOffline;

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      if (!isSimulatedOffline) {
        toast.success('🌐 Connection Restored: Live Mesh Sync Active', {
          description: 'Flushing pending offline reports to Command Center...',
          duration: 4000
        });
      }
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      toast.warning('📡 You are offline. Low-Network Failsafe Active.', {
        description: 'Hazard reports will be saved securely in local storage and dispatched via emergency SMS fallback.',
        duration: 6000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  // Toggle offline simulation for demonstration / testing
  const toggleOfflineSimulation = useCallback(() => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      if (next) {
        toast.warning('⚠️ Simulated Mountain Dead-Zone Engaged', {
          description: 'Network disconnected. Hazard reports will be queued in IndexedDB & SMS scheme triggered.',
          duration: 5000
        });
      } else {
        toast.success('🌐 Reconnected to NER Network Mesh', {
          description: 'Syncing local queue with Government Sentinel server...',
          duration: 4000
        });
      }
      return next;
    });
  }, []);

  return {
    isOnline,
    isBrowserOnline,
    isSimulatedOffline,
    toggleOfflineSimulation
  };
}
