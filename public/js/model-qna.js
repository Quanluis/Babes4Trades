// public/js/model-qna.js
console.log("🎥 model-qna.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOMContentLoaded fired");

  const host = document.getElementById("qnaPage");
  if (!host) {
    console.warn("[qna] Missing #qnaPage");
    return;
  }

  const modelSlug = (host.dataset.model || "").trim().toLowerCase();
  console.log("[qna] modelSlug:", modelSlug);

  if (!modelSlug) {
    console.warn("[qna] Missing data-model on #qnaPage");
    return;
  }

  // ✅ Try generic IDs, then dynamic per-model IDs, then fallbacks
  const qnaPlayer =
    document.getElementById("qnaPlayer") ||
    document.getElementById(`${modelSlug}QnaPlayer`) ||
    host.querySelector("iframe"); // fallback: iframe inside #qnaPage

  const qnaList =
    document.getElementById("qnaList") ||
    document.getElementById(`${modelSlug}QnaList`) ||
    document.querySelector(`#qnaSection ul.list-group`); // fallback

  if (!qnaPlayer || !qnaList) {
    console.warn("[qna] Missing player or list element", {
      qnaPlayerFound: !!qnaPlayer,
      qnaListFound: !!qnaList,
      expectedPlayerId: `${modelSlug}QnaPlayer`,
      expectedListId: `${modelSlug}QnaList`,
    });
    return;
  }

  // NOTE: Must match how you store your JWT
  const token = localStorage.getItem("token");
  console.log("[qna] token exists:", Boolean(token));

  qnaList.innerHTML = `<li class="list-group-item text-center text-muted">Loading Q&A...</li>`;

  try {
    const res = await fetch(`/api/qna?model=${encodeURIComponent(modelSlug)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    console.log("[qna] /api/qna status:", res.status);

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      const is401 = res.status === 401;

      qnaList.innerHTML = `
        <li class="list-group-item text-center ${is401 ? "text-warning" : "text-danger"}">
          ${is401 ? "Please sign in to view Q&A." : `Could not load Q&A (status ${res.status}).`}
        </li>`;
      console.error("[qna] fetch failed", res.status, msg);
      qnaPlayer.src = "";
      return;
    }

    const data = await res.json();
    const videos = Array.isArray(data.items) ? data.items : [];
    console.log("[qna] videos:", videos.length);

    if (!videos.length) {
      qnaList.innerHTML = `<li class="list-group-item text-center text-muted">No Q&A episodes yet.</li>`;
      qnaPlayer.src = "";
      return;
    }

    qnaList.innerHTML = "";
    videos.forEach((v, i) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.dataset.index = String(i);

      const span = document.createElement("span");
      span.textContent = `${i + 1}. ${v.title || "Untitled Episode"}`;

      li.appendChild(span);
      qnaList.appendChild(li);
    });

    function loadVideo(i) {
      const v = videos[i];
      if (!v?.embedUrl) return;

      qnaPlayer.src = v.embedUrl;

      [...qnaList.children].forEach((li) => {
        li.classList.toggle("active", Number(li.dataset.index) === i);
      });
    }

    qnaList.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-index]");
      if (!li) return;
      loadVideo(Number(li.dataset.index));
    });

    loadVideo(0);
  } catch (err) {
    console.error("[qna] error:", err);
    qnaList.innerHTML = `
      <li class="list-group-item text-center text-danger">
        Error loading Q&A. Please try again.
      </li>`;
    qnaPlayer.src = "";
  }
});
