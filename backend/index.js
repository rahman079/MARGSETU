/**
 * MargSetu (मार्गसेतु) - Express Backend Server (Phase 1)
 * REST API & Real-Time Sync Service for North Eastern Region Road Status
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory PostGIS-aligned Highway Database with GeoJSON Coordinates (Lon/Lat standard)
let highwaysDatabase = [
  {
    id: 'nh27-siliguri-guwahati',
    road_name: 'NH-27 Siliguri (WB) to Guwahati (Assam)',
    highway_code: 'NH-27',
    state: 'West Bengal / Assam',
    status: 'clear',
    length_km: 472.0,
    origin: 'Siliguri Junction, West Bengal',
    destination: 'Guwahati ISBT, Assam',
    hazard_notes: 'All 4 lanes operational. Srirampur border check clear.',
    last_updated_by: 'NHAI Regional Office Guwahati',
    updated_at: new Date().toISOString(),
    coordinates: [
      [88.3953, 26.7271],
      [88.4750, 26.8850],
      [89.1500, 26.6800],
      [89.5200, 26.4900],
      [89.9800, 26.4750],
      [90.5500, 26.4800],
      [91.0100, 26.4500],
      [91.4400, 26.4400],
      [91.6800, 26.2400],
      [91.7362, 26.1445]
    ]
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    road_name: 'NH-6 Guwahati–Shillong–Silchar',
    highway_code: 'NH-6',
    state: 'Meghalaya / Assam',
    status: 'clear',
    length_km: 312.0,
    origin: 'Guwahati ISBT, Assam',
    destination: 'Silchar Rongpur Trunk, Assam',
    hazard_notes: 'All 4 lanes operational. Sensor-based slope monitoring clear.',
    last_updated_by: 'NER Emergency Control Room (Govt ID #NER-409)',
    updated_at: new Date().toISOString(),
    coordinates: [
      [91.7362, 26.1445],
      [91.8100, 26.0500],
      [91.8600, 25.9000],
      [91.8933, 25.5788],
      [92.2000, 25.4500],
      [92.3500, 25.2600],
      [92.3685, 25.1415],
      [92.5900, 24.9800],
      [92.7789, 24.8333]
    ]
  },
  {
    id: 'nh715-guwahati-dibrugarh',
    road_name: 'NH-715 Guwahati–Upper Assam (Dibrugarh)',
    highway_code: 'NH-715',
    state: 'Assam',
    status: 'warning',
    length_km: 442.0,
    origin: 'Guwahati ISBT, Assam',
    destination: 'Dibrugarh Chowkidingee, Assam',
    hazard_notes: 'Kaziranga speed regulation in effect. 40 km/h camera monitored.',
    last_updated_by: 'Assam Highway Patrol',
    updated_at: new Date().toISOString(),
    coordinates: [
      [91.7362, 26.1445],
      [92.3500, 26.1800],
      [92.6800, 26.3500],
      [93.1711, 26.5775],
      [93.7500, 26.6500],
      [94.2200, 26.7500],
      [94.6300, 26.9800],
      [94.8500, 27.2800],
      [94.9120, 27.4728]
    ]
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    road_name: 'NH-13 Trans-Arunachal Road (Tezpur–Tawang)',
    highway_code: 'NH-13',
    state: 'Arunachal Pradesh / Assam',
    status: 'warning',
    length_km: 315.2,
    origin: 'Tezpur Mission Chariali, Assam',
    destination: 'Tawang Monastery, Arunachal Pradesh',
    hazard_notes: 'Active rockfall caution near Dirang. Sela Twin-Tube Tunnel fully operational.',
    last_updated_by: 'BRO Project Vartak (Commandant S. K. Nair)',
    updated_at: new Date().toISOString(),
    coordinates: [
      [92.7926, 26.6528],
      [92.6500, 26.9000],
      [92.4800, 27.1500],
      [92.4231, 27.2645],
      [92.2500, 27.3500],
      [92.1200, 27.4800],
      [92.0500, 27.5200],
      [91.9500, 27.5600],
      [91.8594, 27.5861]
    ]
  },
  {
    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    road_name: 'NH-2 Dimapur–Kohima–Imphal',
    highway_code: 'NH-2',
    state: 'Nagaland / Manipur',
    status: 'blocked',
    length_km: 212.0,
    origin: 'Dimapur Purana Bazar, Nagaland',
    destination: 'Imphal Kangla Fort, Manipur',
    hazard_notes: 'Severe landslide and road subsidence at Chumukedima-Kohima Km 28. Rerouting via Niuland-Peren Bypass.',
    last_updated_by: 'Nagaland SDRF & Manipur Traffic Command',
    updated_at: new Date().toISOString(),
    coordinates: [
      [93.7266, 25.9090],
      [93.7800, 25.8800],
      [93.8122, 25.8234],
      [93.8800, 25.8200],
      [94.1086, 25.6751],
      [94.1600, 25.5600],
      [94.1280, 25.5050],
      [94.0750, 25.3900],
      [94.0200, 25.2650],
      [93.9720, 25.1480],
      [93.8920, 24.9650],
      [93.9368, 24.8170]
    ]
  },
  {
    id: 'nh306-silchar-aizawl',
    road_name: 'NH-306 Silchar–Aizawl Lifeline',
    highway_code: 'NH-306',
    state: 'Assam / Mizoram',
    status: 'warning',
    length_km: 178.0,
    origin: 'Silchar Rongpur, Assam',
    destination: 'Aizawl Treasury Square, Mizoram',
    hazard_notes: 'Single lane convoy movement at Vairengte slope section.',
    last_updated_by: 'Mizoram Disaster Management',
    updated_at: new Date().toISOString(),
    coordinates: [
      [92.7789, 24.8333],
      [92.7500, 24.6200],
      [92.7650, 24.4800],
      [92.7600, 24.4100],
      [92.7300, 24.2800],
      [92.6800, 24.2100],
      [92.6900, 23.9500],
      [92.7200, 23.8200],
      [92.7173, 23.7307]
    ]
  },
  {
    id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    road_name: 'NH-8 Tripura Main Road (Silchar–Agartala)',
    highway_code: 'NH-8',
    state: 'Tripura / Assam',
    status: 'clear',
    length_km: 254.0,
    origin: 'Silchar Rongpur Trunk, Assam',
    destination: 'Agartala Motorstand, Tripura',
    hazard_notes: 'All sectors clear. Atharamura pass road widened with active rain monitoring.',
    last_updated_by: 'Tripura State Disaster Management Authority',
    updated_at: new Date().toISOString(),
    coordinates: [
      [92.7789, 24.8333],
      [92.3590, 24.8640],
      [92.2410, 24.4920],
      [92.1640, 24.3750],
      [92.0250, 24.1620],
      [91.8520, 23.9210],
      [91.6020, 23.8340],
      [91.4310, 23.8290],
      [91.2868, 23.8315]
    ]
  },
  {
    id: 'nh10-siliguri-gangtok',
    road_name: 'NH-10 Siliguri–Gangtok Teesta Gorge Highway',
    highway_code: 'NH-10',
    state: 'West Bengal / Sikkim',
    status: 'blocked',
    length_km: 114.0,
    origin: 'Siliguri Junction, West Bengal',
    destination: 'Gangtok MG Marg, Sikkim',
    hazard_notes: 'Teesta water level surge and 29th Mile mudslides. Alternate via Lava-Reshi active.',
    last_updated_by: 'BRO Swastik & Sikkim SDMA',
    updated_at: new Date().toISOString(),
    coordinates: [
      [88.3953, 26.7271],
      [88.4750, 26.8850],
      [88.4500, 26.9600],
      [88.4710, 27.0520],
      [88.5100, 27.1000],
      [88.5250, 27.1700],
      [88.5000, 27.2300],
      [88.5700, 27.2900],
      [88.6138, 27.3314]
    ]
  },
  {
    id: 'nh702-guwahati-mokokchung',
    road_name: 'NH-702 Guwahati–Northeast Nagaland (Mokokchung)',
    highway_code: 'NH-702',
    state: 'Assam / Nagaland',
    status: 'clear',
    length_km: 385.0,
    origin: 'Guwahati ISBT, Assam',
    destination: 'Mokokchung Town Square, Nagaland',
    hazard_notes: 'Clear conditions along Mariani and Changtongya corridor.',
    last_updated_by: 'Nagaland PWD Highway Division',
    updated_at: new Date().toISOString(),
    coordinates: [
      [91.7362, 26.1445],
      [92.6800, 26.3500],
      [94.2200, 26.7500],
      [94.3200, 26.6600],
      [94.4920, 26.6850],
      [94.5300, 26.5400],
      [94.5100, 26.4200],
      [94.5262, 26.3255]
    ]
  },
  {
    id: 'nh102-imphal-moreh',
    road_name: 'NH-102 Imphal–Moreh Asian Highway (AH-1)',
    highway_code: 'NH-102',
    state: 'Manipur',
    status: 'warning',
    length_km: 108.0,
    origin: 'Imphal Kangla, Manipur',
    destination: 'Moreh ICP Border Post, Manipur',
    hazard_notes: 'Dense fog alert at Tengnoupal pass. Speed limit 30 km/h.',
    last_updated_by: 'Manipur Highway Security',
    updated_at: new Date().toISOString(),
    coordinates: [
      [93.9368, 24.8170],
      [93.9900, 24.6300],
      [94.0200, 24.4900],
      [94.0800, 24.4400],
      [94.1520, 24.3980],
      [94.2200, 24.3200],
      [94.3015, 24.2442]
    ]
  },
  {
    id: 'nh17-dhubri-guwahati',
    road_name: 'NH-17 Dhubri–Goalpara–Guwahati',
    highway_code: 'NH-17',
    state: 'Assam',
    status: 'clear',
    length_km: 278.0,
    origin: 'Dhubri Port Terminal, Assam',
    destination: 'Guwahati Jalukbari, Assam',
    hazard_notes: 'Smooth transit across Goalpara Naranarayan bridge.',
    last_updated_by: 'Assam PWD Road Safety',
    updated_at: new Date().toISOString(),
    coordinates: [
      [89.9744, 26.0207],
      [90.2300, 26.1000],
      [90.6200, 26.1700],
      [90.7320, 25.9860],
      [91.0100, 25.9950],
      [91.2500, 26.0000],
      [91.5600, 26.1000],
      [91.7362, 26.1445]
    ]
  },
  {
    id: 'nh206-shillong-dawki',
    road_name: 'NH-206 Shillong–Dawki Indo-Bangladesh Border Highway',
    highway_code: 'NH-206',
    state: 'Meghalaya',
    status: 'clear',
    length_km: 82.0,
    origin: 'Shillong Police Bazar, Meghalaya',
    destination: 'Dawki Umngot ICP, Meghalaya',
    hazard_notes: 'All sectors clear. Umngot border trade transit normal.',
    last_updated_by: 'Meghalaya Tourism & Transport Dept',
    updated_at: new Date().toISOString(),
    coordinates: [
      [91.8933, 25.5788],
      [91.8700, 25.5200],
      [91.8750, 25.4600],
      [91.9050, 25.3120],
      [91.9600, 25.2400],
      [92.0000, 25.1950],
      [92.0194, 25.1856]
    ]
  }
];

// Helper: Format Database items as GeoJSON FeatureCollection
function formatAsGeoJSON(roads) {
  return {
    type: 'FeatureCollection',
    metadata: {
      platform: 'MargSetu NER Accessibility Engine',
      total_corridors: roads.length,
      timestamp: new Date().toISOString()
    },
    features: roads.map(road => ({
      type: 'Feature',
      id: road.id,
      geometry: {
        type: 'LineString',
        coordinates: road.coordinates
      },
      properties: {
        id: road.id,
        road_name: road.road_name,
        highway_code: road.highway_code,
        state: road.state,
        status: road.status,
        length_km: road.length_km,
        origin: road.origin,
        destination: road.destination,
        hazard_notes: road.hazard_notes,
        last_updated_by: road.last_updated_by,
        updated_at: road.updated_at
      }
    }))
  };
}

// 1. GET /api/roads - Fetch all highways as GeoJSON
app.get('/api/roads', (req, res) => {
  const geojson = formatAsGeoJSON(highwaysDatabase);
  res.json(geojson);
});

// 2. GET /api/roads/:id - Fetch single highway details
app.get('/api/roads/:id', (req, res) => {
  const road = highwaysDatabase.find(r => r.id === req.params.id);
  if (!road) {
    return res.status(404).json({ error: 'Highway corridor not found' });
  }
  res.json(road);
});

// 3. PATCH /api/roads/:id/status - Government update endpoint (clear, warning, blocked)
app.patch('/api/roads/:id/status', (req, res) => {
  const { status, hazard_notes, officer_name } = req.body;
  const validStatuses = ['clear', 'warning', 'blocked'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }

  const roadIndex = highwaysDatabase.findIndex(r => r.id === req.params.id);
  if (roadIndex === -1) {
    return res.status(404).json({ error: 'Highway corridor not found' });
  }

  // Update in database
  highwaysDatabase[roadIndex] = {
    ...highwaysDatabase[roadIndex],
    status,
    hazard_notes: hazard_notes || highwaysDatabase[roadIndex].hazard_notes,
    last_updated_by: officer_name || 'NER State Disaster Authority Officer',
    updated_at: new Date().toISOString()
  };

  const updatedRoad = highwaysDatabase[roadIndex];
  console.log(`[GOV ACTION] Status of ${updatedRoad.highway_code} changed to '${status.toUpperCase()}'`);

  res.json({
    success: true,
    message: `Road ${updatedRoad.highway_code} status updated to ${status}`,
    road: updatedRoad,
    geojson: formatAsGeoJSON(highwaysDatabase)
  });
});

// 4. POST /api/roads/reset - Reset demo database
app.post('/api/roads/reset', (req, res) => {
  highwaysDatabase[0].status = 'clear';
  highwaysDatabase[1].status = 'warning';
  highwaysDatabase[2].status = 'blocked';
  res.json({ success: true, message: 'Database reset to baseline state' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'HEALTHY',
    service: 'MargSetu PostGIS Sync Service',
    uptime: process.uptime()
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`MargSetu Backend Service running on http://localhost:${PORT}`);
  });
}

export default app;

