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
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    road_name: 'NH-6 Guwahati to Shillong Corridor',
    highway_code: 'NH-6',
    state: 'Meghalaya / Assam',
    status: 'clear', // 'clear' | 'warning' | 'blocked'
    length_km: 98.5,
    origin: 'Guwahati ISBT, Assam',
    destination: 'Shillong Police Bazar, Meghalaya',
    hazard_notes: 'All 4 lanes operational. Sensor-based slope monitoring clear.',
    last_updated_by: 'NER Emergency Control Room (Govt ID #NER-409)',
    updated_at: new Date().toISOString(),
    // GeoJSON LineString [Lon, Lat]
    coordinates: [
      [91.7362, 26.1445], // Guwahati
      [91.7750, 26.1120], // Jorabat
      [91.8100, 26.0500], // Burnihat
      [91.8450, 25.9600], // Nongpoh
      [91.8600, 25.9000], // Umsning
      [91.8800, 25.7800], // Umiam
      [91.9050, 25.6580], // Barapani Lake
      [91.8933, 25.5788]  // Shillong
    ]
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    road_name: 'NH-13 Trans-Arunachal Sela Corridor',
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
      [92.7926, 26.6528], // Tezpur
      [92.6500, 26.9000], // Bhalukpong
      [92.4800, 27.1500], // Rupa
      [92.4231, 27.2645], // Bomdila
      [92.2500, 27.3500], // Dirang
      [92.1200, 27.4800], // Sela Tunnel Entrance
      [92.0500, 27.5200], // Sela Tunnel Exit
      [91.9500, 27.5600], // Jang
      [91.8594, 27.5861]  // Tawang
    ]
  },
  {
    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    road_name: 'NH-29 Dimapur-Kohima Lifeline',
    highway_code: 'NH-29',
    state: 'Nagaland',
    status: 'blocked',
    length_km: 74.0,
    origin: 'Dimapur Purana Bazar, Nagaland',
    destination: 'Kohima Town Center, Nagaland',
    hazard_notes: 'Severe landslide and road subsidence at Chumukedima Km 24. Rerouting via Niuland.',
    last_updated_by: 'Nagaland SDRF & Traffic Police',
    updated_at: new Date().toISOString(),
    coordinates: [
      [93.7266, 25.9090], // Dimapur
      [93.7800, 25.8800], // Chumukedima
      [93.8122, 25.8234], // Slide zone
      [93.8800, 25.8200], // Medziphema
      [93.9900, 25.7500], // Zubza
      [94.0600, 25.7000], // Kohima Entry
      [94.1086, 25.6751]  // Kohima
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

app.listen(PORT, () => {
  console.log(`MargSetu Backend Service running on http://localhost:${PORT}`);
});
