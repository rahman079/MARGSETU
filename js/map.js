/**
 * MargSetu - High-Performance Map Engine (Leaflet.js + Custom GIS Layers)
 * Supports dual-route rendering (Green Safe vs Red Blocked) and Regional Government GIS Radar.
 */

import { store, NER_ROUTES, NER_STATES, NER_LOCATIONS } from './store.js';

// Custom SVG Icons
export function createCustomIcon(type, status = 'active', size = 38) {
  let iconSvg = '';
  let color = '#ef4444';
  let pulseClass = 'hazard-pin-pulse';

  switch (type) {
    case 'landslide':
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      color = '#ef4444';
      break;
    case 'rockfall':
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 22 22 22"/><circle cx="12" cy="14" r="2"/></svg>`;
      color = '#ea580c';
      break;
    case 'flood':
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
      color = '#0284c7';
      break;
    case 'cavein':
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21v-4l4-3 4 3 4-3 2 7"/></svg>`;
      color = '#dc2626';
      break;
    case 'origin':
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="#ffffff"/></svg>`;
      color = '#1e3a8a';
      pulseClass = 'hazard-pin-pulse-blue';
      break;
    case 'destination':
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
      color = '#06b6d4';
      pulseClass = 'hazard-pin-pulse-cyan';
      break;
    case 'dispatched':
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;
      color = '#3b82f6';
      pulseClass = 'hazard-pin-pulse-blue';
      break;
    case 'verified_blocked':
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
      color = '#b91c1c';
      pulseClass = 'hazard-pin-pulse-red';
      break;
    default:
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
      color = '#f59e0b';
      break;
  }

  const html = `
    <div class="custom-map-pin ${pulseClass}" style="--pin-color: ${color}; width: ${size}px; height: ${size}px;">
      <div class="pin-inner">
        ${iconSvg}
      </div>
      <div class="pin-pulse-ring"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'leaflet-custom-marker-wrapper',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

// Citizen Map Controller
export class CitizenMapManager {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.routeLayers = {
      chosen: null,
      chosenGlow: null,
      safe: null,
      safeGlow: null,
      danger: null,
      dangerGlow: null,
      markers: []
    };
    this.currentTileLayer = null;
    this.tileType = 'streets';
  }

  init() {
    if (this.map) return;

    // Center on North East India (Assam/Meghalaya intersection)
    this.map = L.map(this.containerId, {
      center: [26.0, 92.2],
      zoom: 8,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this.setTileLayer('streets');

    // Subscribe to store changes to refresh route state if blocked by Gov
    store.subscribe(() => {
      if (this.activeRouteId) {
        this.renderRoute(this.activeRouteId);
      }
    });
  }

  setTileLayer(type = 'streets') {
    this.tileType = type;
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }

    // Default: OpenStreetMap Standard (OSM)
    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (type === 'carto' || type === 'light') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else if (type === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Earthstar Geographics';
    } else if (type === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO';
    }

    this.currentTileLayer = L.tileLayer(url, {
      attribution: attribution,
      maxZoom: 19
    }).addTo(this.map);
  }

  clearLayers() {
    if (this.routeLayers.chosen) this.map.removeLayer(this.routeLayers.chosen);
    if (this.routeLayers.chosenGlow) this.map.removeLayer(this.routeLayers.chosenGlow);
    if (this.routeLayers.safe) this.map.removeLayer(this.routeLayers.safe);
    if (this.routeLayers.safeGlow) this.map.removeLayer(this.routeLayers.safeGlow);
    if (this.routeLayers.danger) this.map.removeLayer(this.routeLayers.danger);
    if (this.routeLayers.dangerGlow) this.map.removeLayer(this.routeLayers.dangerGlow);

    this.routeLayers.markers.forEach(m => this.map.removeLayer(m));
    this.routeLayers.markers = [];
  }

  renderRoute(routeId) {
    const route = NER_ROUTES[routeId];
    if (!route || !this.map) return;

    this.activeRouteId = routeId;
    this.clearLayers();

    const originLoc = NER_LOCATIONS[route.origin];
    const destLoc = NER_LOCATIONS[route.destination];

    // 1. Origin Marker (Dark Blue)
    const originMarker = L.marker(originLoc.coords, {
      icon: createCustomIcon('origin', 'start', 34)
    }).addTo(this.map).bindPopup(`
      <div class="map-popup origin-popup">
        <span class="badge" style="background:#1e3a8a; color:#fff; font-weight:700;">START POINT</span>
        <h4>${originLoc.name}</h4>
        <p class="text-muted">${originLoc.state}</p>
      </div>
    `);
    this.routeLayers.markers.push(originMarker);

    // 2. Selected Destination Marker (Cyan)
    const destMarker = L.marker(destLoc.coords, {
      icon: createCustomIcon('destination', 'end', 34)
    }).addTo(this.map).bindPopup(`
      <div class="map-popup dest-popup">
        <span class="badge" style="background:#06b6d4; color:#fff; font-weight:700;">SELECTED DESTINATION</span>
        <h4>${destLoc.name}</h4>
        <p class="text-muted">${destLoc.state}</p>
      </div>
    `);
    this.routeLayers.markers.push(destMarker);

    // 3. Render DANGEROUS / BLOCKED Route (Red with dashed pattern & hazard alert pin)
    if (route.dangerRoute) {
      // Glow underlay
      this.routeLayers.dangerGlow = L.polyline(route.dangerRoute.path, {
        color: '#ef4444',
        weight: 10,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(this.map);

      // Main dashed red line
      this.routeLayers.danger = L.polyline(route.dangerRoute.path, {
        color: '#dc2626',
        weight: 5,
        opacity: 0.9,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(this.map);

      // Add Hazard Point Pin
      if (route.dangerRoute.hazardCoords) {
        const hazardPin = L.marker(route.dangerRoute.hazardCoords, {
          icon: createCustomIcon('landslide', 'blocked', 42)
        }).addTo(this.map).bindPopup(`
          <div class="map-popup hazard-popup">
            <span class="badge badge-red">CRITICAL HAZARD</span>
            <h4>${route.dangerRoute.hazardType}</h4>
            <p class="location-text">📍 ${route.dangerRoute.hazardLocation}</p>
            <div class="popup-image-container">
              <img src="${route.dangerRoute.hazardImage}" alt="Hazard" class="popup-thumb" onerror="this.onerror=null; this.src='/assets/images/landslide_nh6.jpg';" />
            </div>
            <p class="desc">${route.dangerRoute.description}</p>
            <div class="popup-alert-bar">⛔ ROUTE CLOSED - TRAFFIC DIVERTED</div>
          </div>
        `);
        this.routeLayers.markers.push(hazardPin);
      }
    }

    // 4. Render CHOSEN ROUTE (Highlighted in Dark Blue)
    const chosenPath = route.dangerRoute ? route.dangerRoute.path : (route.safeRoute ? route.safeRoute.path : []);
    if (chosenPath.length > 0) {
      this.routeLayers.chosenGlow = L.polyline(chosenPath, {
        color: '#1e40af',
        weight: 12,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(this.map);

      this.routeLayers.chosen = L.polyline(chosenPath, {
        color: '#1e3a8a',
        weight: 5.5,
        opacity: 0.95,
        lineJoin: 'round'
      }).addTo(this.map);
    }

    // 5. Render ALTERNATIVE / DETOUR ROUTE (Highlighted in Cyan)
    if (route.safeRoute && route.dangerRoute) {
      // Glow underlay in Cyan
      this.routeLayers.safeGlow = L.polyline(route.safeRoute.path, {
        color: '#06b6d4',
        weight: 12,
        opacity: 0.4,
        lineCap: 'round'
      }).addTo(this.map);

      // Main safe Cyan line (dashed alternative path)
      this.routeLayers.safe = L.polyline(route.safeRoute.path, {
        color: '#0891b2',
        weight: 5.5,
        opacity: 1,
        dashArray: '8, 8',
        lineJoin: 'round'
      }).addTo(this.map);

      // Safe Corridor midpoint badge in Cyan
      const midIdx = Math.floor(route.safeRoute.path.length / 2);
      const midCoord = route.safeRoute.path[midIdx];
      const safeBadge = L.marker(midCoord, {
        icon: L.divIcon({
          html: `<div class="safe-corridor-badge" style="background:#0891b2; border-color:#22d3ee; color:#ffffff; box-shadow:0 0 12px rgba(6,182,212,0.5);"><span>✓ ALTERNATIVE ROUTE (${route.safeRoute.eta})</span></div>`,
          className: 'safe-badge-marker',
          iconSize: [180, 28],
          iconAnchor: [90, 14]
        })
      }).addTo(this.map);
      this.routeLayers.markers.push(safeBadge);
    } else if (route.safeRoute && !route.dangerRoute) {
      // Direct chosen safe path in dark blue
      this.routeLayers.safeGlow = L.polyline(route.safeRoute.path, {
        color: '#1e40af',
        weight: 12,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(this.map);

      this.routeLayers.safe = L.polyline(route.safeRoute.path, {
        color: '#1e3a8a',
        weight: 6,
        opacity: 1,
        lineJoin: 'round'
      }).addTo(this.map);
    }

    // Fit map bounds smoothly
    const allCoords = [
      ...(route.safeRoute ? route.safeRoute.path : []),
      ...(route.dangerRoute ? route.dangerRoute.path : [])
    ];
    this.map.fitBounds(L.latLngBounds(allCoords), {
      padding: [50, 50],
      maxZoom: 11,
      animate: true
    });
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 150);
    }
  }
}

// Government Master Command Map Controller
export class GovMapManager {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.incidentMarkers = new Map();
    this.activeTileLayer = null;
  }

  init() {
    if (this.map) return;

    this.map = L.map(this.containerId, {
      center: [26.2, 93.0],
      zoom: 7,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Dark high-tech command center map style
    this.activeTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(this.map);

    this.refreshIncidentPins();

    // Subscribe to store updates
    store.subscribe(() => {
      this.refreshIncidentPins();
    });
  }

  refreshIncidentPins(stateFilter = 'all') {
    if (!this.map) return;

    // Remove old pins
    this.incidentMarkers.forEach(m => this.map.removeLayer(m));
    this.incidentMarkers.clear();

    const incidents = store.getIncidents({ state: stateFilter });

    incidents.forEach(inc => {
      if (inc.status === 'REJECTED_SPAM') return;

      let iconType = inc.type;
      let statusStyle = 'active';
      if (inc.status === 'VERIFIED_BLOCKED') statusStyle = 'verified_blocked';
      if (inc.status === 'RESCUE_DISPATCHED') statusStyle = 'dispatched';

      const marker = L.marker(inc.coords, {
        icon: createCustomIcon(iconType, statusStyle, 44)
      }).addTo(this.map);

      let statusBadge = `<span class="badge badge-amber">PENDING VERIFICATION</span>`;
      if (inc.status === 'VERIFIED_BLOCKED') {
        statusBadge = `<span class="badge badge-red">BLOCKED & ENFORCED</span>`;
      } else if (inc.status === 'RESCUE_DISPATCHED') {
        statusBadge = `<span class="badge badge-blue">RESCUE DISPATCHED</span>`;
      } else if (inc.status === 'RESOLVED_CLEARED') {
        statusBadge = `<span class="badge badge-green">CLEARED / SAFE</span>`;
      }

      const popupContent = `
        <div class="gov-map-popup">
          <div class="popup-head">
            <span class="incident-id">${inc.id}</span>
            ${statusBadge}
          </div>
          <h4>${inc.title}</h4>
          <p class="meta">📍 ${inc.locationName} (${inc.highway})</p>
          <p class="time">⏱ Reported: ${inc.timestamp} by ${inc.reportedBy}</p>
          <div class="popup-thumb-wrap">
            <img src="${inc.image}" alt="${inc.title}" class="gov-thumb" onerror="this.onerror=null; this.src='/assets/images/landslide_nh6.jpg';" />
          </div>
          <div class="gov-popup-actions">
            ${inc.status === 'PENDING_VERIFICATION' ? `
              <button class="btn btn-danger btn-xs" onclick="window.MargSetuApp.verifyIncident('${inc.id}')">Verify & Block</button>
              <button class="btn btn-primary btn-xs" onclick="window.MargSetuApp.openDispatchModal('${inc.id}')">Dispatch Help</button>
            ` : ''}
            ${inc.status === 'VERIFIED_BLOCKED' ? `
              <button class="btn btn-primary btn-xs" onclick="window.MargSetuApp.openDispatchModal('${inc.id}')">Dispatch Help</button>
            ` : ''}
            ${inc.status === 'RESCUE_DISPATCHED' ? `
              <button class="btn btn-success btn-xs" onclick="window.MargSetuApp.resolveIncident('${inc.id}')">Mark Cleared</button>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.incidentMarkers.set(inc.id, marker);
    });
  }

  panToIncident(incidentId) {
    const inc = store.getIncidentById(incidentId);
    if (!inc || !this.map) return;

    this.map.flyTo(inc.coords, 11, {
      duration: 1.2
    });

    const marker = this.incidentMarkers.get(incidentId);
    if (marker) {
      setTimeout(() => marker.openPopup(), 1300);
    }
  }

  focusState(stateId) {
    if (!this.map) return;
    const state = NER_STATES.find(s => s.id === stateId);
    if (!state) return;

    if (state.id === 'all') {
      this.map.flyTo([26.2, 93.0], 7);
    } else {
      this.map.flyTo(state.center, state.zoom);
    }
    this.refreshIncidentPins(stateId);
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 150);
    }
  }
}
