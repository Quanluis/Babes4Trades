// public/js/models/kara-qna.js
console.log("🎥 kara-qna.js loaded");

// 1) Kara's Q&A video data (update embedUrl for each real video later)
window.KARA_QA_VIDEOS = [
  {
    id: "kq1",
    title: "How Kara Fell In Love With High-Risk Trading",
    embedUrl:
      "https://iframe.mediadelivery.net/embed/410534/73380651-c037-4ac6-9b0d-1dee0edcfcb1?autoplay=false&responsive=true",
  },
  {
    id: "kq2",
    title: "Her Biggest Money Mistake (And What She Learned)",
    embedUrl:
      "https://iframe.mediadelivery.net/embed/410534/70fb39db-51e6-49b0-8567-ab2cccb65b4f?autoplay=false&loop=true&muted=false&preload=true&responsive=true",
  },
];

(function initKaraQna() {
  function run() {
    const qnaPlayer = document.getElementById("karaQnaPlayer");
    const qnaList = document.getElementById("karaQnaList");
    const videos = window.KARA_QA_VIDEOS || [];

    console.log("[kara-qna] DOM elements:", { qnaPlayer, qnaList });
    console.log("[kara-qna] videos length:", videos.length);

    if (!qnaPlayer || !qnaList) {
      console.warn("[kara-qna] Missing DOM elements, aborting.");
      return;
    }
    if (!Array.isArray(videos) || !videos.length) {
      console.warn("[kara-qna] No videos configured, aborting.");
      return;
    }

    function renderList() {
      qnaList.innerHTML = "";
      videos.forEach((video, index) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        li.dataset.index = index;
        li.innerHTML = `<span>${index + 1}. ${video.title}</span>`;
        qnaList.appendChild(li);
      });
    }

    function loadVideo(index) {
      const video = videos[index];
      if (!video) return;
      qnaPlayer.src = video.embedUrl;

      [...qnaList.children].forEach((li) => {
        li.classList.toggle(
          "active",
          Number(li.dataset.index) === index
        );
      });

      console.log("[kara-qna] Loaded video index", index, video.title);
    }

    qnaList.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-index]");
      if (!li) return;
      const index = Number(li.dataset.index);
      if (!Number.isNaN(index)) {
        loadVideo(index);
      }
    });

    renderList();
    loadVideo(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
