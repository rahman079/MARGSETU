/**
 * MargSetu - Master Application Coordinator & Router
 * Manages view switching between Landing, Citizen Dashboard, and Government Control Room.
 */

import { store } from './store.js';
import { CitizenMapManager, GovMapManager } from './map.js';
import { CitizenController } from './citizen.js';
import { GovControlRoomController } from './gov.js';

class MargSetuApplication {
  constructor() {
    this.currentView = 'landing';
    this.citizenMap = null;
    this.govMap = null;
    this.citizenController = null;
    this.govController = null;
  }

  init() {
    console.log('Initializing MargSetu 2.0 NER Disaster & Accessibility Platform...');

    // Initialize Map Managers
    this.citizenMap = new CitizenMapManager('citizen-leaflet-map');
    this.govMap = new GovMapManager('gov-leaflet-map');

    // Initialize Controllers
    this.citizenController = new CitizenController(this.citizenMap);
    this.govController = new GovControlRoomController(this.govMap);

    // Bind Navigation & Global Events
    this.bindNavigation();
    this.bindBroadcastBar();
    this.bindImageModal();

    // Check URL hash for direct deep-linking
    const hash = window.location.hash.replace('#', '');
    if (hash === 'citizen' || hash === 'government') {
      this.switchView(hash);
    } else {
      this.switchView('landing');
    }

    // Subscribe to store for live broadcast bar updates
    store.subscribe(() => {
      this.renderBroadcastBar();
    });
  }

  bindNavigation() {
    // Header Links
    const logoLink = document.getElementById('nav-logo-btn');
    const navGovBtn = document.getElementById('nav-gov-portal-btn');
    const navCitizenBtn = document.getElementById('nav-citizen-portal-btn');

    // Landing Page Action Cards
    const landingCitizenCard = document.getElementById('card-enter-citizen');
    const landingGovCard = document.getElementById('card-enter-gov');
    const heroExploreBtn = document.getElementById('hero-explore-routes-btn');

    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('landing');
      });
    }

    if (navGovBtn) {
      navGovBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('government');
      });
    }

    if (navCitizenBtn) {
      navCitizenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('citizen');
      });
    }

    if (landingCitizenCard) {
      landingCitizenCard.addEventListener('click', () => {
        this.switchView('citizen');
      });
    }

    if (landingGovCard) {
      landingGovCard.addEventListener('click', () => {
        this.switchView('government');
      });
    }

    if (heroExploreBtn) {
      heroExploreBtn.addEventListener('click', () => {
        this.switchView('citizen');
      });
    }

    // Role switcher pills on top right in inner pages
    const innerSwitchGov = document.querySelectorAll('.switch-to-gov');
    const innerSwitchCitizen = document.querySelectorAll('.switch-to-citizen');
    const innerSwitchLanding = document.querySelectorAll('.switch-to-landing');

    innerSwitchGov.forEach(el => el.addEventListener('click', () => this.switchView('government')));
    innerSwitchCitizen.forEach(el => el.addEventListener('click', () => this.switchView('citizen')));
    innerSwitchLanding.forEach(el => el.addEventListener('click', () => this.switchView('landing')));

    // Window PopState
    window.addEventListener('popstate', () => {
      const h = window.location.hash.replace('#', '');
      this.switchView(h || 'landing', false);
    });
  }

  switchView(viewName, pushHistory = true) {
    this.currentView = viewName;

    const views = {
      landing: document.getElementById('view-landing'),
      citizen: document.getElementById('view-citizen'),
      government: document.getElementById('view-government')
    };

    Object.entries(views).forEach(([name, el]) => {
      if (!el) return;
      if (name === viewName) {
        el.classList.add('active-view');
        el.style.display = 'block';
      } else {
        el.classList.remove('active-view');
        el.style.display = 'none';
      }
    });

    // Update Header Active State
    const navGovBtn = document.getElementById('nav-gov-portal-btn');
    const navCitizenBtn = document.getElementById('nav-citizen-portal-btn');

    if (navGovBtn && navCitizenBtn) {
      navGovBtn.classList.toggle('active', viewName === 'government');
      navCitizenBtn.classList.toggle('active', viewName === 'citizen');
    }

    if (pushHistory) {
      window.location.hash = viewName === 'landing' ? '' : viewName;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize Map on first view load or refresh sizing
    if (viewName === 'citizen') {
      if (!this.citizenMap.map) {
        this.citizenMap.init();
        this.citizenController.init();
      } else {
        this.citizenMap.invalidateSize();
      }
    } else if (viewName === 'government') {
      if (!this.govMap.map) {
        this.govMap.init();
        this.govController.init();
      } else {
        this.govMap.invalidateSize();
      }
    }
  }

  bindBroadcastBar() {
    this.renderBroadcastBar();
  }

  renderBroadcastBar() {
    const tickerList = document.querySelectorAll('.live-broadcast-ticker');
    const broadcasts = store.state.broadcasts;
    if (broadcasts.length === 0) return;

    const latest = broadcasts[0];
    const html = `
      <div class="broadcast-banner-inner">
        <div class="broadcast-tag"><span class="pulse-dot"></span> EMERGENCY ADVISORY</div>
        <div class="broadcast-marquee">
          <strong>${latest.title}:</strong> ${latest.message}
        </div>
        <span class="broadcast-time">${latest.timestamp}</span>
      </div>
    `;

    tickerList.forEach(t => {
      t.innerHTML = html;
    });
  }

  bindImageModal() {
    const dialog = document.getElementById('image-inspect-dialog');
    const closeBtn = document.getElementById('close-image-dialog');
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
  }

  openImageModal(src, title) {
    const dialog = document.getElementById('image-inspect-dialog');
    const img = document.getElementById('inspect-image-el');
    const caption = document.getElementById('inspect-image-caption');
    if (!dialog || !img) return;

    img.src = src;
    if (caption) caption.textContent = title;
    dialog.showModal();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    toast.innerHTML = `
      <div class="toast-body">
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span class="toast-msg">${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Global action handlers for inline HTML event bindings
  verifyIncident(incidentId) {
    const ok = store.verifyAndBlockRoute(incidentId);
    if (ok) {
      this.showToast(`⛔ Incident ${incidentId} verified. Route officially blocked and rerouted!`, 'warning');
    }
  }

  openDispatchModal(incidentId) {
    if (this.govController) {
      this.govController.openDispatchModal(incidentId);
    }
  }

  resolveIncident(incidentId) {
    const ok = store.resolveIncident(incidentId);
    if (ok) {
      this.showToast(`✅ Route corridor marked CLEARED & REOPENED to public!`, 'success');
    }
  }

  rejectIncident(incidentId) {
    const ok = store.rejectReport(incidentId);
    if (ok) {
      this.showToast(`🗑 Incident ${incidentId} flagged as spurious/spam and removed.`, 'info');
    }
  }

  panToIncident(incidentId) {
    if (this.govMap) {
      this.govMap.panToIncident(incidentId);
      // Smooth scroll to map on mobile
      const mapCard = document.getElementById('gov-map-panel');
      if (mapCard && window.innerWidth < 1024) {
        mapCard.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

// Instantiate and attach to window
window.MargSetuApp = new MargSetuApplication();
document.addEventListener('DOMContentLoaded', () => {
  window.MargSetuApp.init();
});
