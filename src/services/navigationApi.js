/**
 * MargSetu (मार्गसेतु) - Navigation, Elevation & Basemap GIS API Service
 * Centralized integration for:
 * 1. Basemap Tile URLs (CARTO Light Positron & OpenStreetMap Standard)
 * 2. OSRM Live Driving & Road Geometry API
 * 3. Open-Elevation Topography API with fallback terrain model
 */

export const MAP_CONFIG = {
  // Basemap 1: CARTO Light Positron (Clean Glassmorphism Aesthetic)
  CARTO_TILES: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  
  // Basemap 2: OpenStreetMap Standard
  OSM_TILES: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  
  // OSRM Public Driving Routing API (No API key needed)
  OSRM_ENDPOINT: "https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson&steps=true&alternatives=true",
  
  // Topography & Elevation API
  ELEVATION_ENDPOINT: "https://api.open-elevation.com/api/v1/lookup",

  ATTRIBUTIONS: {
    CARTO: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    OSM: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

/**
 * Fetches real-time driving route geometry and turn-by-turn directions from OSRM API
 */
export async function fetchLiveOSRMNavigation(origin, destination, alternatives = true) {
  try {
    const [lat1, lon1] = origin;
    const [lat2, lon2] = destination;

    const url = MAP_CONFIG.OSRM_ENDPOINT
      .replace('{lon1}', lon1)
      .replace('{lat1}', lat1)
      .replace('{lon2}', lon2)
      .replace('{lat2}', lat2);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const primary = data.routes[0];
        const latLngs = primary.geometry.coordinates.map(c => [c[1], c[0]]);

        const steps = (primary.legs && primary.legs[0]?.steps) || [];
        const turnByTurn = steps.map(s => ({
          instruction: s.maneuver?.type ? `${s.maneuver.type} onto ${s.name || 'unnamed road'}` : s.name,
          distanceMeters: Math.round(s.distance),
          durationSeconds: Math.round(s.duration)
        }));

        let alternateRoutes = [];
        if (data.routes.length > 1) {
          alternateRoutes = data.routes.slice(1).map(alt => ({
            coordinates: alt.geometry.coordinates.map(c => [c[1], c[0]]),
            distanceKm: +(alt.distance / 1000).toFixed(1),
            durationMin: Math.round(alt.duration / 60)
          }));
        }

        return {
          success: true,
          coordinates: latLngs,
          distanceKm: +(primary.distance / 1000).toFixed(1),
          durationMin: Math.round(primary.duration / 60),
          turnByTurn,
          alternateRoutes
        };
      }
    }
  } catch (err) {
    console.debug('[OSRM] Live network route fallback engaged:', err.message);
  }

  return { success: false };
}

/**
 * Queries the Open-Elevation API for elevation profiles along a given route
 */
export async function fetchElevationProfile(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  const sampleCount = Math.min(coordinates.length, 10);
  const step = Math.max(1, Math.floor(coordinates.length / sampleCount));
  const sampledCoords = [];

  for (let i = 0; i < coordinates.length; i += step) {
    sampledCoords.push(coordinates[i]);
    if (sampledCoords.length >= sampleCount) break;
  }
  if (sampledCoords[sampledCoords.length - 1] !== coordinates[coordinates.length - 1]) {
    sampledCoords.push(coordinates[coordinates.length - 1]);
  }

  const payload = {
    locations: sampledCoords.map(([lat, lng]) => ({
      latitude: +lat.toFixed(5),
      longitude: +lng.toFixed(5)
    }))
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(MAP_CONFIG.ELEVATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const elevations = data.results.map(r => r.elevation);
        const minElevation = Math.min(...elevations);
        const maxElevation = Math.max(...elevations);
        const elevationGain = Math.max(0, maxElevation - minElevation);

        return {
          success: true,
          minElevation,
          maxElevation,
          elevationGain,
          elevationProfileText: `${minElevation}m ➔ ${maxElevation}m (+${elevationGain}m)`,
          samples: data.results.map((r, index) => ({
            index,
            lat: r.latitude,
            lng: r.longitude,
            elevation: r.elevation
          }))
        };
      }
    }
  } catch (err) {
    console.debug('[Elevation API] Live lookup fallback:', err.message);
  }

  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  const baseElev = Math.round(55 + (firstPoint[0] - 25.0) * 120);
  const peakElev = Math.round(1490 + (lastPoint[0] - 25.0) * 180);

  return {
    success: true,
    minElevation: Math.min(baseElev, peakElev),
    maxElevation: Math.max(baseElev, peakElev),
    elevationGain: Math.abs(peakElev - baseElev),
    elevationProfileText: `${Math.min(baseElev, peakElev)}m ➔ ${Math.max(baseElev, peakElev)}m (+${Math.abs(peakElev - baseElev)}m)`,
    isEstimated: true,
    samples: sampledCoords.map((c, i) => ({
      index: i,
      lat: c[0],
      lng: c[1],
      elevation: Math.round(baseElev + ((peakElev - baseElev) * (i / (sampledCoords.length - 1 || 1))))
    }))
  };
}
