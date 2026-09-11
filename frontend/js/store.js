/**
 * MargSetu - Unified Reactive Data Store & Simulation Engine
 * Manages NER highway corridors, live disaster incidents, verified blockages, and emergency dispatch.
 */

const STORAGE_KEY = 'margsetu_master_state_v2';

// 8 North Eastern States Metadata
export const NER_STATES = [
  { id: 'all', name: 'All NER States', code: 'NER' },
  { id: 'assam', name: 'Assam', code: 'AS', center: [26.2006, 92.9376], zoom: 8 },
  { id: 'meghalaya', name: 'Meghalaya', code: 'ML', center: [25.4670, 91.3662], zoom: 8 },
  { id: 'arunachal', name: 'Arunachal Pradesh', code: 'AR', center: [28.2180, 94.7278], zoom: 7 },
  { id: 'nagaland', name: 'Nagaland', code: 'NL', center: [26.1584, 94.5624], zoom: 8 },
  { id: 'manipur', name: 'Manipur', code: 'MN', center: [24.6637, 93.9063], zoom: 8 },
  { id: 'mizoram', name: 'Mizoram', code: 'MZ', center: [23.1645, 92.9376], zoom: 8 },
  { id: 'tripura', name: 'Tripura', code: 'TR', center: [23.9408, 91.9882], zoom: 9 },
  { id: 'sikkim', name: 'Sikkim', code: 'SK', center: [27.5330, 88.5122], zoom: 9 },
];

// Key Hub Locations across NER
export const NER_LOCATIONS = {
  guwahati: { id: 'guwahati', name: 'Guwahati (ISBT / Dispur)', state: 'Assam', coords: [26.1445, 91.7362] },
  shillong: { id: 'shillong', name: 'Shillong (Police Bazar)', state: 'Meghalaya', coords: [25.5788, 91.8933] },
  tezpur: { id: 'tezpur', name: 'Tezpur (Mission Chariali)', state: 'Assam', coords: [26.6528, 92.7926] },
  tawang: { id: 'tawang', name: 'Tawang (Monastery)', state: 'Arunachal Pradesh', coords: [27.5861, 91.8594] },
  bomdila: { id: 'bomdila', name: 'Bomdila', state: 'Arunachal Pradesh', coords: [27.2645, 92.4231] },
  kaziranga: { id: 'kaziranga', name: 'Kaziranga / Jorhat', state: 'Assam', coords: [26.7509, 94.2037] },
  dibrugarh: { id: 'dibrugarh', name: 'Dibrugarh (Bogibeel)', state: 'Assam', coords: [27.4728, 94.9120] },
  dimapur: { id: 'dimapur', name: 'Dimapur (Purana Bazar)', state: 'Nagaland', coords: [25.9090, 93.7266] },
  kohima: { id: 'kohima', name: 'Kohima (Main Town)', state: 'Nagaland', coords: [25.6751, 94.1086] },
  imphal: { id: 'imphal', name: 'Imphal (Kangla Fort)', state: 'Manipur', coords: [24.8170, 93.9368] },
  silchar: { id: 'silchar', name: 'Silchar (ISBT)', state: 'Assam', coords: [24.8333, 92.7789] },
  aizawl: { id: 'aizawl', name: 'Aizawl (Zarkawt)', state: 'Mizoram', coords: [23.7271, 92.7176] },
  agartala: { id: 'agartala', name: 'Agartala (City Center)', state: 'Tripura', coords: [23.8315, 91.2868] },
  gangtok: { id: 'gangtok', name: 'Gangtok (MG Marg)', state: 'Sikkim', coords: [27.3389, 88.6065] },
  nathula: { id: 'nathula', name: 'Nathu La Pass (Indo-China Border)', state: 'Sikkim', coords: [27.3865, 88.8311] },
  itanagar: { id: 'itanagar', name: 'Itanagar (Ganga Lake)', state: 'Arunachal Pradesh', coords: [27.0844, 93.6053] }
};

