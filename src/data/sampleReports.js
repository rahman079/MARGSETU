/**
 * MargSetu (मार्गसेतु) - Phase 3 Sample Field Reports & Preset Evidence Photos
 * High-quality emergency incident presets for the North-Eastern Region with reliable static images & inline SVG fallbacks.
 */

// Helper to generate realistic incident preview SVG data URLs as offline fallbacks
export const createIncidentSVG = (title, color, pattern) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <circle cx="200" cy="110" r="45" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>
      <path d="${pattern}" fill="${color}"/>
      <text x="200" y="190" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${title}</text>
      <text x="200" y="212" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle">Geo-Tagged Field Proof &bull; MargSetu Sentinel</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const PRESET_INCIDENT_PHOTOS = [
  {
    id: 'preset-landslide-1',
    label: 'Massive Mudslide & Boulders',
    incidentType: 'Landslide / Mudslide',
    imageUrl: '/assets/images/landslide_nh6.jpg',
    dataUrl: '/assets/images/landslide_nh6.jpg',
    fallbackSvg: createIncidentSVG(
      'MUD & ROCK DEBRIS BLOCKAGE',
      '#ef4444',
      'M 185 100 L 200 75 L 215 100 L 205 100 L 205 130 L 195 130 L 195 100 Z M 175 125 L 225 125 L 200 90 Z'
    )
  },
  {
    id: 'preset-flood-1',
    label: 'Flash Flood & Highway Inundation',
    incidentType: 'Flash Flooding / Inundation',
    imageUrl: '/assets/images/flood_nh27.jpg',
    dataUrl: '/assets/images/flood_nh27.jpg',
    fallbackSvg: createIncidentSVG(
      'FLASH FLOOD WATER OVERFLOW',
      '#06b6d4',
      'M 180 110 C 190 100 210 100 220 110 C 230 120 250 120 260 110 L 260 130 C 250 140 230 140 220 130 C 210 120 190 120 180 130 Z M 160 95 C 170 85 190 85 200 95 C 210 105 230 105 240 95'
    )
  },
  {
    id: 'preset-bridge-1',
    label: 'High Altitude Rockfall Pass',
    incidentType: 'Active Rockfall / Boulder Collapse',
    imageUrl: '/assets/images/rockfall_sela.jpg',
    dataUrl: '/assets/images/rockfall_sela.jpg',
    fallbackSvg: createIncidentSVG(
      'ROCKFALL & BOULDER COLLAPSE',
      '#f59e0b',
      'M 170 125 L 170 95 L 230 95 L 230 125 L 215 125 L 215 105 L 185 105 L 185 125 Z M 195 105 L 205 105 L 205 125 L 195 125 Z'
    )
  },
  {
    id: 'preset-subsidence-1',
    label: 'Road Embankment Subsidence',
    incidentType: 'Road Subsidence / Cave-in',
    imageUrl: '/assets/images/road_cavein.jpg',
    dataUrl: '/assets/images/road_cavein.jpg',
    fallbackSvg: createIncidentSVG(
      'ROAD EMBANKMENT SUBSIDENCE',
      '#f97316',
      'M 175 90 L 195 130 L 205 110 L 225 135 L 210 95 Z'
    )
  }
];

export const INITIAL_FIELD_REPORTS = [
  {
    id: 'rpt-001',
    incidentType: 'Landslide / Mudslide',
    title: 'Major hill slide across NH-6 near Jorabat',
    description: 'Boulders and heavy mud slurry over 150 meters. Both inbound lanes completely submerged. Heavy excavators required.',
    latitude: 26.0250,
    longitude: 91.8210,
    accuracyMeters: 4.2,
    nearestHighway: 'NH-6 Guwahati to Shillong Corridor',
    linkedRoadId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    status: 'pending', // 'pending' | 'verified' | 'rejected'
    reporterRole: 'Citizen Driver (Truck Fleet #AS-01-GB)',
    photoUrl: '/assets/images/landslide_nh6.jpg',
    fallbackSvg: PRESET_INCIDENT_PHOTOS[0].fallbackSvg,
    severity: 'High'
  },
  {
    id: 'rpt-002',
    incidentType: 'Road Subsidence / Cave-in',
    title: 'Pavement collapse at Chumukedima Km 24',
    description: 'Road foundation washed away by torrential river current. 2-meter deep fissure across carriage way.',
    latitude: 25.8234,
    longitude: 93.8122,
    accuracyMeters: 3.5,
    nearestHighway: 'NH-2 Dimapur-Imphal Lifeline',
    linkedRoadId: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    status: 'verified',
    reporterRole: 'Local SDRF Volunteer',
    photoUrl: '/assets/images/road_cavein.jpg',
    fallbackSvg: PRESET_INCIDENT_PHOTOS[3].fallbackSvg,
    severity: 'Critical'
  },
  {
    id: 'rpt-003',
    incidentType: 'Flash Flooding / Inundation',
    title: 'Water logging near Bhalukpong Gate',
    description: 'River water overflowing low-lying culvert by 1.5 feet. Small passenger cars advised to halt.',
    latitude: 26.9000,
    longitude: 92.6500,
    accuracyMeters: 6.0,
    nearestHighway: 'NH-13 Trans-Arunachal Sela Corridor',
    linkedRoadId: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 mins ago
    status: 'pending',
    reporterRole: 'Tourist Bus Driver',
    photoUrl: '/assets/images/flood_nh27.jpg',
    fallbackSvg: PRESET_INCIDENT_PHOTOS[1].fallbackSvg,
    severity: 'Medium'
  },
  {
    id: 'rpt-004',
    incidentType: 'Active Rockfall / Boulder Collapse',
    title: 'Active rockfall along Dirang Slopes',
    description: 'Boulders falling onto highway carriageway. Sela Tunnel bypass recommended.',
    latitude: 27.3500,
    longitude: 92.2500,
    accuracyMeters: 4.8,
    nearestHighway: 'NH-13 Tezpur to Tawang Highway',
    linkedRoadId: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    status: 'pending',
    reporterRole: 'BRO Field Patrol',
    photoUrl: '/assets/images/rockfall_sela.jpg',
    fallbackSvg: PRESET_INCIDENT_PHOTOS[2].fallbackSvg,
    severity: 'High'
  }
];

export const INCIDENT_TYPES = [
  'Landslide / Mudslide',
  'Active Rockfall / Boulder Collapse',
  'Bridge Collapse / Damage',
  'Flash Flooding / Inundation',
  'Road Subsidence / Cave-in',
  'Avalanche / Heavy Snow',
  'Tree Fall / Debris'
];
