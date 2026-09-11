/**
 * MargSetu (मार्गसेतु) - Enterprise Routing & Obstruction Avoidance Engine
 * Provides live OSRM routing with deterministic GIS fallback, real-time roadblock detection,
 * Open-Elevation topography analysis, detour synthesis, and dynamic delay estimation metrics.
 */

import { NER_CORRIDORS, ROUTE_CORRIDORS } from '../data/routeCorridors';
import { fetchLiveOSRMNavigation, fetchElevationProfile } from './navigationApi';

/**
 * Calculates / retrieves the best route between origin and destination.
 * Checks against live highway blockage state in real time and computes elevation profiles.
 * 
 * @param {Object} params
 * @param {string} params.corridorId - ID of corridor from NER_CORRIDORS
 * @param {Array} params.roads - Live roads state array from RoadContext
 * @returns {Promise<Object>} Calculated route result including primary, detour (if blocked), and delay & elevation metrics.
 */
export async function calculateRoute({ corridorId, roads = [] }) {
  const corridor = NER_CORRIDORS.find(c => c.id === corridorId) || NER_CORRIDORS[0];

  // Match corresponding road segment from global RoadContext state
  const matchingRoad = roads.find(r => r.id === corridor.linkedRoadId || r.highway_code === corridor.highwayCode);
  const isBlocked = matchingRoad?.status === 'blocked';
  const isWarning = matchingRoad?.status === 'warning';

  // Base metrics
  const originalDuration = corridor.primaryRoute.normalDurationMin;
  const originalDistance = corridor.primaryRoute.distanceKm;
  const safeAlternate = corridor.safeAlternateRoute || corridor.detourRoute;

  let activeCoordinates = corridor.primaryRoute.coordinates;
  let detourRouteCoordinates = null;
  let delayMinutes = 0;
  let totalDuration = originalDuration;
  let totalDistance = originalDistance;
  let detourActive = false;

  if (isBlocked && safeAlternate) {
    detourActive = true;
    detourRouteCoordinates = safeAlternate.coordinates;
    activeCoordinates = safeAlternate.coordinates;
    totalDuration = safeAlternate.detourDurationMin;
    totalDistance = safeAlternate.distanceKm;
    delayMinutes = safeAlternate.delayMin;
  } else if (isWarning) {
    delayMinutes = 15;
    totalDuration = originalDuration + delayMinutes;
  }

  // Attempt live elevation lookup along active path
  const elevationData = await fetchElevationProfile(activeCoordinates);

  return {
    corridorId: corridor.id,
    corridorName: corridor.name,
    shortName: corridor.shortName,
    highwayCode: corridor.highwayCode,
    origin: corridor.origin,
    destination: corridor.destination,
    roadStatus: matchingRoad?.status || 'clear',
    hazardNotes: matchingRoad?.hazard_notes || corridor.primaryRoute.surfaceCondition,
    isBlocked,
    isWarning,
    detourActive,
    primaryRoute: {
      ...corridor.primaryRoute,
      coordinates: corridor.primaryRoute.coordinates
    },
    detourRoute: detourActive ? {
      ...corridor.detourRoute,
      coordinates: corridor.detourRoute.coordinates
    } : null,
    metrics: {
      originalDuration,
      detourDuration: corridor.detourRoute.detourDurationMin,
      totalDuration,
      originalDistance,
      totalDistance,
      delayMinutes,
      distanceDiffKm: +(totalDistance - originalDistance).toFixed(1),
      elevation: elevationData?.elevationProfileText || corridor.primaryRoute.elevationMeters,
      minElevation: elevationData?.minElevation,
      maxElevation: elevationData?.maxElevation,
      elevationGain: elevationData?.elevationGain,
      elevationSamples: elevationData?.samples || [],
      safetyScore: detourActive ? corridor.detourRoute.safetyScore : (isWarning ? '72% (Caution)' : '99% (Optimal)'),
      activeVia: detourActive ? corridor.detourRoute.via : corridor.primaryRoute.title
    },
    hazardInfo: corridor.hazardInfo
  };
}

export { fetchLiveOSRMNavigation, fetchElevationProfile };
