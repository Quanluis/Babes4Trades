// public/js/video/KaraQuiz1.js
// Quiz loader + score summary + retake support

// -------------------------
// 1) QUIZ QUESTION DATA
// -------------------------
const quizzes = {
  v1: {
    title: "Module 1 Quiz",
    questions: [
      {
        text: "What’s the FIRST thing you should do when you get your paycheck?",
        options: [
          "Spend it, you earned it 😤",
          "Pay yourself first (savings/investing)",
          "Buy crypto and pray",
          "Only pay your bills",
        ],
        correctIndex: 1,
        explanation:
          "Paying yourself first means savings/investing gets funded BEFORE lifestyle.",
      },
    ],
  },

  v2: {
    title: "Module 2 Quiz",
    questions: [
      {
        text: "Which of these is an ASSET?",
        options: [
          "Your credit card balance",
          "Your monthly rent",
          "Cash in your savings account",
          "Your streaming subscriptions",
        ],
        correctIndex: 2,
        explanation: "Cash you own is an asset. Debt and expenses are not assets.",
      },
    ],
  },

  v3: {
    title: "Module 3 Quiz",
    questions: [
      {
        text: "A budget is basically:",
        options: [
          "A punishment for spending",
          "A plan for how you’ll use your money",
          "Only for people who are broke",
          "A list of your debts",
        ],
        correctIndex: 1,
        explanation: "A budget is just a plan for your money. Rich people use them too.",
      },
    ],
  },

  v4: {
    title: "Module 4 Quiz",
    questions: [
      {
        text: "What crypto is currently the most popular?",
        options: ["Bitcoin", "DogeCoin", "Ethereum", "None of these"],
        correctIndex: 0,
        explanation: "Bitcoin is the most widely recognized and popular crypto.",
      },
    ],
  },

  v5: {
    title: "Module 5 Quiz",
    questions: [
      {
        text: "What color is USD usually associated with?",
        options: ["Red", "Blue", "Green", "Black"],
        correctIndex: 2,
        explanation: "The U.S. dollar is commonly associated with green.",
      },
      {
        text: "Which is generally the safest long-term investing approach for beginners?",
        options: [
          "All-in on one meme stock",
          "Buying diversified index funds consistently",
          "Only holding cash forever",
          "Day trading every morning",
        ],
        correctIndex: 1,
        explanation:
          "Diversified index funds + consistency tends to be the safest beginner approach.",
      },
    ],
  },

  default: {
    title: "Personal Finance Checkpoint",
    questions: [
      {
        text: "Quick check: Why track your spending?",
        options: [
          "So you can shame yourself",
          "To see where your money is going",
          "So you can buy more stuff",
          "To avoid learning investing",
        ],
        correctIndex: 1,
        explanation: "Tracking spending helps you spot leaks and make a plan.",
      },
    ],
  },
};

