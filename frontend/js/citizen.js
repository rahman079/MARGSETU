/**
 * MargSetu - Citizen & Driver Dashboard Controller
 * Powers route selection, dual-route comparison, emergency reporting, and simulated GPS telemetry.
 */

import { store, NER_ROUTES, NER_LOCATIONS } from './store.js';

export class CitizenController {
  constructor(mapManager) {
    this.mapManager = mapManager;
    this.currentRouteId = 'guwahati-shillong';
    this.selectedReportImage = 'assets/images/landslide_nh6.jpg';
    this.currentGps = null;
  }

  init() {
    this.bindRouteSelectors();
    this.bindReportModal();
    this.bindEmergencySos();
    this.loadRoute(this.currentRouteId);

    // Listen to store updates
    store.subscribe(() => {
      this.renderRouteDetails(this.currentRouteId);
    });
  }

  bindRouteSelectors() {
    const originSelect = document.getElementById('citizen-origin-select');
    const destSelect = document.getElementById('citizen-dest-select');
    const swapBtn = document.getElementById('citizen-swap-route');

    // Populate dropdowns
    if (originSelect && destSelect) {
      originSelect.innerHTML = Object.values(NER_LOCATIONS).map(loc => 
        `<option value="${loc.id}">${loc.name} (${loc.state})</option>`
      ).join('');

      destSelect.innerHTML = Object.values(NER_LOCATIONS).map(loc => 
        `<option value="${loc.id}">${loc.name} (${loc.state})</option>`
      ).join('');

      // Set initial
      originSelect.value = 'guwahati';
      destSelect.value = 'shillong';

      const handleRouteChange = () => {
        const o = originSelect.value;
        const d = destSelect.value;
        const key1 = `${o}-${d}`;
        const key2 = `${d}-${o}`;

        if (NER_ROUTES[key1]) {
          this.loadRoute(key1);
        } else if (NER_ROUTES[key2]) {
          this.loadRoute(key2);
        } else {
          // Default to closest available route
          this.loadRoute('guwahati-shillong');
        }
      };

      originSelect.addEventListener('change', handleRouteChange);
      destSelect.addEventListener('change', handleRouteChange);

      if (swapBtn) {
        swapBtn.addEventListener('click', () => {
          const temp = originSelect.value;
          originSelect.value = destSelect.value;
          destSelect.value = temp;
          handleRouteChange();
        });
      }
    }

    // Quick Route Chips
    const chips = document.querySelectorAll('.quick-route-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const routeId = chip.dataset.routeId;
        if (routeId && NER_ROUTES[routeId]) {
          const r = NER_ROUTES[routeId];
          if (originSelect) originSelect.value = r.origin;
          if (destSelect) destSelect.value = r.destination;
          this.loadRoute(routeId);
        }
      });
    });

    // Map Layer Toggles
    const layerBtns = document.querySelectorAll('.map-layer-btn');
    layerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        layerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const layer = btn.dataset.layer;
        this.mapManager.setTileLayer(layer);
      });
    });
  }

  loadRoute(routeId) {
    if (!NER_ROUTES[routeId]) return;
    this.currentRouteId = routeId;
    this.mapManager.renderRoute(routeId);
    this.renderRouteDetails(routeId);
  }

  renderRouteDetails(routeId) {
    const route = NER_ROUTES[routeId];
    if (!route) return;

    // 1. Safe Route Card
    const safeCard = document.getElementById('safe-route-card');
    if (safeCard) {
      safeCard.innerHTML = `
        <div class="route-card-badge badge-green-glow">
          <span class="status-dot green-pulse"></span>
          RECOMMENDED SAFEST PATH
        </div>
        <div class="route-header">
          <div>
            <h3 class="route-title">${route.safeRoute.label}</h3>
            <p class="route-sub">${route.highway} &bull; Fortified Mountain Corridor</p>
          </div>
          <div class="eta-pill eta-green">
            <span class="eta-time">${route.safeRoute.eta}</span>
            <span class="eta-dist">${route.safeRoute.distance}</span>
          </div>
        </div>

        <div class="safety-metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Safety Index</span>
            <span class="metric-val text-emerald">${route.safeRoute.safetyScore}% Safe</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Max Elevation</span>
            <span class="metric-val">${route.safeRoute.elevationMax}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Active Hazards</span>
            <span class="metric-val text-emerald">0 Clear</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">BRO Surveillance</span>
            <span class="metric-val text-emerald">24x7 Active</span>
          </div>
        </div>

        <p class="route-desc-box">${route.safeRoute.description}</p>

        <div class="turn-steps-accordion">
          <div class="steps-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            Navigation Guidance Steps (${route.safeRoute.steps.length})
          </div>
          <div class="steps-list">
            ${route.safeRoute.steps.map((s, idx) => `
              <div class="step-item">
                <div class="step-num">${idx + 1}</div>
                <div class="step-text">
                  <p>${s.instruction}</p>
                  <span class="step-dist">${s.dist}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 2. Danger / Blocked Route Card
    const dangerCard = document.getElementById('danger-route-card');
    if (dangerCard && route.dangerRoute) {
      dangerCard.innerHTML = `
        <div class="route-card-badge badge-red-glow">
          <span class="status-dot red-pulse"></span>
          DANGEROUS / BLOCKED CORRIDOR
        </div>
        <div class="route-header">
          <div>
            <h3 class="route-title">${route.dangerRoute.label}</h3>
            <p class="route-sub text-red">⛔ Route Blocked by Natural Hazard</p>
          </div>
          <div class="eta-pill eta-red">
            <span class="eta-time">${route.dangerRoute.eta}</span>
            <span class="eta-dist">${route.dangerRoute.distance}</span>
          </div>
        </div>

        <div class="hazard-spotlight-card">
          <div class="hazard-thumb-wrapper">
            <img src="${route.dangerRoute.hazardImage}" alt="${route.dangerRoute.hazardType}" class="hazard-photo" onerror="this.onerror=null; this.src='/assets/images/landslide_nh6.jpg';" />
            <div class="hazard-photo-overlay">
              <span class="badge badge-red">LIVE GROUND PHOTO</span>
            </div>
          </div>
          <div class="hazard-details">
            <h4 class="hazard-name">${route.dangerRoute.hazardType}</h4>
            <p class="hazard-loc">📍 ${route.dangerRoute.hazardLocation}</p>
            <p class="hazard-desc">${route.dangerRoute.description}</p>
          </div>
        </div>

        <div class="warning-bullet-box">
          <div class="warning-box-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Official Road Warnings
          </div>
          <ul>
            ${route.dangerRoute.warnings.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      `;
    }
  }

  bindReportModal() {
    const reportFab = document.getElementById('report-disaster-fab');
    const reportModal = document.getElementById('disaster-report-dialog');
    const closeBtn = document.getElementById('close-report-dialog');
    const gpsBtn = document.getElementById('auto-fetch-gps-btn');
    const gpsDisplay = document.getElementById('gps-telemetry-display');
    const form = document.getElementById('disaster-report-form');
    const presetChips = document.querySelectorAll('.disaster-preset-card');
    const photoUploadInput = document.getElementById('hazard-photo-input');
    const photoPreviewImg = document.getElementById('hazard-preview-img');

    if (!reportModal) return;

    // Open Modal
    if (reportFab) {
      reportFab.addEventListener('click', () => {
        reportModal.showModal();
        this.simulateGpsTelemetry();
      });
    }

    // Close Modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        reportModal.close();
      });
    }

    // Light-dismiss fallback as per modern-web-guidance
    reportModal.addEventListener('click', (event) => {
      if (event.target !== reportModal) return;
      const rect = reportModal.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) {
        reportModal.close();
      }
    });

    // Preset Selection
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        presetChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        const imgSrc = chip.dataset.image;
        const type = chip.dataset.type;
        const title = chip.dataset.title;
        const highway = chip.dataset.highway;
        const state = chip.dataset.state;
        const lat = parseFloat(chip.dataset.lat);
        const lng = parseFloat(chip.dataset.lng);

        this.selectedReportImage = imgSrc;
        if (photoPreviewImg) photoPreviewImg.src = imgSrc;

        // Auto-select dropdown
        const typeSelect = document.getElementById('report-hazard-type');
        if (typeSelect) typeSelect.value = type;

        const highwayInput = document.getElementById('report-highway-input');
        if (highwayInput) highwayInput.value = highway;

        // Set GPS
        this.currentGps = {
          coords: [lat, lng],
          highway: highway,
          locationName: title,
          state: state,
          altitude: '1,120 m'
        };
        this.updateGpsBadge();
      });
    });

    // Custom File Upload
    if (photoUploadInput) {
      photoUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            this.selectedReportImage = re.target.result;
            if (photoPreviewImg) photoPreviewImg.src = re.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Auto-fetch GPS button
    if (gpsBtn) {
      gpsBtn.addEventListener('click', () => {
        this.simulateGpsTelemetry(true);
      });
    }

    // Form Submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const typeSelect = document.getElementById('report-hazard-type');
        const severityInputs = document.getElementsByName('report-severity');
        const descInput = document.getElementById('report-description');
        const highwayInput = document.getElementById('report-highway-input');
        const reporterInput = document.getElementById('report-citizen-name');

        let severity = 'critical';
        for (const radio of severityInputs) {
          if (radio.checked) {
            severity = radio.value;
            break;
          }
        }

        if (!this.currentGps) {
          this.simulateGpsTelemetry();
        }

        const typeNameMap = {
          landslide: 'Massive Mud & Rock Landslide',
          rockfall: 'Himalayan Boulder Fall / Rockfall',
          flood: 'Flash Flood & Submerged Bridge',
          cavein: 'Road Sinking & Structural Cave-in',
          avalanche: 'Snow Avalanche / Drift'
        };

        const selectedType = typeSelect ? typeSelect.value : 'landslide';

        const newIncident = store.addIncident({
          title: `Citizen Alert: ${typeNameMap[selectedType] || 'Road Hazard'}`,
          type: selectedType,
          typeName: typeNameMap[selectedType] || 'Road Hazard',
          severity: severity,
          highway: highwayInput ? highwayInput.value : (this.currentGps.highway || 'NH-6 Corridor'),
          locationName: this.currentGps.locationName || `Km 42.5 on ${this.currentGps.highway || 'NH-6'}`,
          state: this.currentGps.state || 'meghalaya',
          coords: this.currentGps.coords,
          altitude: this.currentGps.altitude || '1,040 m',
          reportedBy: reporterInput && reporterInput.value ? reporterInput.value : 'Verified Citizen Driver',
          image: this.selectedReportImage,
          description: descInput ? descInput.value : 'Sudden roadblock observed. Requesting rapid BRO / NDRF clearance.',
          affectedRouteId: this.currentRouteId
        });

        reportModal.close();
        form.reset();

        // Show Toast
        window.MargSetuApp.showToast(`🚨 Alert Submitted! Incident ${newIncident.id} is now live in the Government Control Room queue.`, 'success');
      });
    }
  }

  simulateGpsTelemetry(forceRandom = false) {
    const locations = [
      { coords: [25.6601, 91.8950], highway: 'NH-6 (Jorabat-Shillong)', locationName: 'Km 48.2 near Umiam Lake, Meghalaya', state: 'meghalaya', altitude: '1,020 m' },
      { coords: [27.5050, 92.1020], highway: 'NH-13 (Trans-Arunachal)', locationName: 'Sela Pass Ridge, West Kameng, Arunachal', state: 'arunachal', altitude: '4,170 m' },
      { coords: [25.8234, 93.8122], highway: 'NH-29 (Dimapur-Kohima)', locationName: 'Km 24 Chumukedima Hill Section, Nagaland', state: 'nagaland', altitude: '340 m' },
      { coords: [26.5412, 92.9801], highway: 'NH-715 (Kaliabor Crossing)', locationName: 'Nagaon Low Bridge Deck, Assam', state: 'assam', altitude: '74 m' }
    ];

    const pick = forceRandom ? locations[Math.floor(Math.random() * locations.length)] : locations[0];
    this.currentGps = pick;
    this.updateGpsBadge();
  }

  updateGpsBadge() {
    const gpsDisplay = document.getElementById('gps-telemetry-display');
    const highwayInput = document.getElementById('report-highway-input');
    if (!this.currentGps) return;

    if (highwayInput) {
      highwayInput.value = this.currentGps.highway;
    }

    if (gpsDisplay) {
      gpsDisplay.innerHTML = `
        <div class="gps-lock-active">
          <span class="status-dot green-pulse"></span>
          <div class="gps-text">
            <strong>GPS Locked: ${this.currentGps.coords[0].toFixed(4)}°N, ${this.currentGps.coords[1].toFixed(4)}°E</strong>
            <p>${this.currentGps.locationName} &bull; Alt: ${this.currentGps.altitude} &bull; Precision: &plusmn;3m</p>
          </div>
        </div>
      `;
    }
  }

  bindEmergencySos() {
    const sosBtn = document.getElementById('citizen-sos-btn');
    const sosModal = document.getElementById('emergency-sos-dialog');
    const closeSos = document.getElementById('close-sos-dialog');

    if (sosBtn && sosModal) {
      sosBtn.addEventListener('click', () => {
        sosModal.showModal();
      });
    }

    if (closeSos && sosModal) {
      closeSos.addEventListener('click', () => {
        sosModal.close();
      });
    }
  }
}