// Route Catalog with Safe (Green) and Dangerous/Blocked (Red) paths
export const NER_ROUTES = {
  'guwahati-shillong': {
    id: 'guwahati-shillong',
    origin: 'guwahati',
    destination: 'shillong',
    title: 'Guwahati to Shillong (NH-6 Corridor)',
    highway: 'NH-6 (GS Road)',
    safeRoute: {
      label: 'Safest Route (VIP Bypass Corridor)',
      status: 'SAFE',
      eta: '1 hr 45 min',
      distance: '94 km',
      safetyScore: 98,
      elevationMax: '1,520 m',
      description: 'Fully clear 4-lane expressway with sensor-based landslide barriers and active BRO surveillance.',
      color: '#10b981',
      // Coordinates representing safe path
      path: [
        [26.1445, 91.7362],
        [26.1120, 91.7750],
        [26.0500, 91.8100],
        [25.9600, 91.8450], // Nongpoh
        [25.9000, 91.8600],
        [25.7800, 91.8800], // Umroi bypass
        [25.6800, 91.9300], // Mawlyndep bypass
        [25.6100, 91.9150],
        [25.5788, 91.8933]
      ],
      steps: [
        { instruction: 'Start from Guwahati Khanapara junction heading South on NH-6', dist: '12 km' },
        { instruction: 'Pass Nongpoh bypass; road conditions dry & monitored', dist: '38 km' },
        { instruction: 'Take the Umroi Airport Western Bypass to avoid active Barapani slide', dist: '24 km' },
        { instruction: 'Enter Shillong via Mawlai green corridor', dist: '20 km' }
      ]
    },
    dangerRoute: {
      label: 'Dangerous / Blocked Route (Barapani Old Gorge)',
      status: 'BLOCKED',
      eta: 'Closed (+4 hr delay)',
      distance: '99 km',
      safetyScore: 18,
      hazardType: 'Massive Mud & Rock Landslide',
      hazardLocation: 'NH-6, Km 48.2 near Umiam Barapani Lake',
      hazardCoords: [25.6601, 91.8950],
      hazardImage: '/assets/images/landslide_nh6.jpg',
      color: '#ef4444',
      description: 'Severe debris flow across both lanes due to continuous monsoon downpour. Heavy vehicles stranded.',
      path: [
        [26.1445, 91.7362],
        [26.0500, 91.8100],
        [25.9000, 91.8600],
        [25.7500, 91.8700],
        [25.6601, 91.8950], // Landslide point
        [25.6200, 91.8850],
        [25.5788, 91.8933]
      ],
      warnings: [
        'Massive rockfall obstructing both carriageways',
        'High risk of secondary slope sliding',
        'State Traffic Advisory: Strictly Avoid Old NH-6 Barapani'
      ]
    }
  },

  'tezpur-tawang': {
    id: 'tezpur-tawang',
    origin: 'tezpur',
    destination: 'tawang',
    title: 'Tezpur to Tawang (NH-13 Trans-Arunachal)',
    highway: 'NH-13 / Balipara-Charduar-Tawang Road',
    safeRoute: {
      label: 'Safest Route (Via Sela Tunnel All-Weather Route)',
      status: 'SAFE',
      eta: '5 hr 20 min',
      distance: '315 km',
      safetyScore: 95,
      elevationMax: '3,000 m (Tunnel level)',
      description: 'Twin-tube all-weather Sela Tunnel bypasses the high-altitude avalanche zone completely.',
      color: '#10b981',
      path: [
        [26.6528, 92.7926],
        [26.9000, 92.6500],
        [27.1500, 92.4800], // Rupa
        [27.2645, 92.4231], // Bomdila
        [27.3500, 92.2500], // Dirang
        [27.4800, 92.1200], // Sela Tunnel Entry
        [27.5200, 92.0500], // Sela Tunnel Exit (Bypassing top)
        [27.5600, 91.9500], // Jang
        [27.5861, 91.8594]  // Tawang
      ],
      steps: [
        { instruction: 'Depart Tezpur Mission Chariali towards Bhalukpong Gate', dist: '55 km' },
        { instruction: 'Ascend Bomdila ghat section; road clear', dist: '95 km' },
        { instruction: 'Enter Sela Twin-Tube Tunnel (bypassing 13,700 ft frozen pass)', dist: '42 km' },
        { instruction: 'Descend through Jang waterfall bridge into Tawang', dist: '40 km' }
      ]
    },
    dangerRoute: {
      label: 'Dangerous / Blocked Route (Old Sela Top 13,700ft)',
      status: 'BLOCKED',
      eta: 'Pass Blocked (+7 hr)',
      distance: '332 km',
      safetyScore: 12,
      hazardType: 'Severe Rockfall & Snow Boulder Blockade',
      hazardLocation: 'NH-13 Sela Summit Pass, Elevation 4,170m',
      hazardCoords: [27.5050, 92.1020],
      hazardImage: '/assets/images/rockfall_sela.jpg',
      color: '#ef4444',
      description: 'Huge mountain boulders dislodged on hairpin curves. Sub-zero temperatures and unstable cliff face.',
      path: [
        [26.6528, 92.7926],
        [27.2645, 92.4231],
        [27.3500, 92.2500],
        [27.4600, 92.1500],
        [27.5050, 92.1020], // Rockfall summit
        [27.5400, 92.0500],
        [27.5861, 91.8594]
      ],
      warnings: [
        'Extreme rockfall hazard on Sela Pass Switchbacks',
        'Ice accumulation with blocked snow plough access',
        'Army / BRO advisory: Route restricted to emergency tracked vehicles only'
      ]
    }
  },

  'dimapur-kohima': {
    id: 'dimapur-kohima',
    origin: 'dimapur',
    destination: 'kohima',
    title: 'Dimapur to Kohima (NH-29 Lifeline)',
    highway: 'NH-29 Asian Highway 1',
    safeRoute: {
      label: 'Safest Route (Niuland-Kohima Fortified Ridge)',
      status: 'SAFE',
      eta: '1 hr 50 min',
      distance: '68 km',
      safetyScore: 92,
      elevationMax: '1,440 m',
      description: 'Elevated bypass route through stable bedrock with geotechnical retaining walls.',
      color: '#10b981',
      path: [
        [25.9090, 93.7266],
        [25.8800, 93.7800],
        [25.8200, 93.8800],
        [25.7500, 93.9900],
        [25.7000, 94.0600],
        [25.6751, 94.1086]
      ],
      steps: [
        { instruction: 'Take Niuland eastern bypass from Dimapur city', dist: '18 km' },
        { instruction: 'Continue on newly paved reinforced ridge section', dist: '32 km' },
        { instruction: 'Connect to Kohima North Gate smoothly', dist: '18 km' }
      ]
    },
    dangerRoute: {
      label: 'Dangerous / Blocked Route (Chumukedima Old NH-29)',
      status: 'BLOCKED',
      eta: 'Impasse / Risk of Collapse',
      distance: '72 km',
      safetyScore: 22,
      hazardType: 'Road Subsidence & Severe Sinking Fracture',
      hazardLocation: 'NH-29 Km 24 near Chumukedima Hill Section',
      hazardCoords: [25.8234, 93.8122],
      hazardImage: '/assets/images/road_cavein.jpg',
      color: '#ef4444',
      description: 'Asphalt fissure 1.8 meters deep caused by underground aquifer wash away. Dangerous for commercial transport.',
      path: [
        [25.9090, 93.7266],
        [25.8600, 93.7500],
        [25.8234, 93.8122], // Road sinkhole
        [25.7600, 93.9200],
        [25.6751, 94.1086]
      ],
      warnings: [
        'Active subsidence across 120m stretch',
        'Risk of total road shearing into Chathe river gorge'
      ]
    }
  },

  'guwahati-kaziranga': {
    id: 'guwahati-kaziranga',
    origin: 'guwahati',
    destination: 'kaziranga',
    title: 'Guwahati to Kaziranga / Jorhat (NH-715)',
    highway: 'NH-715 (Old NH-37)',
    safeRoute: {
      label: 'Safest Route (Southern Highland Corridor)',
      status: 'SAFE',
      eta: '3 hr 30 min',
      distance: '210 km',
      safetyScore: 97,
      elevationMax: '180 m',
      description: 'Southern elevated expressway with designated wildlife animal corridors and flood embankments.',
      color: '#10b981',
      path: [
        [26.1445, 91.7362],
        [26.1800, 92.0500], // Jagiroad
        [26.2500, 92.5000], // Nagaon Bypass
        [26.4500, 93.1000], // Jakhalabandha
        [26.6000, 93.6000], // Kaziranga Kohora
        [26.7509, 94.2037]
      ],
      steps: [
        { instruction: 'Take 4-lane NH-27 to Nagaon bypass', dist: '110 km' },
        { instruction: 'Follow elevated southern corridor around animal crossing zones', dist: '65 km' },
        { instruction: 'Reach Kaziranga / Jorhat with zero waterlogging delays', dist: '35 km' }
      ]
    },
    dangerRoute: {
      label: 'Dangerous / Blocked Route (Kaliabor Low Bridge Route)',
      status: 'BLOCKED',
      eta: 'Flooded (+3.5 hr detour)',
      distance: '228 km',
      safetyScore: 25,
      hazardType: 'Brahmaputra Flood Waterlogging & Submerged Causeway',
      hazardLocation: 'NH-715 Kaliabor River Crossing, Assam',
      hazardCoords: [26.5412, 92.9801],
      hazardImage: '/assets/images/flood_nh27.jpg',
      color: '#ef4444',
      description: 'Turbulent flood waters flowing 2 feet above bridge deck. Police barricades deployed.',
      path: [
        [26.1445, 91.7362],
        [26.2500, 92.5000],
        [26.5412, 92.9801], // Flood point
        [26.6500, 93.5000],
        [26.7509, 94.2037]
      ],
      warnings: [
        'Bridge submerged under 0.6m high-velocity flood runoff',
        'High risk of vehicle drift into main river basin'
      ]
    }
  },

  'gangtok-nathula': {
    id: 'gangtok-nathula',
    origin: 'gangtok',
    destination: 'nathula',
    title: 'Gangtok to Nathu La Pass (NH-310 Border Route)',
    highway: 'NH-310 Jawaharlal Nehru Road',
    safeRoute: {
      label: 'Safest Route (Kyongnosla Cleared Corridor)',
      status: 'SAFE',
      eta: '1 hr 40 min',
      distance: '54 km',
      safetyScore: 94,
      elevationMax: '4,310 m',
      description: 'BRO Project Swastik snow-ploughed and stabilized mountain highway with thermal anti-skid markers.',
      color: '#10b981',
      path: [
        [27.3389, 88.6065],
        [27.3550, 88.6700],
        [27.3700, 88.7400], // Kyongnosla
        [27.3780, 88.7850], // Changu / Tsomgo bypass
        [27.3865, 88.8311]  // Nathu La
      ],
      steps: [
        { instruction: 'Depart Gangtok checkpost with winter tire chains', dist: '12 km' },
        { instruction: 'Pass Kyongnosla Alpine Sanctuary; snow clearance active', dist: '24 km' },
        { instruction: 'Arrive at Nathu La Indo-China border safe zone', dist: '18 km' }
      ]
    },
    dangerRoute: {
      label: 'Dangerous / Blocked Route (Old Tsomgo Lake Ridge)',
      status: 'BLOCKED',
      eta: 'Impasse / Active Slide',
      distance: '58 km',
      safetyScore: 19,
      hazardType: 'Alpine Rockslide & Unstable Moraine Collapse',
      hazardLocation: 'NH-310 Km 31 near Tsomgo Lake, Sikkim',
      hazardCoords: [27.3740, 88.7610],
      hazardImage: '/assets/images/rockfall_sela.jpg',
      color: '#ef4444',
      description: 'Loose boulders and gravel blocking the narrow cliff ledge road.',
      path: [
        [27.3389, 88.6065],
        [27.3550, 88.6700],
        [27.3740, 88.7610], // Slide point
        [27.3865, 88.8311]
      ],
      warnings: [
        'Active falling rocks triggered by freeze-thaw cycle',
        'Road narrowed to 2 meters with sheer 1,000ft drop'
      ]
    }
  }
};