// -------------------------
// 2) Helpers
// -------------------------
function slugifyModuleText(text) {
  return String(text || "")
    .replace(/^\s*\d+\.\s*/, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function isGuid(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(str || "")
  );
}

function getCourseVideosFromManifest() {
  const courseId = document.body?.dataset?.course || "course-101";
  const course = window.__COURSES__?.[courseId];
  return Array.isArray(course?.videos) ? course.videos : [];
}

function normalizeToQuizKey(rawKey) {
  if (!rawKey) return null;

  // Direct match: "v1"
  if (quizzes[rawKey]) return rawKey;

  // index_0 -> v1
  const m = /^index_(\d+)$/.exec(String(rawKey));
  if (m) {
    const idx = Number(m[1]);
    const vKey = `v${idx + 1}`;
    if (quizzes[vKey]) return vKey;
  }

  // Bunny GUID -> find which video it belongs to -> map to vN
  if (isGuid(rawKey)) {
    const vids = getCourseVideosFromManifest();
    const idx = vids.findIndex((v) => v && v.videoId === rawKey);
    if (idx >= 0) {
      const idFromManifest = vids[idx]?.id;
      if (idFromManifest && quizzes[idFromManifest]) return idFromManifest;

      const vKey = `v${idx + 1}`;
      if (quizzes[vKey]) return vKey;
    }
  }

  return null;
}

function getActiveModuleFallbackKey() {
  const moduleList = document.getElementById("moduleList");
  if (!moduleList) return "default";

  const activeLi =
    moduleList.querySelector(".list-group-item.active") ||
    moduleList.querySelector(".list-group-item");

  if (!activeLi) return "default";

  const keyFromData = activeLi.dataset?.quizKey;
  const norm1 = normalizeToQuizKey(keyFromData);
  if (norm1) return norm1;

  const slug = slugifyModuleText(activeLi.textContent);
  if (quizzes[slug]) return slug;

  return "default";
}

// -------------------------
// 3) Render quiz UI + scoring + retake
// -------------------------
function renderQuiz(quiz) {
  const qEl = document.getElementById("quizQuestion");
  const optEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const submitBtn = document.getElementById("submitQuizBtn");

  if (!qEl || !optEl || !feedbackEl || !submitBtn) {
    console.warn("[quiz] Missing quiz DOM elements:", {
      qEl,
      optEl,
      feedbackEl,
      submitBtn,
    });
    return;
  }

  // State
  const total = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
  let currentIndex = 0;
  let correctCount = 0;

  // Modes: "answer" -> grade current question, "next" -> go to next question, "retake" -> restart quiz
  submitBtn.dataset.mode = "answer";
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit";

  function renderScoreSummary() {
    const pct = total > 0 ? (correctCount / total) * 100 : 0;
    const pctRounded = Math.round(pct * 10) / 10; // 1 decimal

    feedbackEl.innerHTML = `
      <div class="mt-2">
        <div class="fw-bold">Quiz Complete ✅</div>
        <div class="small">
          Score: <span class="fw-semibold">${correctCount}/${total}</span>
          (<span class="fw-semibold">${pctRounded}%</span>)
        </div>
        <div class="small text-muted mt-1">You can retake the quiz anytime.</div>
      </div>
    `;
  }

  function lockOptions() {
    optEl.querySelectorAll("input[name='quizOption']").forEach((inp) => {
      inp.disabled = true;
    });
  }

  function loadQuestion(i) {
    const q = quiz.questions[i];
    if (!q) return;

    qEl.textContent = `${quiz.title}: ${i + 1}/${total}. ${q.text}`;

    optEl.innerHTML = q.options
      .map(
        (opt, idx) => `
          <div class="form-check mb-1">
            <input class="form-check-input" type="radio"
                   name="quizOption"
                   id="opt${idx}"
                   value="${idx}">
            <label class="form-check-label small" for="opt${idx}">
              ${opt}
            </label>
          </div>
        `
      )
      .join("");

    feedbackEl.innerHTML = "";
    submitBtn.dataset.mode = "answer";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }

  submitBtn.onclick = () => {
    const mode = submitBtn.dataset.mode || "answer";

    // RETAKE
    if (mode === "retake") {
      currentIndex = 0;
      correctCount = 0;
      loadQuestion(0);
      return;
    }

    // NEXT
    if (mode === "next") {
      const nextIndex = currentIndex + 1;
      if (nextIndex < total) {
        currentIndex = nextIndex;
        loadQuestion(currentIndex);
      } else {
        // Safety: if somehow next is clicked at end, show summary + retake
        renderScoreSummary();
        submitBtn.dataset.mode = "retake";
        submitBtn.textContent = "Retake Quiz";
        submitBtn.disabled = false;
      }
      return;
    }

    // ANSWER (grade current question)
    const q = quiz.questions[currentIndex];
    const selected = document.querySelector("input[name='quizOption']:checked");

    if (!selected) {
      feedbackEl.innerHTML = `<span class="text-warning">❗ Please select an answer.</span>`;
      return;
    }

    const chosenIndex = Number(selected.value);
    const isCorrect = chosenIndex === q.correctIndex;

    lockOptions();

    if (isCorrect) {
      correctCount += 1;
      feedbackEl.innerHTML = `
        <span class="text-success fw-bold">Correct ✔</span><br>
        <small class="text-muted">${q.explanation}</small>
      `;
    } else {
      feedbackEl.innerHTML = `
        <span class="text-danger fw-bold">Incorrect ❌</span><br>
        <small class="text-muted">${q.explanation}</small>
      `;
    }

    // If last question -> show score + retake
    const isLast = currentIndex === total - 1;

    if (isLast) {
      // append summary under the feedback
      const prev = feedbackEl.innerHTML;
      renderScoreSummary();
      feedbackEl.innerHTML = prev + feedbackEl.innerHTML;

      submitBtn.dataset.mode = "retake";
      submitBtn.textContent = "Retake Quiz";
      submitBtn.disabled = false;
    } else {
      submitBtn.dataset.mode = "next";
      submitBtn.textContent = "Next Question →";
      submitBtn.disabled = false;
    }
  };

  // Start
  if (total > 0) loadQuestion(0);
  else {
    qEl.textContent = `${quiz.title}: No questions available`;
    optEl.innerHTML = "";
    feedbackEl.innerHTML = "";
    submitBtn.disabled = true;
  }
}

function renderQuizForKey(key) {
  const quiz = key && quizzes[key] ? quizzes[key] : quizzes.default;
  renderQuiz(quiz);
}

// -------------------------
// 4) Wiring
// -------------------------
window.addEventListener("b4t:module-changed", (e) => {
  const detail = e.detail || {};

  const candidates = [detail.quizKey, detail.videoId, detail.bunnyId, detail.bunnyVideoId];

  let key = null;
  for (const c of candidates) {
    key = normalizeToQuizKey(c);
    if (key) break;
  }

  if (!key && detail.title) {
    const slug = slugifyModuleText(detail.title);
    if (quizzes[slug]) key = slug;
  }

  renderQuizForKey(key || "default");
});

document.addEventListener("DOMContentLoaded", () => {
  renderQuizForKey(getActiveModuleFallbackKey() || "default");

  // Keep quiz in sync if the active module changes via class toggles
  const moduleList = document.getElementById("moduleList");
  if (!moduleList) return;

  const obs = new MutationObserver(() => {
    const k = getActiveModuleFallbackKey();
    if (k) renderQuizForKey(k);
  });

  obs.observe(moduleList, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class"],
  });
});
