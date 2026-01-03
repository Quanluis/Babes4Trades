// public/js/video/player.js
console.log("🎬 player.js loaded");

const REDIRECT_FOR_UNPAID = true;
const appRoot = document.getElementById("app");

// 🔐 Gating logic
const rawUser = localStorage.getItem("user");
const user = rawUser ? JSON.parse(rawUser) : null;
const isPaid = !!(
  user &&
  (user.paidSubscription === true || user.tier === "basic" || user.tier === "premium")
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

  const courseId = document.body.dataset.course || "course-101";
  const course = window.__COURSES__?.[courseId];

  console.log("[diag] courseId:", courseId, "course found?", !!course);

  // Fallback if manifest missing
  const videos =
    course?.videos?.length
      ? course.videos
      : [
          {
            id: "fallback",
            title: "Fallback Sample",
            // Legacy fallback (may not work if Bunny embed token auth is enabled)
            embedUrl:
              "https://iframe.mediadelivery.net/embed/410534/70fb39db-51e6-49b0-8567-ab2cccb65b4f?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
          },
        ];

  let index = 0;

  // ---------------------------------------------------------------------------
  // 🔐 Signed Bunny embed support
  // - Works with token-protected embeds
  // - Backwards compatible: if v.embedUrl exists, it uses it
  // - Preferred: v.videoId + server endpoint /api/course-embed
  // ---------------------------------------------------------------------------
  const jwtToken = localStorage.getItem("token");
  const embedCache = new Map(); // videoId -> { url, expMs }
  let renderSeq = 0;

  function applyPlayerParams(baseUrl, v) {
    const u = new URL(baseUrl);

    // Ensure baseline flags
    u.searchParams.set("autoplay", "false");
    u.searchParams.set("responsive", "true");

    // Optional flags (use if present in manifest objects)
    if (typeof v.loop === "boolean") u.searchParams.set("loop", v.loop ? "true" : "false");
    if (typeof v.muted === "boolean") u.searchParams.set("muted", v.muted ? "true" : "false");
    if (typeof v.preload === "boolean") u.searchParams.set("preload", v.preload ? "true" : "false");

    return u.toString();
  }

  async function getSignedCourseEmbedUrl(v) {
    // ✅ Backwards compatibility
    if (v.embedUrl) return v.embedUrl;

    // ✅ Preferred: videoId-based
    if (!v.videoId) throw new Error("Missing videoId (and no embedUrl fallback)");

    // cache ~14 minutes (server TTL usually 15m)
    const cached = embedCache.get(v.videoId);
    if (cached && Date.now() < cached.expMs) return cached.url;

    const res = await fetch(`/api/course-embed?videoId=${encodeURIComponent(v.videoId)}`, {
      headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`course-embed failed (${res.status}): ${msg}`);
    }

    const data = await res.json();
    if (!data?.embedUrl) throw new Error("course-embed returned no embedUrl");

    const signedUrl = applyPlayerParams(data.embedUrl, v);
    embedCache.set(v.videoId, { url: signedUrl, expMs: Date.now() + 14 * 60 * 1000 });
    return signedUrl;
  }

  // ---------------------------------------------------------------------------
  // 🧩 Render the left module list from videos[]
  // ---------------------------------------------------------------------------
  function renderModuleList() {
    if (!moduleList) return;

    moduleList.innerHTML = "";
    videos.forEach((v, i) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.dataset.index = i;

      // ✅ Stable key for quizzes (match this in KaraQuiz1.js)
      li.dataset.quizKey = v.id || `index_${i}`;

      // Avoid innerHTML injection for title
      const span = document.createElement("span");
      span.textContent = `${i + 1}. ${v.title || "Untitled"}`;

      li.appendChild(span);
      moduleList.appendChild(li);
    });
  }

  // ---------------------------------------------------------------------------
  // 🎥 Render a specific video index in the player (async for signed embed)
  // ---------------------------------------------------------------------------
  async function render(i) {
    const v = videos[i];
    if (!v) {
      console.error("[diag] No video at index", i);
      return;
    }

    index = i;

    if (titleEl) titleEl.textContent = v.title || "Untitled";
    if (idxLbl) idxLbl.textContent = `Lesson ${i + 1} of ${videos.length}`;
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === videos.length - 1;

    if (badge) badge.textContent = "Loading video...";

    // Highlight active module
    if (moduleList) {
      [...moduleList.children].forEach((li) => {
        li.classList.toggle("active", Number(li.dataset.index) === i);
      });
    }

    // prevent race conditions on fast clicks
    const seq = ++renderSeq;

    try {
      const url = await getSignedCourseEmbedUrl(v);
      if (seq !== renderSeq) return; // newer render happened
      if (iframe) iframe.src = url;
      if (badge) badge.textContent = "";
    } catch (err) {
      console.error("[player] could not load video:", err);
      if (seq !== renderSeq) return;
      if (iframe) iframe.src = "";
      if (badge) badge.textContent = "Could not load video. (See console)";
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
    if (index > 0) render(index - 1);
  });

  nextBtn?.addEventListener("click", () => {
    if (index < videos.length - 1) render(index + 1);
  });

  // 🖱 Click on module in sidebar → load that video
  moduleList?.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-index]");
    if (!li) return;
    const i = Number(li.dataset.index);
    if (!Number.isNaN(i)) render(i);
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
