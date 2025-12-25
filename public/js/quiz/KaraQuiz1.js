// public/js/video/KaraQuiz1.js

// -------------------------
// 1. QUIZ QUESTION DATA (keyed by videoId from manifest)
// -------------------------
// IMPORTANT:
// - Keys should match the `id` values in your manifest videos[] (player.js dispatches detail.videoId)
// - If a quiz key is missing, it will fall back to quizzes.default
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
          "Only pay your bills"
        ],
        correctIndex: 1,
        explanation: "Paying yourself first means savings/investing gets funded BEFORE lifestyle."
      }
    ]
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
          "Your streaming subscriptions"
        ],
        correctIndex: 2,
        explanation: "Cash you own is an asset. Debt and expenses are not assets."
      }
    ]
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
          "A list of your debts"
        ],
        correctIndex: 1,
        explanation: "A budget is just a plan for your money. Rich people use them too."
      }
    ]
  },
  v4: {
    title: "Module 4 Quiz",
    questions: [
      {
        text: "What crypto is currently the most popular?",
        options: [
          "Bitcoin",
          "DogeCoin",
          "Ethereum",
          "None of these"
        ],
        correctIndex: 0,
        explanation: "Bitcoin"
      }
    ]
  },
  v5: {
    title: "Module 5 Quiz",
    questions: [
      {
        text: "What color USD?",
        options: [
          "Red",
          "Blue",
          "Green",
          "Black"
        ],
        correctIndex: 2,
        explanation: "Green."
      }
    ]
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
          "To avoid learning investing"
        ],
        correctIndex: 1,
        explanation: "Tracking spending helps you spot leaks and make a plan."
      }
    ]
  }
};


// -------------------------
// 2. (Optional) helpers for fallback matching
// -------------------------
function slugifyModuleText(text) {
  // "1. Assets & Liabilities" -> "assets_liabilities"
  return String(text || "")
    .replace(/^\s*\d+\.\s*/, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getActiveModuleFallbackKey() {
  const moduleList = document.getElementById("moduleList");
  if (!moduleList) return null;

  const activeLi =
    moduleList.querySelector(".list-group-item.active") ||
    moduleList.querySelector(".list-group-item");

  if (!activeLi) return null;

  // If player.js set dataset.quizKey, prefer it:
  const keyFromData = activeLi.dataset?.quizKey;
  if (keyFromData) return keyFromData;

  return slugifyModuleText(activeLi.textContent);
}

// -------------------------
// 3. RENDER QUIZ INTO SIDEBAR
// -------------------------
function renderQuiz(quiz) {
  const qEl = document.getElementById("quizQuestion");
  const optEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const submitBtn = document.getElementById("submitQuizBtn");

  if (!qEl || !optEl || !feedbackEl || !submitBtn) return;

  // Load the first question by default for now
  let currentIndex = 0;
  loadQuestion(currentIndex);

  function loadQuestion(i) {
    const q = quiz.questions[i];

    qEl.textContent = `${quiz.title}: ${i + 1}. ${q.text}`;

    optEl.innerHTML = q.options.map((opt, idx) => {
      return `
        <div class="form-check mb-1">
          <input class="form-check-input" type="radio" 
                 name="quizOption" 
                 id="opt${idx}" 
                 value="${idx}">
          <label class="form-check-label small" for="opt${idx}">
            ${opt}
          </label>
        </div>
      `;
    }).join("");

    feedbackEl.innerHTML = "";
  }

  // Handle submit button
  submitBtn.onclick = () => {
    const q = quiz.questions[currentIndex];
    const selected = document.querySelector("input[name='quizOption']:checked");

    if (!selected) {
      feedbackEl.innerHTML = `<span class="text-warning">❗ Please select an answer.</span>`;
      return;
    }

    const chosenIndex = Number(selected.value);

    if (chosenIndex === q.correctIndex) {
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
  };
}

function renderQuizForKey(key) {
  const quiz = (key && quizzes[key]) ? quizzes[key] : quizzes.default;
  renderQuiz(quiz);
}

// -------------------------
// 4. DYNAMIC WIRING (event-driven, plus a safety fallback)
// -------------------------
window.addEventListener("b4t:module-changed", (e) => {
  const detail = e.detail || {};
  // Primary: videoId from player.js (manifest id)
  const key = detail.videoId || null;

  // Secondary: try slug(title) if you prefer using titles as keys
  const titleKey = detail.title ? slugifyModuleText(detail.title) : null;

  renderQuizForKey(key || titleKey || "default");
});

document.addEventListener("DOMContentLoaded", () => {
  // Show something immediately
  renderQuizForKey(getActiveModuleFallbackKey() || "default");

  // Safety fallback: if moduleList gets rebuilt/active changes and event doesn't fire for some reason
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
