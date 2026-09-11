/**
 * MargSetu (मार्गसेतु) - Global Road State Context & Real-Time Sync Provider (Phase 1, 2, 3, & 4)
 * Manages highway GeoJSON state, dynamic alternate routing, citizen field verification,
 * and IndexedDB Store & Forward offline sync queue with automated SMS fallback.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import initialHighwaysData from '../data/highways.geojson.json';
import { ROUTE_CORRIDORS } from '../data/routeCorridors';
import { INITIAL_FIELD_REPORTS } from '../data/sampleReports';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { 
  saveOfflineReport, 
  getOfflineReports, 
  deleteOfflineReport, 
  clearOfflineQueue 
} from '../services/indexedDBService';

const RoadContext = createContext(null);

const STORAGE_KEY_ROADS = 'margsetu_roads_state_v1';
const STORAGE_KEY_REPORTS = 'margsetu_field_reports_v1';
const BROADCAST_CHANNEL_NAME = 'margsetu_road_sync_channel';

export const RoadProvider = ({ children }) => {
  // Phase 4 Network Status Hook
  const { isOnline, isBrowserOnline, isSimulatedOffline, toggleOfflineSimulation } = useNetworkStatus();

  // 1. Highways State
  const [roads, setRoads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse cached road state:', err);
    }
    return initialHighwaysData.features.map(f => ({
      ...f.properties,
      geometry: f.geometry
    }));
  });

  // 2. Field Reports State (Phase 3)
  const [fieldReports, setFieldReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse cached field reports:', err);
    }
    return INITIAL_FIELD_REPORTS;
  });

  // 3. Phase 4: Offline Pending Queue State
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isSyncingOfflineQueue, setIsSyncingOfflineQueue] = useState(false);

  const [selectedRoadId, setSelectedRoadId] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState('synced');

  // Phase 2: Active Journey & Dynamic Routing State
  const [activeCorridorId, setActiveCorridorId] = useState('corridor-guwahati-shillong');
  const [isJourneyActive, setIsJourneyActive] = useState(true);
  const [routeVersion, setRouteVersion] = useState(0);
  const prevBlockedRoadsRef = useRef(new Set());
  const prevOnlineRef = useRef(isOnline);

  // Load offline queue from IndexedDB on startup
  const refreshOfflineQueue = useCallback(async () => {
    try {
      const reports = await getOfflineReports();
      setOfflineQueue(reports);
    } catch (err) {
      console.warn('Failed to load offline queue:', err);
    }
  }, []);

  useEffect(() => {
    refreshOfflineQueue();
  }, [refreshOfflineQueue]);

  // Persist roads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROADS, JSON.stringify(roads));
    } catch (err) {
      console.error('Error caching road state:', err);
    }
  }, [roads]);

  // Persist field reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(fieldReports));
    } catch (err) {
      console.error('Error caching field reports:', err);
    }
  }, [fieldReports]);

  // Phase 2 Automatic Safe-Zone Rerouting Notification Trigger
  const prevActiveCorridorIdRef = useRef(activeCorridorId);

  useEffect(() => {
    const currentBlocked = new Set(roads.filter(r => r.status === 'blocked').map(r => r.id));
    const activeCorridor = ROUTE_CORRIDORS.find(c => c.id === activeCorridorId);

    if (activeCorridor) {
      const isMatchingRoadBlocked = currentBlocked.has(activeCorridor.linkedRoadId);
      const wasPreviouslyBlocked = prevBlockedRoadsRef.current.has(activeCorridor.linkedRoadId);
      const isCorridorChanged = prevActiveCorridorIdRef.current !== activeCorridorId;

      if (isMatchingRoadBlocked && (isCorridorChanged || !wasPreviouslyBlocked) && isJourneyActive) {
        toast.error('🚨 Red Zone Detected. Automatically redirected to the safest alternate route.', {
          description: `Obstruction detected on ${activeCorridor.name} (${activeCorridor.highwayCode}). Safe bypass active: ${(activeCorridor.safeAlternateRoute || activeCorridor.detourRoute).title}.`,
          duration: 5500
        });
        setRouteVersion(v => v + 1);
      } else if (!isMatchingRoadBlocked && wasPreviouslyBlocked && isJourneyActive) {
        toast.success(`✅ Route Restored: ${activeCorridor.name} (${activeCorridor.highwayCode}) is Clear. Safest Route Active.`, {
          description: `Primary route back in optimal service. Resuming standard highway.`,
          duration: 4500
        });
        setRouteVersion(v => v + 1);
      }
    }

    prevBlockedRoadsRef.current = currentBlocked;
    prevActiveCorridorIdRef.current = activeCorridorId;
  }, [roads, activeCorridorId, isJourneyActive]);

  // Real-Time Cross-Tab / Cross-Portal Synchronization via BroadcastChannel
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (!event.data) return;

        if (event.data.type === 'ROAD_STATUS_UPDATED') {
          console.log('[REAL-TIME SYNC] Road Status Update:', event.data.payload);
          setRoads(prevRoads => 
            prevRoads.map(r => 
              r.id === event.data.payload.id 
                ? { ...r, status: event.data.payload.status, hazard_notes: event.data.payload.hazard_notes, updated_at: event.data.payload.updated_at }
                : r
            )
          );
          setLastUpdated(new Date());
          setSyncStatus('synced');
        } else if (event.data.type === 'NEW_FIELD_REPORT') {
          console.log('[REAL-TIME SYNC] New Citizen Field Report Received:', event.data.payload);
          setFieldReports(prev => [event.data.payload, ...prev]);
          toast.info(`📸 New Field Report: ${event.data.payload.incidentType}`, {
            description: `Geo-tagged evidence submitted near ${event.data.payload.nearestHighway}.`,
            duration: 5000
          });
          setLastUpdated(new Date());
        } else if (event.data.type === 'REPORT_VERIFIED') {
          console.log('[REAL-TIME SYNC] Report Verified & Actioned:', event.data.payload);
          setFieldReports(prev => 
            prev.map(rpt => rpt.id === event.data.payload.reportId ? { ...rpt, status: 'verified', verifiedAt: new Date().toISOString() } : rpt)
          );
          setLastUpdated(new Date());
        } else if (event.data.type === 'REPORT_REJECTED') {
          console.log('[REAL-TIME SYNC] Report Rejected:', event.data.payload);
          setFieldReports(prev => 
            prev.map(rpt => rpt.id === event.data.payload.reportId ? { ...rpt, status: 'rejected', rejectReason: event.data.payload.reason } : rpt)
          );
          setLastUpdated(new Date());
        } else if (event.data.type === 'DATABASE_RESET') {
          setRoads(initialHighwaysData.features.map(f => ({ ...f.properties, geometry: f.geometry })));
          setFieldReports(INITIAL_FIELD_REPORTS);
          setLastUpdated(new Date());
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment:', e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  // Update Road Status (Triggered by Govt Portal or Citizen Simulator)
  const updateRoadStatus = useCallback(async (roadId, newStatus, hazardNotes = null) => {
    setSyncStatus('syncing');

    let updatedRoadObj = null;

    setRoads(prevRoads => {
      const nextRoads = prevRoads.map(road => {
        if (road.id === roadId) {
          const updated = {
            ...road,
            status: newStatus,
            hazard_notes: hazardNotes !== null ? hazardNotes : road.hazard_notes,
            updated_at: new Date().toISOString()
          };
          updatedRoadObj = updated;
          return updated;
        }
        return road;
      });
      return nextRoads;
    });

    setLastUpdated(new Date());

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({
        type: 'ROAD_STATUS_UPDATED',
        payload: {
          id: roadId,
          status: newStatus,
          hazard_notes: hazardNotes,
          updated_at: new Date().toISOString()
        }
      });
      channel.close();
    } catch (e) {
      console.warn('Broadcast failed:', e);
    }

    setSyncStatus('synced');
    return updatedRoadObj;
  }, []);

  // Phase 3: Submit New Citizen Field Report (Online Pipeline)
  const submitFieldReport = useCallback(async (reportData) => {
    const newReport = {
      id: `rpt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      severity: 'High',
      ...reportData
    };

    setFieldReports(prev => [newReport, ...prev]);
    setLastUpdated(new Date());

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({
        type: 'NEW_FIELD_REPORT',
        payload: newReport
      });
      channel.close();
    } catch (e) {
      console.warn('Broadcast report failed:', e);
    }

    return newReport;
  }, []);

  // Phase 4: Save to Offline Queue & Trigger SMS Fallback
  const queueOfflineHazard = useCallback(async (reportData) => {
    const offlineReport = {
      id: `off-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      isOfflineQueued: true,
      ...reportData
    };

    await saveOfflineReport(offlineReport);
    await refreshOfflineQueue();

    return offlineReport;
  }, [refreshOfflineQueue]);

  // Phase 4: Flush Offline Queue to Backend / Live State upon Reconnect
  const flushOfflineQueue = useCallback(async () => {
    const currentQueue = await getOfflineReports();
    if (!currentQueue || currentQueue.length === 0) return;

    setIsSyncingOfflineQueue(true);

    try {
      for (const item of currentQueue) {
        const { isOfflineQueued, queuedAt, syncStatus, ...cleanReport } = item;
        await submitFieldReport({
          ...cleanReport,
          description: `[AUTO-SYNCED OFFLINE REPORT] ${cleanReport.description}`
        });
        await deleteOfflineReport(item.id);
      }

      await clearOfflineQueue();
      await refreshOfflineQueue();

      toast.success('⚡ Offline Queue Flushed & Synchronized!', {
        description: `Successfully uploaded ${currentQueue.length} cached field report(s) to NER Command Room.`,
        duration: 5000
      });
    } catch (err) {
      console.error('Error flushing offline queue:', err);
      toast.error('Failed to sync some offline reports.');
    } finally {
      setIsSyncingOfflineQueue(false);
    }
  }, [submitFieldReport, refreshOfflineQueue]);

  // Auto-flush when isOnline transitions from false -> true (Feature C)
  useEffect(() => {
    if (isOnline && !prevOnlineRef.current) {
      // Reconnected
      flushOfflineQueue();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, flushOfflineQueue]);

  // Phase 3: Verify Report & Automatically Block Highway (Feature D)
  const verifyAndBlockReport = useCallback(async (reportId, roadId, hazardNotes) => {
    setFieldReports(prev => 
      prev.map(rpt => rpt.id === reportId ? { ...rpt, status: 'verified', verifiedAt: new Date().toISOString() } : rpt)
    );

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({
        type: 'REPORT_VERIFIED',
        payload: { reportId, roadId }
      });
      channel.close();
    } catch (e) {}

    if (roadId) {
      await updateRoadStatus(roadId, 'blocked', hazardNotes || `[VERIFIED FIELD REPORT] Incident confirmed by Sentinel Ground Control.`);
    }

    toast.success('Report Verified & Highway Blocked', {
      description: `Corridor marked as Blocked. Alternate detour routing engaged across Citizen portals.`,
      duration: 5000
    });
  }, [updateRoadStatus]);

  // Phase 3: Reject Field Report
  const rejectFieldReport = useCallback((reportId, reason = 'False alarm / Duplicate submission') => {
    setFieldReports(prev => 
      prev.map(rpt => rpt.id === reportId ? { ...rpt, status: 'rejected', rejectReason: reason } : rpt)
    );

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({
        type: 'REPORT_REJECTED',
        payload: { reportId, reason }
      });
      channel.close();
    } catch (e) {}

    toast.info('Field Report Rejected', {
      description: `Report marked as dismissed. No roadblock triggered.`,
      duration: 4000
    });
  }, []);

  // Quick toggle helper for active corridor
  const toggleActiveCorridorBlockage = useCallback(() => {
    const activeCorridor = ROUTE_CORRIDORS.find(c => c.id === activeCorridorId);
    if (!activeCorridor) return;
    const road = roads.find(r => r.id === activeCorridor.linkedRoadId);
    if (!road) return;
    const nextStatus = road.status === 'blocked' ? 'clear' : 'blocked';
    updateRoadStatus(
      road.id, 
      nextStatus, 
      nextStatus === 'blocked' 
        ? `[DISASTER ALERT] Heavy mudslide & boulder collapse at ${activeCorridor.hazardInfo?.locationName}. Complete transit halt.`
        : 'All 4 lanes operational. Sensor-based slope monitoring clear.'
    );
  }, [activeCorridorId, roads, updateRoadStatus]);

  // Reset to Baseline demo state
  const resetToDefault = useCallback(() => {
    const defaultData = initialHighwaysData.features.map(f => ({
      ...f.properties,
      geometry: f.geometry
    }));
    setRoads(defaultData);
    setFieldReports(INITIAL_FIELD_REPORTS);
    clearOfflineQueue();
    setOfflineQueue([]);
    localStorage.removeItem(STORAGE_KEY_ROADS);
    localStorage.removeItem(STORAGE_KEY_REPORTS);
    setLastUpdated(new Date());

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: 'DATABASE_RESET' });
      channel.close();
    } catch (e) {}
  }, []);

  // Statistics
  const stats = {
    total: roads.length,
    clear: roads.filter(r => r.status === 'clear').length,
    warning: roads.filter(r => r.status === 'warning').length,
    blocked: roads.filter(r => r.status === 'blocked').length,
    pendingReports: fieldReports.filter(r => r.status === 'pending').length,
    verifiedReports: fieldReports.filter(r => r.status === 'verified').length,
    offlineQueuedCount: offlineQueue.length
  };

  return (
    <RoadContext.Provider
      value={{
        roads,
        selectedRoadId,
        setSelectedRoadId,
        updateRoadStatus,
        resetToDefault,
        stats,
        lastUpdated,
        syncStatus,
        // Phase 2 Routing
        activeCorridorId,
        setActiveCorridorId,
        isJourneyActive,
        setIsJourneyActive,
        routeVersion,
        toggleActiveCorridorBlockage,
        // Phase 3 Field Reports
        fieldReports,
        selectedReportId,
        setSelectedReportId,
        submitFieldReport,
        verifyAndBlockReport,
        rejectFieldReport,
        // Phase 4 Offline Failsafes
        isOnline,
        isBrowserOnline,
        isSimulatedOffline,
        toggleOfflineSimulation,
        offlineQueue,
        isSyncingOfflineQueue,
        queueOfflineHazard,
        flushOfflineQueue,
        refreshOfflineQueue
      }}
    >
      {children}
    </RoadContext.Provider>
  );
};

export const useRoads = () => {
  const context = useContext(RoadContext);
  if (!context) {
    throw new Error('useRoads must be used within a RoadProvider');
  }
  return context;
};