// Default Initial Incidents
const INITIAL_INCIDENTS = [
  {
    id: 'INC-NER-8021',
    title: 'Severe Mud & Rock Landslide on Barapani Highway',
    type: 'landslide',
    typeName: 'Landslide / Rockfall',
    severity: 'critical',
    status: 'PENDING_VERIFICATION', // PENDING_VERIFICATION | VERIFIED_BLOCKED | RESCUE_DISPATCHED | RESOLVED_CLEARED | REJECTED_SPAM
    highway: 'NH-6',
    locationName: 'Km 48.2 near Umiam Lake, Ri-Bhoi District, Meghalaya',
    state: 'meghalaya',
    stateName: 'Meghalaya',
    coords: [25.6601, 91.8950],
    altitude: '1,020 m',
    timestamp: '12 mins ago',
    reportedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    reportedBy: 'T. Sangma (Commercial Truck Driver #AS-01-EB-4921)',
    reporterCredibility: '94% (Verified Citizen ID)',
    image: '/assets/images/landslide_nh6.jpg',
    description: 'Massive landslide brought down about 400 tons of wet soil and boulders across both lanes of NH-6. Traffic at complete standstill. No casualties reported yet.',
    affectedRouteId: 'guwahati-shillong',
    dispatchInfo: null
  },
  {
    id: 'INC-NER-8022',
    title: 'High Altitude Rockfall at Sela Summit Pass',
    type: 'rockfall',
    typeName: 'Severe Rockfall & Boulder Fall',
    severity: 'critical',
    status: 'VERIFIED_BLOCKED',
    highway: 'NH-13',
    locationName: 'Sela Pass Ridge, West Kameng, Arunachal Pradesh',
    state: 'arunachal',
    stateName: 'Arunachal Pradesh',
    coords: [27.5050, 92.1020],
    altitude: '4,170 m',
    timestamp: '45 mins ago',
    reportedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    reportedBy: 'Dorjee Norbu (Local Taxi Operator)',
    reporterCredibility: '98% (BRO Volunteer)',
    image: '/assets/images/rockfall_sela.jpg',
    description: 'Huge mountain boulders collapsed on the hairpin bend near Sela Lake. All civilian traffic redirected to Sela Tunnel bypass.',
    affectedRouteId: 'tezpur-tawang',
    dispatchInfo: {
      unitType: 'BRO Taskforce 44 (Vartak)',
      teamLeader: 'Maj. R. K. Sharma',
      dispatchedAt: '30 mins ago',
      eta: '25 min remaining',
      equipment: '2x Heavy Bulldozers, 1x Rock Breaker Unit'
    }
  },
  {
    id: 'INC-NER-8023',
    title: 'Flash Flood Overflow Submerging Causeway Bridge',
    type: 'flood',
    typeName: 'Flash Flood / Waterlogging',
    severity: 'high',
    status: 'PENDING_VERIFICATION',
    highway: 'NH-715',
    locationName: 'Kaliabor River Causeway, Nagaon District, Assam',
    state: 'assam',
    stateName: 'Assam',
    coords: [26.5412, 92.9801],
    altitude: '74 m',
    timestamp: '1 hr ago',
    reportedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    reportedBy: 'B. Baruah (Daily Commuter)',
    reporterCredibility: '88% (Phone Verified)',
    image: '/assets/images/flood_nh27.jpg',
    description: 'Brahmaputra tributary overflowed the low bridge. Water level 2.5 ft above road with strong current. Small cars cannot pass.',
    affectedRouteId: 'guwahati-kaziranga',
    dispatchInfo: null
  },
  {
    id: 'INC-NER-8024',
    title: 'Road Subsidence & Deep Asphalt Fracture',
    type: 'cavein',
    typeName: 'Road Sinking / Cave-in',
    severity: 'high',
    status: 'RESCUE_DISPATCHED',
    highway: 'NH-29',
    locationName: 'Km 24 Chumukedima Hill Section, Nagaland',
    state: 'nagaland',
    stateName: 'Nagaland',
    coords: [25.8234, 93.8122],
    altitude: '340 m',
    timestamp: '2 hrs ago',
    reportedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    reportedBy: 'A. Jamir (Inter-state Bus Driver)',
    reporterCredibility: '91% (State Transport Corp)',
    image: '/assets/images/road_cavein.jpg',
    description: 'Continuous rains caused road embankment to sink by 1.8 meters across 80 meters length. One lane completely collapsed down the slope.',
    affectedRouteId: 'dimapur-kohima',
    dispatchInfo: {
      unitType: 'Nagaland SDRF & PWD Quick Response',
      teamLeader: 'Inspector K. Sema',
      dispatchedAt: '1 hr ago',
      eta: 'On Site / Active Diversion Installed',
      equipment: 'Excavators, Geosynthetic mesh, Warning Barricades'
    }
  }
];

class MargSetuStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.incidents && parsed.incidents.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored state:', e);
    }

    const defaultState = {
      incidents: INITIAL_INCIDENTS,
      broadcasts: [
        {
          id: 'BC-101',
          level: 'CRITICAL',
          title: 'Monsoon Red Alert: Ri-Bhoi & West Kameng',
          message: 'BRO & Disaster Authorities advise non-essential travel freeze on Old NH-6 & Old Sela Pass. Use MargSetu verified green corridors only.',
          timestamp: 'Just now'
        }
      ],
      systemStats: {
        activeBlockages: 3,
        pendingReports: 2,
        unitsDispatched: 2,
        safeCorridorsOpen: 14
      }
    };
    this.saveState(defaultState);
    return defaultState;
  }

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error persisting state:', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState(this.state);
    this.listeners.forEach(fn => fn(this.state));
  }

  getIncidents(filters = {}) {
    let result = [...this.state.incidents];
    if (filters.state && filters.state !== 'all') {
      result = result.filter(inc => inc.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter(inc => inc.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(inc => 
        inc.title.toLowerCase().includes(q) ||
        inc.highway.toLowerCase().includes(q) ||
        inc.locationName.toLowerCase().includes(q) ||
        inc.reportedBy.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getIncidentById(id) {
    return this.state.incidents.find(inc => inc.id === id);
  }

  addIncident(reportData) {
    const newId = `INC-NER-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident = {
      id: newId,
      title: reportData.title || `Citizen Disaster Alert: ${reportData.typeName || 'Road Hazard'}`,
      type: reportData.type || 'landslide',
      typeName: reportData.typeName || 'Road Hazard',
      severity: reportData.severity || 'high',
      status: 'PENDING_VERIFICATION',
      highway: reportData.highway || 'State Highway / Link Road',
      locationName: reportData.locationName || `${reportData.coords[0].toFixed(4)}°N, ${reportData.coords[1].toFixed(4)}°E`,
      state: reportData.state || 'meghalaya',
      stateName: reportData.stateName || 'North Eastern Region',
      coords: reportData.coords || [25.6000, 91.8000],
      altitude: reportData.altitude || '980 m',
      timestamp: 'Just now',
      reportedAt: new Date().toISOString(),
      reportedBy: reportData.reportedBy || 'Citizen / Highway User',
      reporterCredibility: '85% (GPS Timestamped)',
      image: reportData.image || '/assets/images/landslide_nh6.jpg',
      description: reportData.description || 'Sudden natural hazard reported by driver. Visual verification pending.',
      affectedRouteId: reportData.affectedRouteId || null,
      dispatchInfo: null
    };

    this.state.incidents.unshift(newIncident);
    this.updateStats();
    this.notify();
    return newIncident;
  }

  verifyAndBlockRoute(incidentId, officialNotes = '') {
    const inc = this.getIncidentById(incidentId);
    if (!inc) return false;

    inc.status = 'VERIFIED_BLOCKED';
    inc.verifiedBy = 'NER Emergency Control Room (Officer ID #GOV-NER-409)';
    inc.verifiedAt = new Date().toISOString();
    if (officialNotes) inc.officialNotes = officialNotes;

    // Add broadcast announcement
    this.state.broadcasts.unshift({
      id: `BC-${Date.now()}`,
      level: 'CRITICAL',
      title: `Official Road Closure: ${inc.highway}`,
      message: `Verified hazard at ${inc.locationName}. Public traffic rerouted to designated green corridor.`,
      timestamp: 'Just now'
    });

    this.updateStats();
    this.notify();
    return true;
  }

  dispatchHelp(incidentId, dispatchDetails = {}) {
    const inc = this.getIncidentById(incidentId);
    if (!inc) return false;

    inc.status = 'RESCUE_DISPATCHED';
    inc.dispatchInfo = {
      unitType: dispatchDetails.unitType || 'NDRF 1st Battalion / BRO Quick Clearance',
      teamLeader: dispatchDetails.teamLeader || 'Commandant S. K. Roy',
      dispatchedAt: 'Just now',
      eta: dispatchDetails.eta || '15-20 min',
      equipment: dispatchDetails.equipment || 'Bulldozer, JCB, Rescue Van, Medical First Aid Unit'
    };

    this.updateStats();
    this.notify();
    return true;
  }

  rejectReport(incidentId, reason = 'False / Duplicate Citizen Report') {
    const inc = this.getIncidentById(incidentId);
    if (!inc) return false;

    inc.status = 'REJECTED_SPAM';
    inc.rejectReason = reason;
    inc.rejectedAt = new Date().toISOString();

    this.updateStats();
    this.notify();
    return true;
  }

  resolveIncident(incidentId) {
    const inc = this.getIncidentById(incidentId);
    if (!inc) return false;

    inc.status = 'RESOLVED_CLEARED';
    inc.resolvedAt = new Date().toISOString();

    this.updateStats();
    this.notify();
    return true;
  }

  updateStats() {
    const active = this.state.incidents.filter(i => i.status === 'VERIFIED_BLOCKED' || i.status === 'RESCUE_DISPATCHED').length;
    const pending = this.state.incidents.filter(i => i.status === 'PENDING_VERIFICATION').length;
    const dispatched = this.state.incidents.filter(i => i.status === 'RESCUE_DISPATCHED').length;
    
    this.state.systemStats = {
      activeBlockages: active,
      pendingReports: pending,
      unitsDispatched: dispatched,
      safeCorridorsOpen: 14 - active
    };
  }

  resetDemo() {
    this.state = {
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      broadcasts: [
        {
          id: 'BC-101',
          level: 'CRITICAL',
          title: 'Monsoon Red Alert: Ri-Bhoi & West Kameng',
          message: 'BRO & Disaster Authorities advise non-essential travel freeze on Old NH-6 & Old Sela Pass. Use MargSetu verified green corridors only.',
          timestamp: 'Just now'
        }
      ],
      systemStats: {
        activeBlockages: 3,
        pendingReports: 2,
        unitsDispatched: 2,
        safeCorridorsOpen: 14
      }
    };
    this.saveState(this.state);
    this.notify();
  }
}

export const store = new MargSetuStore();
