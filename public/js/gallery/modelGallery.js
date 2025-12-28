// public/js/gallery/modelGallery.js
// Scalable gallery loader for ALL model pages (Basic + Premium)
// Requires in HTML:
//   <div id="galleryPage" data-model="kara"></div>
//   <div id="galleryGridBasic"></div>
//   <div id="galleryGridPremium"></div>
// Uses Lightbox2 (data-lightbox / data-title)

document.addEventListener("DOMContentLoaded", () => {
  // Only run on pages that have gallery containers
  if (document.querySelector("#galleryGridBasic, #galleryGridPremium")) {
    loadGalleriesForModelPage();
  }
});

async function loadGalleriesForModelPage() {
  const basicRoot = document.getElementById("galleryGridBasic");
  const premiumRoot = document.getElementById("galleryGridPremium");
  const host = document.getElementById("galleryPage");

  // Must have at least one grid + host
  if ((!basicRoot && !premiumRoot) || !host) return;

  const modelSlug = (host.dataset.model || "").trim().toLowerCase();
  if (!modelSlug) {
    console.warn("[gallery] Missing data-model on #galleryPage");
    if (basicRoot) basicRoot.innerHTML = errorHTML("Gallery misconfigured: missing model.");
    if (premiumRoot) premiumRoot.innerHTML = errorHTML("Gallery misconfigured: missing model.");
    return;
  }

  // Auth state
  const user = safeParseJSON(localStorage.getItem("user"));
  const isPaid = user?.paidSubscription === true;
  const isPremiumUser = user?.tier === "premium";
  const token = localStorage.getItem("token");

  // If you want to hard redirect unpaid users
  if (!isPaid) {
    window.location.replace("pricing.html");
    return;
  }

  // Spinners
  if (basicRoot) basicRoot.innerHTML = spinnerHTML();
  if (premiumRoot) premiumRoot.innerHTML = spinnerHTML();

  try {
    const res = await fetch(`/api/galleries?model=${encodeURIComponent(modelSlug)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!res.ok) throw new Error(`Gallery fetch failed: ${res.status}`);

    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    console.log("[gallery] model:", modelSlug, "items:", items.length);
    if (items[0]) console.log("[gallery] sample item:", items[0]);

    const basicItems = items.filter(item => item.isPremium !== true);
    const premiumItems = items.filter(item => item.isPremium === true);


    // Render BASIC
    if (basicRoot) {
      renderGrid({
        root: basicRoot,
        items: basicItems,
        galleryName: `${modelSlug}-basic`,
        emptyMessage: "No basic content yet. Check back soon!"
      });
    }

    // Render PREMIUM
    if (premiumRoot) {
      if (!isPremiumUser) {
        premiumRoot.innerHTML = lockedHTML();
      } else {
        renderGrid({
          root: premiumRoot,
          items: premiumItems,
          galleryName: `${modelSlug}-premium`,
          emptyMessage: "No premium content yet. Check back soon!"
        });
      }
    }

  } catch (err) {
    console.error("[gallery] error:", err);
    if (basicRoot) basicRoot.innerHTML = errorHTML("Could not load basic gallery. Please try again.");
    if (premiumRoot) premiumRoot.innerHTML = errorHTML("Could not load premium gallery. Please try again.");
  }
}

function renderGrid({ root, items, galleryName, emptyMessage }) {
  if (!items.length) {
    root.innerHTML = emptyHTML(emptyMessage);
    return;
  }

  root.innerHTML = "";

  let appended = 0;

  for (const item of items) {
    const card = makeGalleryCard(item, galleryName);
    if (card) {
      root.appendChild(card);
      appended++;
    }
  }

  // If everything was skipped due to missing URLs, show a helpful message
  if (appended === 0) {
    root.innerHTML = emptyHTML("No displayable items (missing URLs). Check your gallery records.");
  }
}

function makeGalleryCard(item, galleryName) {
  // ✅ Accept multiple possible fields to avoid /undefined
  const imgUrl = item?.url || item?.bunnyUrl || item?.thumbnailUrl;
  const title = item?.title ?? "";

  // Skip bad records
  if (!imgUrl) {
    console.warn("[gallery] Skipping item with missing url:", item);
    return null;
  }

  const card = document.createElement("div");
  card.className = "col-12 col-sm-6 col-md-4 col-lg-3";

  // ✅ Lightbox2 uses data-lightbox and data-title
  card.innerHTML = `
    <div class="card h-100 shadow-sm">
      <a href="${imgUrl}" data-lightbox="${galleryName}" data-title="${escapeHtml(title)}">
        <img src="${imgUrl}" class="card-img-top" alt="${escapeHtml(title)}">
      </a>
      <div class="card-body">
        <h6 class="card-title mb-1">${escapeHtml(title)}</h6>
      </div>
    </div>`;

  return card;
}

// ---------- helpers ----------
function safeParseJSON(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

// Basic HTML escaping to prevent broken markup if titles contain quotes
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const spinnerHTML = () => `
  <div class="d-flex justify-content-center py-5 w-100">
    <div class="spinner-border" role="status" aria-label="Loading"></div>
  </div>`;

const emptyHTML = (msg) => `
  <div class="col-12">
    <div class="alert alert-info text-center">${msg}</div>
  </div>`;

const errorHTML = (msg) => `
  <div class="col-12">
    <div class="alert alert-danger text-center">${msg}</div>
  </div>`;

const lockedHTML = () => `
  <div class="col-12">
    <div class="p-4 text-center border rounded bg-light">
      <h5 class="mb-2">🔒 Premium Gallery Locked</h5>
      <p class="text-muted mb-3">Upgrade to Premium to unlock these photos.</p>
      <a href="pricing.html" class="btn btn-primary btn-sm">Upgrade to Premium</a>
    </div>
  </div>`;
