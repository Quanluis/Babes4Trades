// -------------------------
// 1. QUIZ QUESTION DATA
// -------------------------
const quizzes = {
  default: {
    title: "Personal Finance Checkpoint",
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
      },
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
      },
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
  }
};

// -------------------------
// 2. RENDER QUIZ INTO SIDEBAR
// -------------------------
function renderQuiz(quiz) {
  const qEl = document.getElementById("quizQuestion");
  const optEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");

  if (!qEl || !optEl) return;

  // Load the first question by default for now
  let currentIndex = 0;
  loadQuestion(currentIndex);

  function loadQuestion(i) {
    const q = quiz.questions[i];

    qEl.textContent = (i + 1) + ". " + q.text;

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
  const submitBtn = document.getElementById("submitQuizBtn");
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

// -------------------------
// 3. LOAD DEFAULT QUIZ ON PAGE LOAD
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  const quiz = quizzes.default;
  renderQuiz(quiz);
});
