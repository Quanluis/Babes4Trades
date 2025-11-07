// Lightweight localStorage progress helper
const KEY = 'b4t_progress_v1';

function readStore() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

function writeStore(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

/**
 * Save progress for a video
 * @param {string} videoId
 * @param {number} seconds
 * @param {boolean} completed
 */
export function saveProgress(videoId, seconds, completed = false) {
  const store = readStore();
  store[videoId] = {
    seconds: Math.max(0, Math.floor(seconds)),
    completed: !!completed,
    updatedAt: Date.now()
  };
  writeStore(store);
}

/**
 * Load saved seconds for a video
 * @param {string} videoId
 * @returns {number} seconds
 */
export function loadProgress(videoId) {
  const store = readStore();
  return store[videoId]?.seconds ?? 0;
}

/**
 * Mark complete
 * @param {string} videoId
 */
export function markComplete(videoId) {
  const store = readStore();
  const curr = store[videoId] || { seconds: 0 };
  store[videoId] = { ...curr, completed: true, updatedAt: Date.now() };
  writeStore(store);
}
