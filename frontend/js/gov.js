/**
 * MargSetu - Government Control Room & Emergency Response Center Controller
 * Manages regional GIS surveillance, live citizen hazard feed, route blocking, and multi-agency dispatch.
 */

import { store, NER_STATES } from './store.js';

export class GovControlRoomController {
  constructor(mapManager) {
    this.mapManager = mapManager;
    this.activeStateFilter = 'all';
    this.activeStatusFilter = 'all';
    this.searchQuery = '';
    this.selectedIncidentForDispatch = null;
  }

  init() {
    this.bindFilters();
    this.bindDispatchModal();
    this.bindBroadcastModal();
    this.bindSimulationTools();
    this.renderIncidentFeed();
    this.renderStats();

    // Subscribe to store updates
    store.subscribe(() => {
      this.renderIncidentFeed();
      this.renderStats();
    });
  }

  bindFilters() {
    // State Filter Tabs
    const stateTabsContainer = document.getElementById('gov-state-tabs');
    if (stateTabsContainer) {
      stateTabsContainer.innerHTML = NER_STATES.map(s => `
        <button class="state-tab-btn ${s.id === this.activeStateFilter ? 'active' : ''}" data-state="${s.id}">
          <span class="state-code">${s.code}</span>
          <span class="state-name">${s.name}</span>
        </button>
      `).join('');

      stateTabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.state-tab-btn');
        if (!btn) return;

        stateTabsContainer.querySelectorAll('.state-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.activeStateFilter = btn.dataset.state;
        this.mapManager.focusState(this.activeStateFilter);
        this.renderIncidentFeed();
      });
    }

    // Status Filters
    const statusPills = document.querySelectorAll('.gov-status-pill');
    statusPills.forEach(pill => {
      pill.addEventListener('click', () => {
        statusPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeStatusFilter = pill.dataset.status;
        this.renderIncidentFeed();
      });
    });

