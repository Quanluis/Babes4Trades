// public/js/video/KaraQuiz1.js

// -------------------------
// 1. QUIZ QUESTION DATA
// -------------------------
const quizzes = {
  v1: {
    title: "Module 1 Quiz",
    questions: [
      {
        text: "What is the biggest crypto?",
        options: ["Bitcoin", "Etherum", "Dogecoin", "Hello"],
        correctIndex: 0,
        explanation: "Bitcoin"
      },
      {
        text: "Hello world?",
        options: ["B", "E", "D", "H"],
        correctIndex: 0,
        explanation: "Bitcoin"
      }
    ]
  },

  v2: {
    title: "Module 2 Quiz",
    questions: [
      {
        text: "What is the second biggest crypto?",
        options: ["Etherum", "Your monthly rent", "Cash in your savings account", "Your streaming subscriptions"],
        correctIndex: 0,
        explanation: "Ethereum is typically second in market cap."
      }
    ]
  },

  v3: {
    title: "Module 3 Quiz",
    questions: [
      {
        text: "Crypto to the?:",
        options: ["Moon", "A plan for how you’ll use your money", "Only for people who are broke", "A list of your debts"],
        correctIndex: 0,
        explanation: "To the moon 🚀"
      }
    ]
  },

  v4: {
    title: "Module 4 Quiz",
    questions: [
      {
        text: "What crypto is currently the most popular?",
        options: ["Bitcoin","DogeCoin","Ethereum","None of these"],
        correctIndex: 0,
        explanation: "Bitcoin is the market leader by cap."
      }
    ]
  },

  v5: {
    title: "Module 5 Quiz",
    questions: [
      {
        text: "What color is USD?",
        options: ["Red", "Blue", "Green", "Black"],
        correctIndex: 2,
        explanation: "USD bills are traditionally green."
      }
    ]
  },

  default: {
    title: "Personal Finance Checkpoint",
    questions: [
      {
        text: "Quick check: Why track your spending?",
        options: ["Shame yourself","To see where money is going","Buy more stuff","Avoid investing"],
        correctIndex: 1,
        explanation: "Tracking helps you improve decisions."
      }
    ]
  }
};


// -------------------------
// 2. UTILITIES
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

function getActiveModuleFallbackKey() {
  const moduleList = document.getElementById("moduleList");
  if (!moduleList) return null;

  const activeLi =
    moduleList.querySelector(".list-group-item.active") ||
    moduleList.querySelector(".list-group-item");

  if (!activeLi) return null;
  const keyFromData = activeLi.dataset?.quizKey;
  if (keyFromData) return keyFromData;

  return slugifyModuleText(activeLi.textContent);
}


// -------------------------
// 3. RENDER & QUIZ LOGIC
// -------------------------
function renderQuiz(quiz) {
  const qEl = document.getElementById("quizQuestion");
  const optEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const submitBtn = document.getElementById("submitQuizBtn");
  if (!qEl || !optEl || !feedbackEl || !submitBtn) return;

    // ✅ ADD THIS
  submitBtn.style.display = "inline-block";
  submitBtn.disabled = false;

  // scoring + index
  let currentIndex = 0;
  let score = 0;
  const total = quiz.questions.length;

  loadQuestion(currentIndex);

  function loadQuestion(i) {
    const q = quiz.questions[i];
    qEl.textContent = `${quiz.title}: ${i + 1}. ${q.text}`;

    optEl.innerHTML = q.options.map((opt, idx) => `
      <div class="form-check mb-1">
        <input class="form-check-input" type="radio" name="quizOption" id="opt${idx}" value="${idx}">
        <label class="form-check-label small" for="opt${idx}">${opt}</label>
      </div>
    `).join("");

    feedbackEl.innerHTML = "";
  }


  // submission & next question logic
  submitBtn.onclick = () => {
    const q = quiz.questions[currentIndex];
    const selected = document.querySelector("input[name='quizOption']:checked");

    if (!selected) {
      feedbackEl.innerHTML = `<span class="text-warning">❗ Please select an answer.</span>`;
      return;
    }

    const chosenIndex = Number(selected.value);
    const correct = chosenIndex === q.correctIndex;
    if (correct) score++;

    // show feedback
    feedbackEl.innerHTML = correct
      ? `<span class="text-success fw-bold">Correct ✔</span><br><small class="text-muted">${q.explanation}</small>`
      : `<span class="text-danger fw-bold">Incorrect ❌</span><br><small class="text-muted">${q.explanation}</small>`;

    // next or finish
    if (currentIndex < total - 1) {
      setTimeout(() => {
        currentIndex++;
        loadQuestion(currentIndex);
      }, 1500);
    } else {
      // final result screen
      const percentage = Math.round((score / total) * 100);
      const perfect = score === total;
      const passed = percentage >= 80;
      const emoji = perfect ? "🏆" : passed ? "😊" : "😢";
      const message = perfect
        ? "PERFECT SCORE! 🏆 You got every question correct!"
        : passed
        ? "Great job! You passed! 🎉"
        : "Keep studying and try again! 💪";

      setTimeout(() => {
        submitBtn.style.display = "none";

        qEl.textContent = `Quiz Complete!`;
        optEl.innerHTML = "";
        feedbackEl.innerHTML = `
          <div class="mt-3 p-3 border rounded bg-light text-center">
            <h5>Your Score: ${score}/${total} = ${percentage}% ${emoji}</h5>
            <p class="fw-bold ${passed ? "text-success" : "text-danger"}">${message}</p>
            <button id="retryQuiz" class="btn btn-primary btn-sm mt-3">🔁 Try Quiz Again</button>
          </div>
        `;

        const retryBtn = document.getElementById("retryQuiz");
        retryBtn.onclick = () => {
          score = 0;
          currentIndex = 0;
          submitBtn.style.display = "block";
          loadQuestion(currentIndex);
          feedbackEl.innerHTML = "";
        };
      }, 1500);
    }
  };
}


// -------------------------
// 4. WIRING / EVENT LISTENERS
// -------------------------
function renderQuizForKey(key) {
  const quiz = (key && quizzes[key]) ? quizzes[key] : quizzes.default;
  renderQuiz(quiz);
}

window.addEventListener("b4t:module-changed", (e) => {
  const detail = e.detail || {};
  const key = detail.videoId || null;
  const titleKey = detail.title ? slugifyModuleText(detail.title) : null;
  renderQuizForKey(key || titleKey || "default");
});

document.addEventListener("DOMContentLoaded", () => {
  renderQuizForKey(getActiveModuleFallbackKey() || "default");

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
