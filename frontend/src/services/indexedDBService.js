/**
 * MargSetu (मार्गसेतु) - Native IndexedDB Store & Forward Offline Queue
 * Manages reliable client-side caching of emergency hazard reports when operating in zero-connectivity terrain.
 */

const DB_NAME = 'margsetu_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'hazard_queue';

/**
 * Initializes and returns an IndexedDB instance
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a report to the offline queue
 */
export async function saveOfflineReport(report) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        ...report,
        queuedAt: new Date().toISOString(),
        syncStatus: 'pending_sync'
      });

      req.onsuccess = () => resolve(report);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback to localStorage if IndexedDB fails
    console.warn('IndexedDB unavailable, falling back to localStorage cache:', err);
    const existing = JSON.parse(localStorage.getItem('margsetu_offline_fallback_queue') || '[]');
    existing.push(report);
    localStorage.setItem('margsetu_offline_fallback_queue', JSON.stringify(existing));
    return report;
  }
}

/**
 * Retrieve all pending offline reports
 */
export async function getOfflineReports() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const idbReports = req.result || [];
        const fallbackReports = JSON.parse(localStorage.getItem('margsetu_offline_fallback_queue') || '[]');
        resolve([...idbReports, ...fallbackReports]);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    const fallbackReports = JSON.parse(localStorage.getItem('margsetu_offline_fallback_queue') || '[]');
    return fallbackReports;
  }
}

/**
 * Delete a specific report from offline queue after successful sync
 */
export async function deleteOfflineReport(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => {
        // Also cleanup fallback
        const existing = JSON.parse(localStorage.getItem('margsetu_offline_fallback_queue') || '[]');
        const filtered = existing.filter(r => r.id !== id);
        localStorage.setItem('margsetu_offline_fallback_queue', JSON.stringify(filtered));
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    const existing = JSON.parse(localStorage.getItem('margsetu_offline_fallback_queue') || '[]');
    const filtered = existing.filter(r => r.id !== id);
    localStorage.setItem('margsetu_offline_fallback_queue', JSON.stringify(filtered));
  }
}

/**
 * Clear the entire offline queue
 */
export async function clearOfflineQueue() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => {
        localStorage.removeItem('margsetu_offline_fallback_queue');
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    localStorage.removeItem('margsetu_offline_fallback_queue');
  }
}