    // Search Input
    const searchInput = document.getElementById('gov-incident-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderIncidentFeed();
      });
    }
  }

  renderStats() {
    const stats = store.state.systemStats;
    const activeBlockEl = document.getElementById('stat-active-blockages');
    const pendingEl = document.getElementById('stat-pending-reports');
    const dispatchedEl = document.getElementById('stat-dispatched-units');
    const safeEl = document.getElementById('stat-safe-corridors');

    if (activeBlockEl) activeBlockEl.textContent = stats.activeBlockages;
    if (pendingEl) pendingEl.textContent = stats.pendingReports;
    if (dispatchedEl) dispatchedEl.textContent = stats.unitsDispatched;
    if (safeEl) safeEl.textContent = stats.safeCorridorsOpen;
  }

  renderIncidentFeed() {
    const container = document.getElementById('gov-incident-feed-list');
    if (!container) return;

    const incidents = store.getIncidents({
      state: this.activeStateFilter,
      status: this.activeStatusFilter,
      search: this.searchQuery
    });

    if (incidents.length === 0) {
      container.innerHTML = `
        <div class="empty-feed-card">
          <div class="empty-icon">✓</div>
          <h4>No Incidents Match Filters</h4>
          <p class="text-muted">All corridors in this sector are currently monitored and operational.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = incidents.map(inc => {
      let statusBadge = '';
      if (inc.status === 'PENDING_VERIFICATION') {
        statusBadge = `<span class="badge badge-amber"><span class="status-dot amber-pulse"></span>PENDING VERIFICATION</span>`;
      } else if (inc.status === 'VERIFIED_BLOCKED') {
        statusBadge = `<span class="badge badge-red"><span class="status-dot red-pulse"></span>VERIFIED &amp; BLOCKED</span>`;
      } else if (inc.status === 'RESCUE_DISPATCHED') {
        statusBadge = `<span class="badge badge-blue"><span class="status-dot blue-pulse"></span>RESCUE DISPATCHED</span>`;
      } else if (inc.status === 'RESOLVED_CLEARED') {
        statusBadge = `<span class="badge badge-green">RESOLVED &amp; CLEARED</span>`;
      } else if (inc.status === 'REJECTED_SPAM') {
        statusBadge = `<span class="badge badge-muted">REJECTED (SPAM)</span>`;
      }

      let severityBadge = '';
      if (inc.severity === 'critical') {
        severityBadge = `<span class="badge badge-outline-red">CRITICAL SEVERITY</span>`;
      } else if (inc.severity === 'high') {
        severityBadge = `<span class="badge badge-outline-amber">HIGH SEVERITY</span>`;
      } else {
        severityBadge = `<span class="badge badge-outline-blue">MODERATE</span>`;
      }

      return `
        <div class="gov-feed-card ${inc.status.toLowerCase()}" id="feed-card-${inc.id}">
          <div class="feed-card-header">
            <div class="feed-head-left">
              <span class="incident-code">${inc.id}</span>
              ${statusBadge}
              ${severityBadge}
            </div>
            <span class="feed-timestamp">⏱ ${inc.timestamp}</span>
          </div>

          <div class="feed-card-body">
            <div class="feed-img-wrapper" onclick="window.MargSetuApp.openImageModal('${inc.image}', '${inc.title}')">
              <img src="${inc.image}" alt="${inc.title}" class="feed-img" onerror="this.onerror=null; this.src='/assets/images/landslide_nh6.jpg';" />
              <span class="zoom-hint">🔍 Inspect Photo</span>
            </div>

            <div class="feed-content">
              <h4 class="feed-title">${inc.title}</h4>
              <p class="feed-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <strong>${inc.highway}</strong> &bull; ${inc.locationName}
              </p>
              <p class="feed-coords">
                Coordinates: <code>${inc.coords[0].toFixed(4)}°N, ${inc.coords[1].toFixed(4)}°E</code> &bull; Alt: ${inc.altitude}
              </p>
              <p class="feed-desc">${inc.description}</p>
              <div class="feed-reporter-meta">
                <span>👤 <strong>Reporter:</strong> ${inc.reportedBy}</span>
                <span class="cred-score">🛡 <strong>Credibility:</strong> ${inc.reporterCredibility}</span>
              </div>

              ${inc.dispatchInfo ? `
                <div class="feed-dispatch-banner">
                  <div class="dispatch-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    <strong>Dispatched:</strong> ${inc.dispatchInfo.unitType} (${inc.dispatchInfo.eta})
                  </div>
                  <p class="dispatch-details">${inc.dispatchInfo.equipment}</p>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="feed-card-actions">
            <button class="btn btn-sm btn-outline" onclick="window.MargSetuApp.panToIncident('${inc.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              View on Map
            </button>

            ${inc.status === 'PENDING_VERIFICATION' ? `
              <button class="btn btn-sm btn-danger" onclick="window.MargSetuApp.verifyIncident('${inc.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Verify &amp; Block Route
              </button>
              <button class="btn btn-sm btn-primary" onclick="window.MargSetuApp.openDispatchModal('${inc.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Dispatch Help
              </button>
              <button class="btn btn-sm btn-ghost text-muted" onclick="window.MargSetuApp.rejectIncident('${inc.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Reject Fake
              </button>
            ` : ''}

            ${inc.status === 'VERIFIED_BLOCKED' ? `
              <button class="btn btn-sm btn-primary" onclick="window.MargSetuApp.openDispatchModal('${inc.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Dispatch Rescue Teams
              </button>
              <button class="btn btn-sm btn-success" onclick="window.MargSetuApp.resolveIncident('${inc.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Mark Cleared &amp; Reopen
              </button>
            ` : ''}

            ${inc.status === 'RESCUE_DISPATCHED' ? `
              <button class="btn btn-sm btn-success" onclick="window.MargSetuApp.resolveIncident('${inc.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                Mark Cleared &amp; Reopen
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  bindDispatchModal() {
    const dialog = document.getElementById('gov-dispatch-dialog');
    const closeBtn = document.getElementById('close-dispatch-dialog');
    const form = document.getElementById('gov-dispatch-form');

    if (!dialog) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) dialog.close();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!this.selectedIncidentForDispatch) return;

        const unitSelect = document.getElementById('dispatch-unit-select');
        const leaderInput = document.getElementById('dispatch-leader-input');
        const etaInput = document.getElementById('dispatch-eta-input');
        const equipInput = document.getElementById('dispatch-equip-input');

        store.dispatchHelp(this.selectedIncidentForDispatch, {
          unitType: unitSelect ? unitSelect.value : 'NDRF Battalion 1',
          teamLeader: leaderInput ? leaderInput.value : 'Officer On Duty',
          eta: etaInput ? etaInput.value : '20 min remaining',
          equipment: equipInput ? equipInput.value : 'Excavator, JCB, Ambulance'
        });

        dialog.close();
        window.MargSetuApp.showToast(`🚨 Emergency Units successfully dispatched to incident ${this.selectedIncidentForDispatch}!`, 'info');
      });
    }
  }

  openDispatchModal(incidentId) {
    const inc = store.getIncidentById(incidentId);
    if (!inc) return;

    this.selectedIncidentForDispatch = incidentId;
    const dialog = document.getElementById('gov-dispatch-dialog');
    const targetTitle = document.getElementById('dispatch-target-title');
    const targetLoc = document.getElementById('dispatch-target-loc');

    if (targetTitle) targetTitle.textContent = `${inc.id}: ${inc.title}`;
    if (targetLoc) targetLoc.textContent = `📍 ${inc.highway} &bull; ${inc.locationName}`;

    if (dialog) dialog.showModal();
  }

  bindBroadcastModal() {
    const broadcastBtn = document.getElementById('trigger-broadcast-modal-btn');
    const dialog = document.getElementById('gov-broadcast-dialog');
    const closeBtn = document.getElementById('close-broadcast-dialog');
    const form = document.getElementById('gov-broadcast-form');

    if (!dialog) return;

    if (broadcastBtn) {
      broadcastBtn.addEventListener('click', () => dialog.showModal());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('broadcast-title-input');
        const msgInput = document.getElementById('broadcast-msg-input');
        const levelSelect = document.getElementById('broadcast-level-select');

        store.state.broadcasts.unshift({
          id: `BC-${Date.now()}`,
          level: levelSelect ? levelSelect.value : 'CRITICAL',
          title: titleInput ? titleInput.value : 'Emergency Highway Advisory',
          message: msgInput ? msgInput.value : 'Authorities advise extreme caution on mountain corridors.',
          timestamp: 'Just now'
        });
        store.notify();

        dialog.close();
        form.reset();
        window.MargSetuApp.showToast('📢 Emergency Broadcast sent to all citizen dashboards across NER!', 'warning');
      });
    }
  }

  bindSimulationTools() {
    const simLandslideBtn = document.getElementById('sim-new-landslide-btn');
    const simResetBtn = document.getElementById('sim-reset-state-btn');

    if (simLandslideBtn) {
      simLandslideBtn.addEventListener('click', () => {
        const presets = [
          {
            title: 'Flash Flood Over NH-27 Nagaon Bypass',
            type: 'flood',
            typeName: 'Flash Flood / River Overflow',
            severity: 'critical',
            highway: 'NH-27',
            locationName: 'Nagaon Bypass Km 32, Assam',
            state: 'assam',
            stateName: 'Assam',
            coords: [26.3500, 92.6800],
            altitude: '80 m',
            reportedBy: 'Assam State Transport Driver #AS-02-B-9901',
            image: '/assets/images/flood_nh27.jpg',
            description: 'Kopili river water crossed embankment. 2 feet high current over road.'
          },
          {
            title: 'Mudslide on NH-306 Silchar-Aizawl Lifeline',
            type: 'landslide',
            typeName: 'Monsoon Mudslide Blockage',
            severity: 'critical',
            highway: 'NH-306',
            locationName: 'Kolasib District Border, Mizoram',
            state: 'mizoram',
            stateName: 'Mizoram',
            coords: [24.2250, 92.6800],
            altitude: '820 m',
            reportedBy: 'K. Lalrinawma (Local Resident)',
            image: '/assets/images/landslide_nh6.jpg',
            description: 'Slopes collapsed after 6 hours of heavy rainfall. Essential supply trucks queued up.'
          }
        ];

        const pick = presets[Math.floor(Math.random() * presets.length)];
        const created = store.addIncident(pick);
        window.MargSetuApp.showToast(`⚡ Simulation Event: New incident ${created.id} reported by citizen!`, 'warning');
      });
    }

    if (simResetBtn) {
      simResetBtn.addEventListener('click', () => {
        if (confirm('Reset MargSetu to initial demo state?')) {
          store.resetDemo();
          window.MargSetuApp.showToast('🔄 Demo state reset to default NER baseline.', 'info');
        }
      });
    }
  }
}
