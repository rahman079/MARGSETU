-- ============================================================================
-- MargSetu (मार्गसेतु) - PostGIS Database Schema (Phase 1)
-- Real-Time Accessibility & Disaster-Routing Engine for North Eastern Region
-- ============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Define Custom Status Enum for Road Accessibility
DO $$ BEGIN
    CREATE TYPE road_status_enum AS ENUM ('clear', 'warning', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Optimized road_status Table
CREATE TABLE IF NOT EXISTS road_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    road_name VARCHAR(150) NOT NULL,
    highway_code VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    status road_status_enum NOT NULL DEFAULT 'clear',
    length_km NUMERIC(6, 2),
    hazard_notes TEXT DEFAULT 'All lanes operational. BRO surveillance active.',
    geom GEOMETRY(LineString, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Spatial and Performance Indexes
-- GiST index for ultra-fast spatial bounding-box & routing operations
CREATE INDEX IF NOT EXISTS idx_road_status_geom 
    ON road_status USING GIST (geom);

-- B-Tree index for status filtering
CREATE INDEX IF NOT EXISTS idx_road_status_status 
    ON road_status (status);

-- B-Tree index for highway code lookup
CREATE INDEX IF NOT EXISTS idx_road_status_code 
    ON road_status (highway_code);

-- 5. Trigger for Automatic Timestamp Updates
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_road_status_timestamp ON road_status;
CREATE TRIGGER trg_road_status_timestamp
    BEFORE UPDATE ON road_status
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- 6. Initial Seed Data: 3 Critical North Eastern Highway Corridors
-- LineString geometries represented in standard EPSG:4326 (Lon/Lat)
-- ============================================================================

-- Highway 1: NH-6 (Guwahati - Shillong - Silchar Expressway)
INSERT INTO road_status (id, road_name, highway_code, state, status, length_km, hazard_notes, geom)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'NH-6 Guwahati to Shillong Corridor',
    'NH-6',
    'Meghalaya / Assam',
    'clear',
    98.50,
    'Four-lane expressway open. Clear weather at Nongpoh & Umiam.',
    ST_GeomFromText('LINESTRING(91.7362 26.1445, 91.7750 26.1120, 91.8100 26.0500, 91.8450 25.9600, 91.8600 25.9000, 91.8800 25.7800, 91.9050 25.6580, 91.8933 25.5788)', 4326)
)
ON CONFLICT (id) DO UPDATE SET
    road_name = EXCLUDED.road_name,
    status = EXCLUDED.status,
    geom = EXCLUDED.geom;

-- Highway 2: NH-13 (Trans-Arunachal Highway / Tezpur - Bomdila - Tawang)
INSERT INTO road_status (id, road_name, highway_code, state, status, length_km, hazard_notes, geom)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'NH-13 Trans-Arunachal Sela Corridor',
    'NH-13',
    'Arunachal Pradesh / Assam',
    'warning',
    315.20,
    'Sela Tunnel open. Active rockfall caution on old switchbacks near Dirang.',
    ST_GeomFromText('LINESTRING(92.7926 26.6528, 92.6500 26.9000, 92.4800 27.1500, 92.4231 27.2645, 92.2500 27.3500, 92.1200 27.4800, 92.0500 27.5200, 91.9500 27.5600, 91.8594 27.5861)', 4326)
)
ON CONFLICT (id) DO UPDATE SET
    road_name = EXCLUDED.road_name,
    status = EXCLUDED.status,
    geom = EXCLUDED.geom;

-- Highway 3: NH-29 (Dimapur - Kohima - Imphal Lifeline)
INSERT INTO road_status (id, road_name, highway_code, state, status, length_km, hazard_notes, geom)
VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'NH-29 Dimapur-Kohima Lifeline',
    'NH-29',
    'Nagaland',
    'blocked',
    74.00,
    'Massive landslide & road subsidence at Chumukedima Km 24. Rerouting via Niuland.',
    ST_GeomFromText('LINESTRING(93.7266 25.9090, 93.7800 25.8800, 93.8122 25.8234, 93.8800 25.8200, 93.9900 25.7500, 94.0600 25.7000, 94.1086 25.6751)', 4326)
)
ON CONFLICT (id) DO UPDATE SET
    road_name = EXCLUDED.road_name,
    status = EXCLUDED.status,
    geom = EXCLUDED.geom;

-- ============================================================================
-- 7. Handy Helper Queries for API Endpoints
-- ============================================================================

-- Query to fetch all roads formatted directly as GeoJSON FeatureCollection
-- SELECT jsonb_build_object(
--     'type', 'FeatureCollection',
--     'features', jsonb_agg(
--         jsonb_build_object(
--             'type', 'Feature',
--             'id', id,
--             'geometry', ST_AsGeoJSON(geom)::jsonb,
--             'properties', jsonb_build_object(
--                 'id', id,
--                 'road_name', road_name,
--                 'highway_code', highway_code,
--                 'state', state,
--                 'status', status,
--                 'length_km', length_km,
--                 'hazard_notes', hazard_notes,
--                 'updated_at', updated_at
--             )
--         )
--     )
-- ) AS geojson FROM road_status;
