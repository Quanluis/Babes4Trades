// public/js/video/player.js
import { saveProgress, loadProgress, markComplete } from './progress.js';

console.log('🎬 Video player module loaded');

document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('bunnyPlayer');
  if (!iframe) return;

  // Read a stable video id from a data- attribute set in HTML
  const videoId = iframe.dataset.videoId || 'video-unknown';

  // You can later use Bunny’s Player API to actually seek to resumeSec
  const resumeSec = loadProgress(videoId);
  if (resumeSec > 0) {
    console.debug(`[player] resume hint ${resumeSec}s for ${videoId}`);
    // TODO: when using Bunny Player API, seek to resumeSec here.
  }

  // Minimal heartbeat to “track” time locally
  let seconds = resumeSec;
  const interval = setInterval(() => {
    seconds += 10;
    saveProgress(videoId, seconds, false);
    console.debug(`[player] watched ${seconds}s (saved)`);
  }, 10000);

  // Example: mark complete if user stays ~90% of a theoretical 10 min (optional)
  // setTimeout(() => markComplete(videoId), 9 * 60 * 1000);

  window.addEventListener('beforeunload', () => {
    clearInterval(interval);
    saveProgress(videoId, seconds, false);
  });
});
