/**
 * MargSetu (मार्गसेतु) - NER Logistics Corridors & Automated Safety Routing Catalog
 * High-fidelity GIS coordinates for all 12 major North-Eastern logistics arteries, 
 * blocked hazard zones, and certified emergency safe alternate routes.
 */

export const NER_CORRIDORS = [
  // 1. Siliguri–Guwahati
  {
    id: 'corridor-siliguri-guwahati',
    name: 'Siliguri–Guwahati',
    fullName: 'Siliguri (WB) to Guwahati (Assam) via NH27',
    shortName: 'Siliguri ➔ Guwahati',
    highwayCode: 'NH-27',
    linkedRoadId: 'nh27-siliguri-guwahati',
    origin: {
      name: 'Siliguri Junction, West Bengal',
      city: 'Siliguri',
      state: 'West Bengal',
      coordinates: [26.7271, 88.3953]
    },
    destination: {
      name: 'Guwahati ISBT, Assam',
      city: 'Guwahati',
      state: 'Assam',
      coordinates: [26.1445, 91.7362]
    },
    primaryRoute: {
      title: 'NH-27 East-West Expressway Corridor (Primary)',
      distanceKm: 472.0,
      normalDurationMin: 540, // 9h 00m
      speedLimitKmph: 75,
      surfaceCondition: '4-Lane National Highway Expressway',
      elevationMeters: '122m ➔ 55m',
      coordinates: [
        [26.7271, 88.3953], // Siliguri
        [26.8850, 88.4750], // Sevoke
        [26.6800, 89.1500], // Jalpaiguri
        [26.4900, 89.5200], // Alipurduar
        [26.4750, 89.9800], // Kokrajhar / Srirampur Border
        [26.4800, 90.5500], // Bongaigaon (Hazard Point)
        [26.4500, 91.0100], // Barpeta Road
        [26.4400, 91.4400], // Nalbari
        [26.2400, 91.6800], // Rangia / Jalukbari
        [26.1445, 91.7362]  // Guwahati ISBT
      ],
      blockedSegment: [
        [26.4800, 90.5500], // Bongaigaon
        [26.4500, 91.0100]  // Barpeta Road
      ]
    },
    safeAlternateRoute: {
      title: 'Cooch Behar - Dhubri - Goalpara South Bank Bypass',
      via: 'Via Mainaguri, Cooch Behar, Dhubri & Goalpara South Trunk Road',
      distanceKm: 498.0,
      detourDurationMin: 600, // 10h 00m
      delayMin: 60,
      safetyScore: '96% (Flood-Protected South Ridge)',
      roadClassification: 'NH-17 South Bank National Corridor',
      advisory: 'Certified safe bypass by Assam PWD & SDRF. Bypasses active bridge repairs near Bongaigaon.',
      coordinates: [
        [26.7271, 88.3953], // Siliguri
        [26.5400, 88.7200], // Mainaguri
        [26.3250, 89.4500], // Cooch Behar
        [26.0207, 89.9744], // Dhubri South
        [26.1700, 90.6200], // Goalpara Bypass
        [25.9860, 90.7320], // Dudhnoi
        [26.0000, 91.2500], // Boko
        [26.1445, 91.7362]  // Guwahati ISBT
      ]
    },
    hazardInfo: {
      locationName: 'Bongaigaon Manas River Sector Km 182',
      coordinates: [26.4800, 90.5500],
      hazardType: 'Heavy Flood Inundation & Culvert Repair',
      severity: 'Critical (Zero Heavy Transit)',
      reportingAuthority: 'NHAI Regional Office Guwahati & SDRF Assam'
    }
  },

  // 2. Guwahati–Shillong–Silchar
  {
    id: 'corridor-guwahati-shillong-silchar',
    name: 'Guwahati–Shillong–Silchar',
    fullName: 'Guwahati (Assam) to Shillong (Meghalaya) to Silchar (Assam) via NH6',
    shortName: 'Guwahati ➔ Shillong ➔ Silchar',
    highwayCode: 'NH-6',
    linkedRoadId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    origin: {
      name: 'Guwahati ISBT, Assam',
      city: 'Guwahati',
      state: 'Assam',
      coordinates: [26.1445, 91.7362]
    },
    destination: {
      name: 'Silchar Rongpur Trunk, Assam',
      city: 'Silchar',
      state: 'Assam',
      coordinates: [24.8333, 92.7789]
    },
    primaryRoute: {
      title: 'NH-6 Trans-Meghalaya Arterial Highway (Primary)',
      distanceKm: 312.0,
      normalDurationMin: 480, // 8h 00m
      speedLimitKmph: 55,
      surfaceCondition: '4-Lane / 2-Lane Hill Corridor',
      elevationMeters: '55m ➔ 1496m ➔ 26m',
      coordinates: [
        [26.1445, 91.7362], // Guwahati ISBT
        [26.0500, 91.8100], // Jorabat
        [25.9000, 91.8600], // Nongpoh
        [25.5788, 91.8933], // Shillong
        [25.4500, 92.2000], // Jowai
        [25.2600, 92.3500], // Khliehriat
        [25.1415, 92.3685], // Sonapur Tunnel (Hazard)
        [24.9800, 92.5900], // Kalain
        [24.8333, 92.7789]  // Silchar
      ],
      blockedSegment: [
        [25.2600, 92.3500], // Khliehriat
        [25.1415, 92.3685], // Sonapur Tunnel
        [24.9800, 92.5900]  // Kalain
      ]
    },
    safeAlternateRoute: {
      title: 'Dima Hasao - Haflong Mountain Highway Bypass',
      via: 'Via Nagaon, Dabaka, Lumding & Haflong Four-Lane Link',
      distanceKm: 345.0,
      detourDurationMin: 540, // 9h 00m
      delayMin: 60,
      safetyScore: '97% (Reinforced Ridge Highway)',
      roadClassification: 'NH-27 / NH-54 (NH-627) East-West Corridor Link',
      advisory: 'Certified all-weather corridor bypassing Sonapur mudflow zone via Haflong.',
      coordinates: [
        [26.1445, 91.7362], // Guwahati
        [26.1800, 92.8000], // Nagaon
        [25.8200, 93.0000], // Dabaka
        [25.4000, 93.0200], // Lumding
        [25.1700, 93.0100], // Haflong Dima Hasao
        [24.9500, 92.8900], // Balacherra
        [24.8333, 92.7789]  // Silchar
      ]
    },
    hazardInfo: {
      locationName: 'Sonapur Tunnel Km 141 (East Jaintia Hills)',
      coordinates: [25.1415, 92.3685],
      hazardType: 'Massive Mudslide & Mountain Soil Liquefaction',
      severity: 'Critical (Total Tunnel Obstruction)',
      reportingAuthority: 'Meghalaya Police & East Jaintia Hills Administration'
    }
  },

  // 3. Guwahati–Upper Assam
  {
    id: 'corridor-guwahati-upper-assam',
    name: 'Guwahati–Upper Assam',
    fullName: 'Guwahati to Dibrugarh (Upper Assam) via NH715/NH27',
    shortName: 'Guwahati ➔ Dibrugarh',
    highwayCode: 'NH-715',
    linkedRoadId: 'nh715-guwahati-dibrugarh',
    origin: {
      name: 'Guwahati ISBT, Assam',
      city: 'Guwahati',
      state: 'Assam',
      coordinates: [26.1445, 91.7362]
    },
    destination: {
      name: 'Dibrugarh Chowkidingee, Assam',
      city: 'Dibrugarh',
      state: 'Assam',
      coordinates: [27.4728, 94.9120]
    },
    primaryRoute: {
      title: 'NH-715 Kaziranga Trunk Expressway (Primary)',
      distanceKm: 442.0,
      normalDurationMin: 510, // 8h 30m
      speedLimitKmph: 70,
      surfaceCondition: '4-Lane Asphalt Highway',
      elevationMeters: '55m ➔ 108m',
      coordinates: [
        [26.1445, 91.7362], // Guwahati
        [26.1800, 92.3500], // Jagiroad
        [26.3500, 92.6800], // Nagaon
        [26.5775, 93.1711], // Kaziranga (Hazard)
        [26.6500, 93.7500], // Bokakhat
        [26.7500, 94.2200], // Jorhat
        [26.9800, 94.6300], // Sivasagar
        [27.2800, 94.8500], // Moranhat
        [27.4728, 94.9120]  // Dibrugarh
      ],
      blockedSegment: [
        [26.3500, 92.6800], // Nagaon
        [26.5775, 93.1711], // Kaziranga
        [26.6500, 93.7500]  // Bokakhat
      ]
    },
    safeAlternateRoute: {
      title: 'North Bank Expressway & Bogibeel Bridge Bypass',
      via: 'Via Tezpur Kolia Bhomora, Biswanath, Lakhimpur & Bogibeel Mega Bridge',
      distanceKm: 475.0,
      detourDurationMin: 555, // 9h 15m
      delayMin: 45,
      safetyScore: '99% (All-Weather North Bank Corridor)',
      roadClassification: 'NH-15 North Bank National Highway',
      advisory: 'Designated alternate freight artery avoiding Kaziranga flood regulation zones.',
      coordinates: [
        [26.1445, 91.7362], // Guwahati
        [26.6500, 92.7900], // Tezpur Bridge
        [26.8500, 93.6000], // Biswanath Chariali
        [27.2000, 94.1000], // North Lakhimpur
        [27.4800, 94.8500], // Bogibeel Bridge
        [27.4728, 94.9120]  // Dibrugarh
      ]
    },
    hazardInfo: {
      locationName: 'Kaziranga National Park Animal Corridor Km 168',
      coordinates: [26.5775, 93.1711],
      hazardType: 'Brahmaputra Overflow & Animal Corridor Speed Ban',
      severity: 'High (Transit Restricted to Emergency Convoys)',
      reportingAuthority: 'Golaghat District Administration & Forest Dept'
    }
  },

  // 4. Trans-Arunachal Road
  {
    id: 'corridor-trans-arunachal-road',
    name: 'Trans-Arunachal Road',
    fullName: 'Tezpur (Assam) to Tawang (Arunachal Pradesh) via NH13',
    shortName: 'Tezpur ➔ Tawang',
    highwayCode: 'NH-13',
    linkedRoadId: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    origin: {
      name: 'Tezpur Mission Chariali, Assam',
      city: 'Tezpur',
      state: 'Assam',
      coordinates: [26.6528, 92.7926]
    },
    destination: {
      name: 'Tawang Monastery, Arunachal Pradesh',
      city: 'Tawang',
      state: 'Arunachal Pradesh',
      coordinates: [27.5861, 91.8594]
    },
    primaryRoute: {
      title: 'NH-13 Trans-Arunachal Strategic Highway (Primary)',
      distanceKm: 315.2,
      normalDurationMin: 510, // 8h 30m
      speedLimitKmph: 45,
      surfaceCondition: 'Mountain Highway & High-Altitude Pass',
      elevationMeters: '78m ➔ 3048m',
      coordinates: [
        [26.6528, 92.7926], // Tezpur
        [26.9000, 92.6500], // Bhalukpong Gate
        [27.1500, 92.4800], // Tenga Valley
        [27.2645, 92.4231], // Bomdila Pass
        [27.3500, 92.2500], // Dirang (Hazard Zone)
        [27.4800, 92.1200], // Sela Pass Upper
        [27.5200, 92.0500], // Jaswant Garh
        [27.5600, 91.9500], // Jang Falls
        [27.5861, 91.8594]  // Tawang
      ],
      blockedSegment: [
        [27.2645, 92.4231],
        [27.3500, 92.2500],
        [27.4800, 92.1200]
      ]
    },
    safeAlternateRoute: {
      title: 'Kalaktang - Rupa - Sela Twin-Tube Tunnel Bypass',
      via: 'Via Orang, Kalaktang, Rupa Valley & Sela Tunnel Portals',
      distanceKm: 348.0,
      detourDurationMin: 585, // 9h 45m
      delayMin: 75,
      safetyScore: '95% (All-Weather Fortified Tunnel Route)',
      roadClassification: 'BRO Strategic Defense Corridor',
      advisory: 'Managed by Border Roads Organisation (Project Vartak). Bypasses active shooting stones at Dirang.',
      coordinates: [
        [26.6528, 92.7926], // Tezpur
        [26.7850, 92.4100], // Orang Valley
        [26.9800, 92.2100], // Bhairabkunda Gate
        [27.1200, 92.1100], // Kalaktang Border
        [27.2100, 92.2000], // Rupa Valley
        [27.4100, 92.0900], // Sela Tunnel Portal South
        [27.5100, 92.0300], // Sela Tunnel Portal North (All Weather)
        [27.5600, 91.9500], // Jang Link
        [27.5861, 91.8594]  // Tawang
      ]
    },
    hazardInfo: {
      locationName: 'Dirang Mountain Slopes Km 142',
      coordinates: [27.3500, 92.2500],
      hazardType: 'Active Rockfall & Boulder Collapse',
      severity: 'Critical (Closed by District Administration)',
      reportingAuthority: 'Border Roads Organisation (Commandant Vartak)'
    }
  },

  // 5. Dimapur–Kohima–Imphal
  {
    id: 'corridor-dimapur-kohima-imphal',
    name: 'Dimapur–Kohima–Imphal',
    fullName: 'Dimapur (Nagaland) to Kohima to Imphal (Manipur) via NH2',
    shortName: 'Dimapur ➔ Kohima ➔ Imphal',
    highwayCode: 'NH-2',
    linkedRoadId: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    origin: {
      name: 'Dimapur Purana Bazar, Nagaland',
      city: 'Dimapur',
      state: 'Nagaland',
      coordinates: [25.9090, 93.7266]
    },
    destination: {
      name: 'Imphal Kangla Fort, Manipur',
      city: 'Imphal',
      state: 'Manipur',
      coordinates: [24.8170, 93.9368]
    },
    primaryRoute: {
      title: 'NH-2 Trans-Manipur Strategic Corridor (Primary)',
      distanceKm: 212.0,
      normalDurationMin: 345, // 5h 45m
      speedLimitKmph: 50,
      surfaceCondition: 'Mountain Highway 2-Lane',
      elevationMeters: '145m ➔ 1444m ➔ 786m',
      coordinates: [
        [25.9090, 93.7266], // Dimapur Purana Bazar
        [25.8800, 93.7800], // Chumukedima
        [25.8234, 93.8122], // Chumukedima Ghat (Hazard Zone)
        [25.8200, 93.8800], // Medziphema
        [25.6751, 94.1086], // Kohima Capital
        [25.5600, 94.1600], // Viswema
        [25.5050, 94.1280], // Mao Gate Border
        [25.3900, 94.0750], // Maram
        [25.2650, 94.0200], // Senapati
        [25.1480, 93.9720], // Kangpokpi
        [24.9650, 93.8920], // Sekmai
        [24.8170, 93.9368]  // Imphal Kangla
      ],
      blockedSegment: [
        [25.8800, 93.7800],
        [25.8234, 93.8122],
        [25.8200, 93.8800],
        [25.6751, 94.1086]
      ]
    },
    safeAlternateRoute: {
      title: 'Niuland - Peren - Khonoma - Maram Relief Bypass',
      via: 'Via Niuland District Road, Jalukie Valley & Peren Mountain Bypass',
      distanceKm: 248.0,
      detourDurationMin: 405, // 6h 45m
      delayMin: 60,
      safetyScore: '94% (Stable Ridge Route)',
      roadClassification: 'Nagaland & Manipur Strategic Evacuation Route',
      advisory: 'Designated alternate heavy transit corridor monitored by Assam Rifles & SDRF.',
      coordinates: [
        [25.9090, 93.7266], // Dimapur
        [25.9450, 93.8200], // Niuland Junction
        [25.6020, 93.6820], // Jalukie Valley
        [25.5100, 93.7400], // Peren Ridge
        [25.3900, 94.0750], // Maram Connector
        [25.2650, 94.0200], // Senapati
        [25.1480, 93.9720], // Kangpokpi
        [24.8170, 93.9368]  // Imphal Kangla
      ]
    },
    hazardInfo: {
      locationName: 'Chumukedima Old Check Gate Km 24',
      coordinates: [25.8234, 93.8122],
      hazardType: 'Massive Subsidence & Rock Mudslide',
      severity: 'Total Road Severance',
      reportingAuthority: 'Nagaland State Disaster Management Authority (NSDMA)'
    }
  },

  // 6. Silchar–Aizawl
  {
    id: 'corridor-silchar-aizawl',
    name: 'Silchar–Aizawl',
    fullName: 'Silchar (Assam) to Aizawl (Mizoram) via NH306',
    shortName: 'Silchar ➔ Aizawl',
    highwayCode: 'NH-306',
    linkedRoadId: 'nh306-silchar-aizawl',
    origin: {
      name: 'Silchar Rongpur, Assam',
      city: 'Silchar',
      state: 'Assam',
      coordinates: [24.8333, 92.7789]
    },
    destination: {
      name: 'Aizawl Treasury Square, Mizoram',
      city: 'Aizawl',
      state: 'Mizoram',
      coordinates: [23.7307, 92.7173]
    },
    primaryRoute: {
      title: 'NH-306 Mizoram Lifeline Highway (Primary)',
      distanceKm: 178.0,
      normalDurationMin: 330, // 5h 30m
      speedLimitKmph: 45,
      surfaceCondition: '2-Lane Mountain Highway',
      elevationMeters: '26m ➔ 1132m',
      coordinates: [
        [24.8333, 92.7789], // Silchar
        [24.6200, 92.7500], // Dholai
        [24.4800, 92.7650], // Lailapur Border
        [24.4100, 92.7600], // Vairengte (Hazard)
        [24.2800, 92.7300], // Bilkhawthlir
        [24.2100, 92.6800], // Kolasib
        [23.9500, 92.6900], // Rengtekawn
        [23.8200, 92.7200], // Durtlang Hill
        [23.7307, 92.7173]  // Aizawl
      ],
      blockedSegment: [
        [24.4800, 92.7650], // Lailapur
        [24.4100, 92.7600], // Vairengte
        [24.2800, 92.7300]  // Bilkhawthlir
      ]
    },
    safeAlternateRoute: {
      title: 'Hailakandi - Bairabi - Mamit Ridge Alternate Bypass',
      via: 'Via Hailakandi, Katlicherra, Bairabi Railhead Road & Mamit',
      distanceKm: 215.0,
      detourDurationMin: 390, // 6h 30m
      delayMin: 60,
      safetyScore: '94% (Stable Ridge Bypass)',
      roadClassification: 'Mizoram State Highway SH-2 & Bairabi Freight Corridor',
      advisory: 'Designated alternate heavy freight route during Vairengte mountain slope failures.',
      coordinates: [
        [24.8333, 92.7789], // Silchar
        [24.5800, 92.5200], // Hailakandi
        [24.3200, 92.4800], // Lala / Katlicherra
        [24.1800, 92.5400], // Bairabi
        [23.9200, 92.4900], // Mamit
        [23.8100, 92.6200], // Lengpui Airport Road
        [23.7307, 92.7173]  // Aizawl
      ]
    },
    hazardInfo: {
      locationName: 'Vairengte Hill Pass Km 38',
      coordinates: [24.4100, 92.7600],
      hazardType: 'Monsoon Silt Landslip & Retaining Wall Breach',
      severity: 'Critical (Passable only by light emergency 4x4)',
      reportingAuthority: 'Mizoram Disaster Management & PWD Highway Division'
    }
  },

  // 7. Tripura Main Road
  {
    id: 'corridor-tripura-main-road',
    name: 'Tripura Main Road',
    fullName: 'Silchar (Assam) to Agartala (Tripura) via NH8',
    shortName: 'Silchar ➔ Agartala',
    highwayCode: 'NH-8',
    linkedRoadId: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    origin: {
      name: 'Silchar Rongpur Trunk, Assam',
      city: 'Silchar',
      state: 'Assam',
      coordinates: [24.8333, 92.7789]
    },
    destination: {
      name: 'Agartala Motorstand, Tripura',
      city: 'Agartala',
      state: 'Tripura',
      coordinates: [23.8315, 91.2868]
    },
    primaryRoute: {
      title: 'NH-8 Tripura Lifeline Highway (Primary)',
      distanceKm: 254.0,
      normalDurationMin: 375, // 6h 15m
      speedLimitKmph: 55,
      surfaceCondition: '2-Lane National Highway',
      elevationMeters: '26m ➔ 280m',
      coordinates: [
        [24.8333, 92.7789], // Silchar Rongpur
        [24.8640, 92.3590], // Karimganj Town
        [24.4920, 92.2410], // Churaibari Tripura Border
        [24.3750, 92.1640], // Dharmanagar
        [24.1620, 92.0250], // Kumarghat Chokepoint
        [23.9210, 91.8520], // Ambassa Atharamura Range (Hazard)
        [23.8340, 91.6020], // Teliamura
        [23.8290, 91.4310], // Jirania
        [23.8315, 91.2868]  // Agartala Motorstand
      ],
      blockedSegment: [
        [24.1620, 92.0250],
        [23.9210, 91.8520],
        [23.8340, 91.6020]
      ]
    },
    safeAlternateRoute: {
      title: 'Kailashahar - Kamalpur - Khowai Safe Corridor',
      via: 'Via Kailashahar, Kamalpur Valley & Khowai Border Bypass',
      distanceKm: 282.0,
      detourDurationMin: 420, // 7h 00m
      delayMin: 45,
      safetyScore: '96% (Flood Protected Bypass)',
      roadClassification: 'Tripura State Highway SH-4 & Valley Bypass',
      advisory: 'Designated alternate freight and emergency corridor by Tripura Transport Department.',
      coordinates: [
        [24.8333, 92.7789], // Silchar
        [24.8640, 92.3590], // Karimganj
        [24.3750, 92.1640], // Dharmanagar
        [24.3200, 92.0100], // Kailashahar
        [24.1950, 91.8200], // Kamalpur
        [24.0620, 91.6050], // Khowai
        [23.8820, 91.4200], // Mandwi
        [23.8315, 91.2868]  // Agartala
      ]
    },
    hazardInfo: {
      locationName: 'Atharamura Hill Pass Km 118',
      coordinates: [23.9210, 91.8520],
      hazardType: 'Monsoon Soil Subsidence & Tree Collapse',
      severity: 'Critical (Severe Traffic Paralysis)',
      reportingAuthority: 'Tripura State Disaster Management Authority (TDMA)'
    }
  },

  // 8. Siliguri–Gangtok
  {
    id: 'corridor-siliguri-gangtok',
    name: 'Siliguri–Gangtok',
    fullName: 'Siliguri (West Bengal) to Gangtok (Sikkim) via NH10',
    shortName: 'Siliguri ➔ Gangtok',
    highwayCode: 'NH-10',
    linkedRoadId: 'nh10-siliguri-gangtok',
    origin: {
      name: 'Siliguri Junction, West Bengal',
      city: 'Siliguri',
      state: 'West Bengal',
      coordinates: [26.7271, 88.3953]
    },
    destination: {
      name: 'Gangtok MG Marg, Sikkim',
      city: 'Gangtok',
      state: 'Sikkim',
      coordinates: [27.3314, 88.6138]
    },
    primaryRoute: {
      title: 'NH-10 Teesta River Canyon Highway (Primary)',
      distanceKm: 114.0,
      normalDurationMin: 225, // 3h 45m
      speedLimitKmph: 40,
      surfaceCondition: 'Mountain Canyon 2-Lane Highway',
      elevationMeters: '122m ➔ 1650m',
      coordinates: [
        [26.7271, 88.3953], // Siliguri
        [26.8850, 88.4750], // Sevoke Coronation Bridge
        [26.9600, 88.4500], // Kalijhora
        [27.0520, 88.4710], // 29th Mile (Hazard Point)
        [27.1000, 88.5100], // Teesta Bazar
        [27.1700, 88.5250], // Rangpo Sikkim Border
        [27.2300, 88.5000], // Singtam
        [27.2900, 88.5700], // Ranipool
        [27.3314, 88.6138]  // Gangtok MG Marg
      ],
      blockedSegment: [
        [26.9600, 88.4500], // Kalijhora
        [27.0520, 88.4710], // 29th Mile
        [27.1000, 88.5100]  // Teesta Bazar
      ]
    },
    safeAlternateRoute: {
      title: 'Lava - Reshi - Pakyong All-Weather Ridge Bypass',
      via: 'Via Gorubathan, Lava Pass, Algarah, Reshi Border & Pakyong Airport Road',
      distanceKm: 152.0,
      detourDurationMin: 300, // 5h 00m
      delayMin: 75,
      safetyScore: '98% (High Ridge Route avoiding Teesta River)',
      roadClassification: 'West Bengal & Sikkim Inter-State Ridge Corridor',
      advisory: 'Certified safe alternate by Sikkim Govt & BRO (Project Swastik). Stable ridge route during Teesta floods.',
      coordinates: [
        [26.7271, 88.3953], // Siliguri
        [26.8850, 88.7000], // Gorubathan
        [27.0850, 88.6600], // Lava Pass
        [27.1400, 88.6200], // Algarah
        [27.1900, 88.6500], // Reshi Border
        [27.2200, 88.5900], // Rhenock
        [27.2400, 88.5950], // Pakyong Airport
        [27.3314, 88.6138]  // Gangtok
      ]
    },
    hazardInfo: {
      locationName: '29th Mile Teesta River Gorge Km 46',
      coordinates: [27.0520, 88.4710],
      hazardType: 'Flash Flood Washout & Continuous Mud Slips',
      severity: 'Critical (NH-10 Inundated by Teesta Surge)',
      reportingAuthority: 'Border Roads Organisation (Swastik) & Sikkim SDMA'
    }
  },

  // 9. Guwahati–Northeast Nagaland
  {
    id: 'corridor-guwahati-northeast-nagaland',
    name: 'Guwahati–Northeast Nagaland',
    fullName: 'Guwahati (Assam) to Mokokchung (Nagaland) via NH29/NH702',
    shortName: 'Guwahati ➔ Mokokchung',
    highwayCode: 'NH-702',
    linkedRoadId: 'nh702-guwahati-mokokchung',
    origin: {
      name: 'Guwahati ISBT, Assam',
      city: 'Guwahati',
      state: 'Assam',
      coordinates: [26.1445, 91.7362]
    },
    destination: {
      name: 'Mokokchung Town Square, Nagaland',
      city: 'Mokokchung',
      state: 'Nagaland',
      coordinates: [26.3255, 94.5262]
    },
    primaryRoute: {
      title: 'NH-702 Assam-Nagaland Foothill Arterial (Primary)',
      distanceKm: 385.0,
      normalDurationMin: 450, // 7h 30m
      speedLimitKmph: 55,
      surfaceCondition: 'Paved 2-Lane Hill Section',
      elevationMeters: '55m ➔ 1325m',
      coordinates: [
        [26.1445, 91.7362], // Guwahati
        [26.3500, 92.6800], // Nagaon
        [26.7500, 94.2200], // Jorhat
        [26.6600, 94.3200], // Mariani
        [26.6850, 94.4920], // Tuli (Hazard Point)
        [26.5400, 94.5300], // Changtongya
        [26.4200, 94.5100], // Chuchuyimlang
        [26.3255, 94.5262]  // Mokokchung
      ],
      blockedSegment: [
        [26.6600, 94.3200], // Mariani
        [26.6850, 94.4920], // Tuli
        [26.5400, 94.5300]  // Changtongya
      ]
    },
    safeAlternateRoute: {
      title: 'Dimapur - Wokha High Mountain Ridge Bypass',
      via: 'Via Dimapur, Wokha Capital Ridge & Sungro Hill Road',
      distanceKm: 418.0,
      detourDurationMin: 510, // 8h 30m
      delayMin: 60,
      safetyScore: '95% (Stable All-Weather Highway)',
      roadClassification: 'NH-2 / NH-61 Inter-District Ridge Corridor',
      advisory: 'Designated alternate heavy transit corridor by Nagaland PWD.',
      coordinates: [
        [26.1445, 91.7362], // Guwahati
        [26.1800, 92.8000], // Nagaon
        [25.9090, 93.7266], // Dimapur
        [26.1000, 94.2600], // Wokha Ridge
        [26.2400, 94.3800], // Sungro
        [26.3255, 94.5262]  // Mokokchung
      ]
    },
    hazardInfo: {
      locationName: 'Tuli Valley Foothills Ghat Km 62',
      coordinates: [26.6850, 94.4920],
      hazardType: 'Sinking Road Zone & Heavy Clay Slips',
      severity: 'Critical (Truck Movement Prohibited)',
      reportingAuthority: 'Mokokchung District Disaster Authority'
    }
  },

  // 10. Imphal–Moreh
  {
    id: 'corridor-imphal-moreh',
    name: 'Imphal–Moreh',
    fullName: 'Imphal to Moreh (Indo-Myanmar Asian Highway AH1) via NH102',
    shortName: 'Imphal ➔ Moreh',
    highwayCode: 'NH-102',
    linkedRoadId: 'nh102-imphal-moreh',
    origin: {
      name: 'Imphal Kangla, Manipur',
      city: 'Imphal',
      state: 'Manipur',
      coordinates: [24.8170, 93.9368]
    },
    destination: {
      name: 'Moreh ICP Border Post, Manipur',
      city: 'Moreh',
      state: 'Manipur',
      coordinates: [24.2442, 94.3015]
    },
    primaryRoute: {
      title: 'NH-102 Asian Highway AH-1 Strategic Corridor (Primary)',
      distanceKm: 108.0,
      normalDurationMin: 180, // 3h 00m
      speedLimitKmph: 50,
      surfaceCondition: '2-Lane Mountain Highway',
      elevationMeters: '786m ➔ 1420m ➔ 220m',
      coordinates: [
        [24.8170, 93.9368], // Imphal Kangla
        [24.6300, 93.9900], // Thoubal
        [24.4900, 94.0200], // Kakching Lamkhai
        [24.4400, 94.0800], // Pallel
        [24.3980, 94.1520], // Tengnoupal (Hazard Point)
        [24.3200, 94.2200], // Khudengthabi
        [24.2442, 94.3015]  // Moreh ICP
      ],
      blockedSegment: [
        [24.4400, 94.0800], // Pallel
        [24.3980, 94.1520], // Tengnoupal
        [24.3200, 94.2200]  // Khudengthabi
      ]
    },
    safeAlternateRoute: {
      title: 'Chandel Valley & Lokchao Low Gradient Bypass',
      via: 'Via Kakching, Sugnu Ring, Chandel Valley & Lokchao River Bridge',
      distanceKm: 132.0,
      detourDurationMin: 225, // 3h 45m
      delayMin: 45,
      safetyScore: '96% (Protected Low Valley Road)',
      roadClassification: 'Manipur Border Security & Relief Route',
      advisory: 'Maintained by Border Roads Organisation Project Sewak for trade continuity.',
      coordinates: [
        [24.8170, 93.9368], // Imphal
        [24.4900, 94.0200], // Kakching
        [24.3900, 94.0500], // Sugnu Ring
        [24.3200, 94.0100], // Chandel Valley Road
        [24.2600, 94.1800], // Lokchao Low Valley
        [24.2442, 94.3015]  // Moreh ICP
      ]
    },
    hazardInfo: {
      locationName: 'Tengnoupal Mountain Crest Km 64',
      coordinates: [24.3980, 94.1520],
      hazardType: 'Dense Fog & Mountain Ridge Rockfall',
      severity: 'Critical (High Risk Descent)',
      reportingAuthority: 'Manipur Traffic Police & BRO Sewak'
    }
  },

  // 11. Dhubri–Goalpara–Guwahati
  {
    id: 'corridor-dhubri-goalpara-guwahati',
    name: 'Dhubri–Goalpara–Guwahati',
    fullName: 'Dhubri to Goalpara to Guwahati via NH17',
    shortName: 'Dhubri ➔ Guwahati',
    highwayCode: 'NH-17',
    linkedRoadId: 'nh17-dhubri-guwahati',
    origin: {
      name: 'Dhubri Port Terminal, Assam',
      city: 'Dhubri',
      state: 'Assam',
      coordinates: [26.0207, 89.9744]
    },
    destination: {
      name: 'Guwahati Jalukbari, Assam',
      city: 'Guwahati',
      state: 'Assam',
      coordinates: [26.1445, 91.7362]
    },
    primaryRoute: {
      title: 'NH-17 South Brahmaputra Bank Highway (Primary)',
      distanceKm: 278.0,
      normalDurationMin: 360, // 6h 00m
      speedLimitKmph: 60,
      surfaceCondition: '2-Lane National Highway',
      elevationMeters: '34m ➔ 55m',
      coordinates: [
        [26.0207, 89.9744], // Dhubri Port
        [26.1000, 90.2300], // Bilasipara
        [26.1700, 90.6200], // Goalpara Naranarayan Setu
        [25.9860, 90.7320], // Dudhnoi (Hazard Point)
        [25.9950, 91.0100], // Dhupdhara
        [26.0000, 91.2500], // Boko
        [26.1000, 91.5600], // Mirza
        [26.1445, 91.7362]  // Guwahati Jalukbari
      ],
      blockedSegment: [
        [26.1700, 90.6200], // Goalpara
        [25.9860, 90.7320], // Dudhnoi
        [25.9950, 91.0100]  // Dhupdhara
      ]
    },
    safeAlternateRoute: {
      title: 'Naranarayan Bridge - NH-27 North Bank Expressway',
      via: 'Via Chapar, Abhayapuri, Barpeta Road, Nalbari & Rangia NH-27',
      distanceKm: 295.0,
      detourDurationMin: 390, // 6h 30m
      delayMin: 30,
      safetyScore: '99% (All-Weather 4-Lane North Corridor)',
      roadClassification: 'NH-27 East-West Expressway Corridor',
      advisory: 'Safe 4-lane bypass bypassing southern tributary river flood breaches.',
      coordinates: [
        [26.0207, 89.9744], // Dhubri Port
        [26.2500, 90.1500], // Chapar
        [26.3300, 90.6000], // Abhayapuri
        [26.4500, 91.0100], // Barpeta Road
        [26.4400, 91.4400], // Nalbari
        [26.2400, 91.6800], // Rangia
        [26.1445, 91.7362]  // Guwahati Jalukbari
      ]
    },
    hazardInfo: {
      locationName: 'Dudhnoi River Flood Bridge Km 92',
      coordinates: [25.9860, 90.7320],
      hazardType: 'Flash Torrent Road Shoulder Erosion',
      severity: 'Critical (Closed for structural inspection)',
      reportingAuthority: 'Goalpara District Administration & Assam PWD'
    }
  },

  // 12. Shillong–Dawki
  {
    id: 'corridor-shillong-dawki',
    name: 'Shillong–Dawki',
    fullName: 'Shillong to Dawki (Indo-Bangladesh Border) via NH206/NH40',
    shortName: 'Shillong ➔ Dawki',
    highwayCode: 'NH-206',
    linkedRoadId: 'nh206-shillong-dawki',
    origin: {
      name: 'Shillong Police Bazar, Meghalaya',
      city: 'Shillong',
      state: 'Meghalaya',
      coordinates: [25.5788, 91.8933]
    },
    destination: {
      name: 'Dawki Umngot ICP, Meghalaya',
      city: 'Dawki',
      state: 'Meghalaya',
      coordinates: [25.1856, 92.0194]
    },
    primaryRoute: {
      title: 'NH-206 Indo-Bangladesh Border Highway (Primary)',
      distanceKm: 82.0,
      normalDurationMin: 150, // 2h 30m
      speedLimitKmph: 45,
      surfaceCondition: '2-Lane Mountain Highway',
      elevationMeters: '1496m ➔ 20m',
      coordinates: [
        [25.5788, 91.8933], // Shillong Police Bazar
        [25.5200, 91.8700], // Upper Shillong Peak
        [25.4600, 91.8750], // Mylliem
        [25.3120, 91.9050], // Pynursla (Hazard Point)
        [25.2400, 91.9600], // Wahlong Valley
        [25.1950, 92.0000], // Tamabil Border
        [25.1856, 92.0194]  // Dawki Umngot Bridge
      ],
      blockedSegment: [
        [25.4600, 91.8750], // Mylliem
        [25.3120, 91.9050], // Pynursla
        [25.2400, 91.9600]  // Wahlong
      ]
    },
    safeAlternateRoute: {
      title: 'Mawphlang - Sohra (Cherrapunji) - Shella Safe Detour',
      via: 'Via Mawphlang, Cherrapunji High Ridge, Shella & Pongtung Low Valley',
      distanceKm: 112.0,
      detourDurationMin: 210, // 3h 30m
      delayMin: 60,
      safetyScore: '95% (Stable Bedrock Plateau Route)',
      roadClassification: 'Meghalaya PWD State Highway SH-5 & Scenic Valley Road',
      advisory: 'Paved all-weather road monitored by Meghalaya Tourism and SDRF.',
      coordinates: [
        [25.5788, 91.8933], // Shillong
        [25.4700, 91.7500], // Mawphlang
        [25.2800, 91.7200], // Cherrapunji / Sohra
        [25.1800, 91.6400], // Shella River
        [25.1500, 91.8500], // Pongtung Low Valley
        [25.1856, 92.0194]  // Dawki Umngot ICP
      ]
    },
    hazardInfo: {
      locationName: 'Pynursla Dense Fog & Hill Cliff Km 48',
      coordinates: [25.3120, 91.9050],
      hazardType: 'Dense Mountain Fog & Heavy Mudflow',
      severity: 'Critical (Zero Visibility & Cliff Silt Movement)',
      reportingAuthority: 'East Khasi Hills District Authority'
    }
  }
];

// Attach detourRoute alias to safeAlternateRoute on each object for 100% backwards compatibility
NER_CORRIDORS.forEach(c => {
  if (!c.detourRoute) {
    c.detourRoute = c.safeAlternateRoute;
  }
});

// Backwards-compatible aliases
export const ROUTE_CORRIDORS = NER_CORRIDORS;

/**
 * Format duration from minutes to human-readable string
 */
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
