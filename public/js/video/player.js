// // public/js/video/player.js
// import { saveProgress, loadProgress, markComplete } from './progress.js';

// console.log('🎬 Video player module loaded');

// document.addEventListener('DOMContentLoaded', () => {
//   const iframe = document.getElementById('bunnyPlayer');
//   if (!iframe) return;

//   // Read a stable video id from a data- attribute set in HTML
//   const videoId = iframe.dataset.videoId || 'video-unknown';

//   // You can later use Bunny’s Player API to actually seek to resumeSec
//   const resumeSec = loadProgress(videoId);
//   if (resumeSec > 0) {
//     console.debug(`[player] resume hint ${resumeSec}s for ${videoId}`);
//     // TODO: when using Bunny Player API, seek to resumeSec here.
//   }

//   // Minimal heartbeat to “track” time locally
//   let seconds = resumeSec;
//   const interval = setInterval(() => {
//     seconds += 10;
//     saveProgress(videoId, seconds, false);
//     console.debug(`[player] watched ${seconds}s (saved)`);
//   }, 10000);

//   // Example: mark complete if user stays ~90% of a theoretical 10 min (optional)
//   // setTimeout(() => markComplete(videoId), 9 * 60 * 1000);

//   window.addEventListener('beforeunload', () => {
//     clearInterval(interval);
//     saveProgress(videoId, seconds, false);
//   });
// });

// public/js/video/player.js
console.log("🎬 player.js loaded");

// public/js/video/player.js
const REDIRECT_FOR_UNPAID = true;
const appRoot = document.getElementById('app');

const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;
const isPaid = !!(user && (user.paidSubscription === true || user.tier === 'basic' || user.tier === 'premium'));

if (REDIRECT_FOR_UNPAID && !isPaid) {
  window.location.replace('pricing.html');
} else {
  // ✅ allowed – reveal the page
  if (appRoot) appRoot.classList.remove('d-none');
}

window.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("videoTitle");
  const iframe  = document.getElementById("bunnyPlayer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const idxLbl  = document.getElementById("videoIndexLabel");
  const badge   = document.getElementById("progressBadge");

  console.log("[diag] DOM elements:", { titleEl, iframe, prevBtn, nextBtn, idxLbl, badge });

  const course = window.__COURSE__;
  console.log("[diag] manifest present?", !!course, course);

  // Fallback if manifest missing
  const videos = (course?.videos?.length ? course.videos : [{
    id: "fallback",
    title: "Fallback Sample",
    embedUrl: "https://iframe.mediadelivery.net/embed/410534/70fb39db-51e6-49b0-8567-ab2cccb65b4f?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
  }]);

  let index = 0;

  function render(i) {
    const v = videos[i];
    if (!v) return console.error("[diag] No video at index", i);
    if (titleEl) titleEl.textContent = v.title || "Untitled";
    if (idxLbl)  idxLbl.textContent  = `Lesson ${i + 1} of ${videos.length}`;
    if (iframe)  iframe.src          = v.embedUrl;
    if (prevBtn) prevBtn.disabled    = (i === 0);
    if (nextBtn) nextBtn.disabled    = (i === videos.length - 1);
    if (badge)   badge.textContent   = ""; // clear for now
    console.log("[diag] rendered index", i, v);
  }

  render(index);

  prevBtn?.addEventListener("click", () => { if (index > 0) { index--; render(index); }});
  nextBtn?.addEventListener("click", () => { if (index < videos.length - 1) { index++; render(index); }});
});

