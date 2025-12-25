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


// console.log("🎬 player.js loaded");

// // public/js/video/player.js
// const REDIRECT_FOR_UNPAID = true;
// const appRoot = document.getElementById('app');

// const rawUser = localStorage.getItem('user');
// const user = rawUser ? JSON.parse(rawUser) : null;
// const isPaid = !!(user && (user.paidSubscription === true || user.tier === 'basic' || user.tier === 'premium'));

// if (REDIRECT_FOR_UNPAID && !isPaid) {
//   window.location.replace('pricing.html');
// } else {
//   // ✅ allowed – reveal the page
//   if (appRoot) appRoot.classList.remove('d-none');
// }

// window.addEventListener("DOMContentLoaded", () => {
//   const titleEl = document.getElementById("videoTitle");
//   const iframe  = document.getElementById("bunnyPlayer");
//   const prevBtn = document.getElementById("prevBtn");
//   const nextBtn = document.getElementById("nextBtn");
//   const idxLbl  = document.getElementById("videoIndexLabel");
//   const badge   = document.getElementById("progressBadge");

//   console.log("[diag] DOM elements:", { titleEl, iframe, prevBtn, nextBtn, idxLbl, badge });

//   const course = window.__COURSE__;
//   console.log("[diag] manifest present?", !!course, course);

//   // Fallback if manifest missing
//   const videos = (course?.videos?.length ? course.videos : [{
//     id: "fallback",
//     title: "Fallback Sample",
//     embedUrl: "https://iframe.mediadelivery.net/embed/410534/70fb39db-51e6-49b0-8567-ab2cccb65b4f?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
//   }]);

//   let index = 0;

//   function render(i) {
//     const v = videos[i];
//     if (!v) return console.error("[diag] No video at index", i);
//     if (titleEl) titleEl.textContent = v.title || "Untitled";
//     if (idxLbl)  idxLbl.textContent  = `Lesson ${i + 1} of ${videos.length}`;
//     if (iframe)  iframe.src          = v.embedUrl;
//     if (prevBtn) prevBtn.disabled    = (i === 0);
//     if (nextBtn) nextBtn.disabled    = (i === videos.length - 1);
//     if (badge)   badge.textContent   = ""; // clear for now
//     console.log("[diag] rendered index", i, v);
//   }

//   render(index);

//   prevBtn?.addEventListener("click", () => { if (index > 0) { index--; render(index); }});
//   nextBtn?.addEventListener("click", () => { if (index < videos.length - 1) { index++; render(index); }});
// });

// public/js/video/player.js
// public/js/video/player.js
console.log("🎬 player.js loaded");

const REDIRECT_FOR_UNPAID = true;
const appRoot = document.getElementById("app");

// 🔐 Gating logic
const rawUser = localStorage.getItem("user");
const user = rawUser ? JSON.parse(rawUser) : null;
const isPaid = !!(
  user &&
  (user.paidSubscription === true ||
    user.tier === "basic" ||
    user.tier === "premium")
);

if (REDIRECT_FOR_UNPAID && !isPaid) {
  window.location.replace("pricing.html");
} else {
  if (appRoot) appRoot.classList.remove("d-none");
}

window.addEventListener("DOMContentLoaded", () => {
  const titleEl      = document.getElementById("videoTitle");
  const iframe       = document.getElementById("bunnyPlayer");
  const prevBtn      = document.getElementById("prevBtn");
  const nextBtn      = document.getElementById("nextBtn");
  const idxLbl       = document.getElementById("videoIndexLabel");
  const badge        = document.getElementById("progressBadge");
  const moduleList   = document.getElementById("moduleList");
  const markComplete = document.getElementById("markCompleteBtn");

  console.log("[diag] DOM elements:", {
    titleEl,
    iframe,
    prevBtn,
    nextBtn,
    idxLbl,
    badge,
    moduleList,
    markComplete,
  });

  const course = window.__COURSE__;
  console.log("[diag] manifest present?", !!course, course);

  // Fallback if manifest missing
  const videos =
    course?.videos?.length
      ? course.videos
      : [
          {
            id: "fallback",
            title: "Fallback Sample",
            embedUrl:
              "https://iframe.mediadelivery.net/embed/410534/70fb39db-51e6-49b0-8567-ab2cccb65b4f?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
          },
        ];

  let index = 0;

  // 🧩 Render the left module list from videos[]
  function renderModuleList() {
    if (!moduleList) return;

    moduleList.innerHTML = "";
    videos.forEach((v, i) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.dataset.index = i;

      // ✅ Stable key for quizzes (match this in KaraQuiz1.js)
      li.dataset.quizKey = v.id || `index_${i}`;

      li.innerHTML = `
        <span>${i + 1}. ${v.title || "Untitled"}</span>
      `;
      moduleList.appendChild(li);
    });
  }

  // 🎥 Render a specific video index in the player
  function render(i) {
    const v = videos[i];
    if (!v) {
      console.error("[diag] No video at index", i);
      return;
    }

    index = i;

    if (titleEl) titleEl.textContent = v.title || "Untitled";
    if (idxLbl) idxLbl.textContent = `Lesson ${i + 1} of ${videos.length}`;
    if (iframe) iframe.src = v.embedUrl;
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === videos.length - 1;
    if (badge) badge.textContent = ""; // you can put progress text here later

    // Highlight active module
    if (moduleList) {
      [...moduleList.children].forEach((li) => {
        li.classList.toggle("active", Number(li.dataset.index) === i);
      });
    }

    console.log("[diag] rendered index", i, v);

    // ✅ Notify quiz panel which module is active
    window.dispatchEvent(
      new CustomEvent("b4t:module-changed", {
        detail: {
          index: i,
          videoId: v.id || `index_${i}`,
          title: v.title || "Untitled",
        },
      })
    );
  }

  // ⬅️➡️ Prev / Next
  prevBtn?.addEventListener("click", () => {
    if (index > 0) {
      render(index - 1);
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (index < videos.length - 1) {
      render(index + 1);
    }
  });

  // 🖱 Click on module in sidebar → load that video
  moduleList?.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-index]");
    if (!li) return;
    const i = Number(li.dataset.index);
    if (!Number.isNaN(i)) {
      render(i);
    }
  });

  // ✅ Mark complete stub
  markComplete?.addEventListener("click", () => {
    const v = videos[index];
    alert(`Marked "${v.title}" as complete ✅`);
    // Later: save to localStorage or send to backend
  });

  // 🚀 Init
  renderModuleList();
  render(index);
});
