/**
 * MargSetu (मार्गसेतु) - Base Map Component (Phase 1, 2, 3, & 4)
 * Full-bleed interactive Leaflet map featuring:
 * - Dynamic Basemap Tile Switcher: CARTO Light Positron & OpenStreetMap Standard
 * - Glowing Indigo/Blue primary journey route with Topography / Elevation analysis
 * - Instant reactive Red blocked hazard zone rendering
 * - Dashed Green/Cyan safe detour bypass rendering
 * - Geo-tagged Citizen Field Report markers with photo popups
 */

import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRoads } from '../context/RoadContext';
import { NER_CORRIDORS, ROUTE_CORRIDORS } from '../data/routeCorridors';
import { MAP_CONFIG } from '../services/navigationApi';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Navigation, 
  MapPin, 
  AlertOctagon, 
  Sparkles, 
  Camera, 
  CheckCircle2,
  Layers,
  Mountain
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Status Color Tokens for Base Highways
const STATUS_COLORS = {
  clear: {
    primary: '#10B981',   // Bright Emerald Green
    glow: 'rgba(16, 185, 129, 0.35)',
    label: 'CLEAR / OPEN',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  warning: {
    primary: '#F59E0B',   // Amber Yellow
    glow: 'rgba(245, 158, 11, 0.35)',
    label: 'HAZARD WARNING',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  blocked: {
    primary: '#EF4444',   // Crimson Red
    glow: 'rgba(239, 68, 68, 0.35)',
    label: 'BLOCKED / CLOSED',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
  }
};

// Available Basemap Tile Providers
const BASEMAP_PROVIDERS = {
  carto: {
    name: 'CARTO Positron',
    url: MAP_CONFIG.CARTO_TILES,
    attribution: MAP_CONFIG.ATTRIBUTIONS.CARTO
  },
  osm: {
    name: 'OpenStreetMap',
    url: MAP_CONFIG.OSM_TILES,
    attribution: MAP_CONFIG.ATTRIBUTIONS.OSM
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Earthstar Geographics'
  }
};

// Custom SVG HTML Icons for Start, End, Hazard, and Citizen Field Reports
const createCustomIcon = (type, status = 'pending') => {
  if (type === 'start') {
    return L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-indigo-500/30 animate-ping"></span>
          <div class="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  if (type === 'destination') {
    return L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-cyan-400/40 animate-ping"></span>
          <div class="w-7 h-7 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 26]
    });
  }

  if (type === 'hazard') {
    return L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <span class="absolute w-9 h-9 rounded-full bg-rose-600/40 animate-ping"></span>
          <div class="w-8 h-8 rounded-xl bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs transform rotate-3">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  if (type === 'field-report') {
    const bgColor = status === 'verified' ? 'bg-rose-600' : (status === 'pending' ? 'bg-amber-500' : 'bg-slate-600');
    const pingColor = status === 'verified' ? 'bg-rose-500/40' : (status === 'pending' ? 'bg-amber-500/40' : 'bg-transparent');
    
    return L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <span class="absolute w-8 h-8 rounded-full ${pingColor} animate-ping"></span>
          <div class="w-7 h-7 rounded-xl ${bgColor} border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  return L.divIcon({
    className: 'custom-map-icon',
    html: `<div class="w-3 h-3 rounded-full bg-cyan-500 border border-white shadow-sm"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

// Map Viewport Controller to smoothly pan when corridor or report is selected
function MapViewController({ selectedRoadId, activeCorridorId, selectedReportId, fieldReports, isDetourActive, roads }) {
  const map = useMap();

  useEffect(() => {
    if (selectedReportId) {
      const report = fieldReports.find(r => r.id === selectedReportId);
      if (report && report.latitude && report.longitude) {
        map.flyTo([report.latitude, report.longitude], 11, {
          duration: 1.2
        });
        return;
      }
    }

    const activeCorridor = ROUTE_CORRIDORS.find(c => c.id === activeCorridorId);
    if (activeCorridor) {
      const coords = isDetourActive 
        ? [...activeCorridor.primaryRoute.coordinates, ...activeCorridor.detourRoute.coordinates]
        : activeCorridor.primaryRoute.coordinates;
      
      map.flyToBounds(coords, {
        padding: [90, 90],
        duration: 1.4,
        maxZoom: 10
      });
      return;
    }

    if (selectedRoadId) {
      const road = roads.find(r => r.id === selectedRoadId);
      if (road?.geometry?.coordinates) {
        const latLngs = road.geometry.coordinates.map(c => [c[1], c[0]]);
        map.flyToBounds(latLngs, {
          padding: [80, 80],
          duration: 1.2,
          maxZoom: 9
        });
      }
    }
  }, [selectedRoadId, activeCorridorId, selectedReportId, fieldReports, isDetourActive, map]);

  return null;
}

export default function BaseMap({ className = "w-full h-full" }) {
  const { 
    roads, 
    selectedRoadId, 
    setSelectedRoadId, 
    activeCorridorId, 
    isJourneyActive,
    fieldReports,
    selectedReportId,
    setSelectedReportId,
    verifyAndBlockReport
  } = useRoads();

  // Active Basemap Tile Type: 'osm' (Default: OSM Standard) | 'carto' | 'satellite'
  const [activeTileType, setActiveTileType] = useState('osm');

  const activeCorridor = useMemo(() => {
    return ROUTE_CORRIDORS.find(c => c.id === activeCorridorId) || ROUTE_CORRIDORS[0];
  }, [activeCorridorId]);

  const linkedRoad = roads.find(r => r.id === activeCorridor.linkedRoadId || r.highway_code === activeCorridor.highwayCode);
  const isBlocked = linkedRoad?.status === 'blocked';

  // NER Center Coordinates
  const NER_CENTER = [26.20, 92.93];
  const DEFAULT_ZOOM = 7;

  const currentBasemap = BASEMAP_PROVIDERS[activeTileType] || BASEMAP_PROVIDERS.carto;

  return (
    <div className={`relative ${className}`}>
      
      {/* Sleek Floating Basemap Tile Switcher (Top-Right of Map) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-md font-sans text-xs">
        <button
          onClick={() => setActiveTileType('carto')}
          className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
            activeTileType === 'carto'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          CARTO Positron
        </button>
        <button
          onClick={() => setActiveTileType('osm')}
          className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
            activeTileType === 'osm'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          OSM Standard
        </button>
        <button
          onClick={() => setActiveTileType('satellite')}
          className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
            activeTileType === 'satellite'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Satellite
        </button>
      </div>

      <MapContainer
        center={NER_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        className="w-full h-full z-0 font-sans"
        minZoom={5}
        maxZoom={15}
      >
        {/* Dynamic Basemap Tile Layer */}
        <TileLayer
          key={activeTileType}
          url={currentBasemap.url}
          attribution={currentBasemap.attribution}
          maxZoom={19}
        />

        <MapViewController 
          selectedRoadId={selectedRoadId} 
          activeCorridorId={activeCorridorId} 
          selectedReportId={selectedReportId}
          fieldReports={fieldReports}
          isDetourActive={isBlocked}
          roads={roads} 
        />

        {/* ========================================================================= */}
        {/* 1. BASE HIGHWAY NETWORK (Phase 1)                                          */}
        {/* ========================================================================= */}
        {roads.map(road => {
          const positions = road.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          const colorConfig = STATUS_COLORS[road.status] || STATUS_COLORS.clear;
          const isSelected = selectedRoadId === road.id;
          const isCurrentJourneyCorridor = isJourneyActive && (road.id === activeCorridor.linkedRoadId);

          return (
            <React.Fragment key={road.id}>
              <Polyline
                positions={positions}
                pathOptions={{
                  color: colorConfig.primary,
                  weight: isCurrentJourneyCorridor ? 3 : (isSelected ? 8 : 4.5),
                  opacity: isCurrentJourneyCorridor ? 0.35 : 0.85,
                  dashArray: road.status === 'blocked' ? '8, 8' : undefined,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
                eventHandlers={{
                  click: () => setSelectedRoadId(road.id)
                }}
              >
                <Tooltip sticky className="custom-map-tooltip">
                  <div className="px-1 py-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: colorConfig.primary }}
                      />
                      <span>{road.highway_code}: {road.road_name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Status: <strong style={{ color: colorConfig.primary }}>{colorConfig.label}</strong>
                    </div>
                  </div>
                </Tooltip>
              </Polyline>
            </React.Fragment>
          );
        })}

        {/* ========================================================================= */}
        {/* 2. DYNAMIC ACTIVE ROUTE LAYERS (Chosen Dark Blue vs Cyan Alternate Route)  */}
        {/* ========================================================================= */}
        {isJourneyActive && activeCorridor && (
          <>
            {/* Primary / Chosen Route Aura (Dark Blue Glow when Clear, Subtle Slate when Blocked) */}
            <Polyline
              positions={activeCorridor.primaryRoute.coordinates}
              pathOptions={{
                color: isBlocked ? '#94A3B8' : '#1e40af',
                weight: 12,
                opacity: isBlocked ? 0.15 : 0.35,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />

            {/* Chosen Route line: Solid Dark Blue (#1e3a8a) when Clear, Faded Muted Line when Blocked */}
            <Polyline
              positions={activeCorridor.primaryRoute.coordinates}
              pathOptions={{
                color: isBlocked ? '#94A3B8' : '#1e3a8a',
                weight: isBlocked ? 3.5 : 6,
                opacity: isBlocked ? 0.45 : 0.95,
                dashArray: isBlocked ? '6, 6' : undefined,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            >
              {!isBlocked && (
                <Tooltip sticky className="custom-map-tooltip">
                  <div className="px-1">
                    <div className="font-bold text-xs text-blue-900 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{activeCorridor.primaryRoute.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Chosen Route Active &bull; 100% Clear for Transit
                    </div>
                  </div>
                </Tooltip>
              )}
            </Polyline>

            {/* Blocked Zone Highlight (Solid Red Polyline) */}
            {isBlocked && activeCorridor.primaryRoute.blockedSegment && (
              <>
                <Polyline
                  positions={activeCorridor.primaryRoute.blockedSegment}
                  pathOptions={{
                    color: '#EF4444',
                    weight: 14,
                    opacity: 0.45,
                    lineCap: 'round'
                  }}
                />
                <Polyline
                  positions={activeCorridor.primaryRoute.blockedSegment}
                  pathOptions={{
                    color: '#DC2626',
                    weight: 6,
                    opacity: 1,
                    lineCap: 'round'
                  }}
                />

                {/* Hazard Marker at Obstruction */}
                {activeCorridor.hazardInfo && (
                  <Marker
                    position={activeCorridor.hazardInfo.coordinates}
                    icon={createCustomIcon('hazard')}
                  >
                    <Popup className="custom-map-popup">
                      <div className="p-1 min-w-[220px]">
                        <div className="flex items-center gap-1.5 text-rose-600 font-extrabold text-xs mb-1">
                          <AlertOctagon className="w-4 h-4" />
                          <span>ROADBLOCK OBSTRUCTION</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">
                          {activeCorridor.hazardInfo.locationName}
                        </h4>
                        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-900 mb-2">
                          <p><strong>Cause:</strong> {activeCorridor.hazardInfo.hazardType}</p>
                          <p className="text-[10px] text-rose-700 mt-0.5">
                            Status: {activeCorridor.hazardInfo.severity}
                          </p>
                        </div>
                        <p className="text-[9px] text-slate-400">
                          Auth: {activeCorridor.hazardInfo.reportingAuthority}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </>
            )}

            {/* Safe Alternate Route (Automatically Drawn in Glowing Cyan Line) */}
            {isBlocked && (activeCorridor.safeAlternateRoute || activeCorridor.detourRoute) && (
              <>
                {/* Glowing Detour Aura in Cyan */}
                <Polyline
                  positions={(activeCorridor.safeAlternateRoute || activeCorridor.detourRoute).coordinates}
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 12,
                    opacity: 0.35,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />

                {/* Main Cyan Detour Line */}
                <Polyline
                  positions={(activeCorridor.safeAlternateRoute || activeCorridor.detourRoute).coordinates}
                  pathOptions={{
                    color: '#0891B2',
                    weight: 5.5,
                    opacity: 0.95,
                    dashArray: '8, 8',
                    lineCap: 'round',
                    lineJoin: 'round',
                    className: 'detour-animated-polyline'
                  }}
                >
                  <Tooltip sticky className="custom-map-tooltip">
                    <div className="px-1">
                      <div className="font-bold text-xs text-cyan-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-500" />
                        <span>{(activeCorridor.safeAlternateRoute || activeCorridor.detourRoute).title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Safe Alternate Route &bull; +{(activeCorridor.safeAlternateRoute || activeCorridor.detourRoute).delayMin} mins delay
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
              </>
            )}

            {/* Start / Selected Destination Waypoints */}
            <Marker position={activeCorridor.origin.coordinates} icon={createCustomIcon('start')}>
              <Popup className="custom-map-popup">
                <div className="p-1">
                  <span className="text-[9px] font-bold uppercase text-indigo-600 block">Journey Start</span>
                  <strong className="text-xs text-slate-900">{activeCorridor.origin.name}</strong>
                </div>
              </Popup>
            </Marker>

            <Marker position={activeCorridor.destination.coordinates} icon={createCustomIcon('destination')}>
              <Popup className="custom-map-popup">
                <div className="p-1">
                  <span className="text-[9px] font-bold uppercase text-cyan-600 block">Selected Destination</span>
                  <strong className="text-xs text-slate-900">{activeCorridor.destination.name}</strong>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* ========================================================================= */}
        {/* 3. GEO-TAGGED CITIZEN FIELD REPORTS (Phase 3)                              */}
        {/* ========================================================================= */}
        {fieldReports.map(report => {
          if (!report.latitude || !report.longitude) return null;

          return (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={createCustomIcon('field-report', report.status)}
            >
              <Popup className="custom-map-popup">
                <div className="p-1 min-w-[240px] max-w-[280px]">
                  <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1.5 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-rose-500" />
                      <span>{report.incidentType}</span>
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      report.status === 'verified'
                        ? 'bg-rose-100 text-rose-700'
                        : (report.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600')
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>

                  {(report.photoUrl || report.fallbackSvg) && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={report.photoUrl || report.fallbackSvg}
                        alt="Proof"
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          if (report.fallbackSvg) e.target.src = report.fallbackSvg;
                        }}
                      />
                    </div>
                  )}

                  <p className="text-[11px] text-slate-700 font-medium leading-tight mb-2">
                    {report.description}
                  </p>

                  <div className="text-[10px] text-slate-500 space-y-0.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 mb-2">
                    <div><strong>Sector:</strong> {report.nearestHighway}</div>
                    <div><strong>GPS:</strong> {report.latitude}° N, {report.longitude}° E</div>
                    <div><strong>Reporter:</strong> {report.reporterRole}</div>
                  </div>

                  {report.status === 'pending' && (
                    <button
                      onClick={() => verifyAndBlockReport(report.id, report.linkedRoadId, `[VERIFIED EVIDENCE] ${report.incidentType}: ${report.description}`)}
                      className="w-full py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Block Highway</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
}
