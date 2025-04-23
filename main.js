// This JavaScript file is for maniulating The Dom elements within the Babes4Trades website

// These functions below enable the switch between price tiers
// The code link can be found between these functions and the Pricing.html page

function swapDivsYearly() {
  let monthlyDiv = document.getElementById("containerPrice"); // Monthly Subscription
  let yearlyDiv = document.getElementById("containerPrice2"); // Yearly Subscription

  if (monthlyDiv && yearlyDiv) {
    monthlyDiv.style.display = "none"; // Hide Monthly
    yearlyDiv.style.display = "block"; // Show Yearly
  } else {
    console.error("Element not found!");
  }
}

function swapDivsMonthly() {
  let monthlyDiv = document.getElementById("containerPrice"); // Monthly Subscription
  let yearlyDiv = document.getElementById("containerPrice2"); // Yearly Subscription

  if (monthlyDiv && yearlyDiv) {
    monthlyDiv.style.display = "block"; // Show Monthly
    yearlyDiv.style.display = "none"; // Hide Yearly
  } else {
    console.error("Element not found!");
  }
}

// Enables persistency within the page elements when scrolling

window.onscroll = function () {
  // Get the height of the document, viewport and current scroll position
  var docHeight = document.documentElement.scrollHeight;
  var windowHeight = window.innerHeight;
  var scrollTop = window.scrollY;

  // Show footer when at the bottom
  if (scrollTop + windowHeight >= docHeight - 100) {
    // 100px threshold
    document.getElementById("footer").classList.remove("d-none");
  } else {
    document.getElementById("footer").classList.add("d-none");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    document.getElementById(
      "welcomeUser"
    ).textContent = `Welcome, ${user.username}!`;
  }
});

// The formData from the SignUp content page below needs to be linked to the Server.js file.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const email = document.getElementById("exampleInputEmail");
  const passwordInput = document.getElementById("exampleInputPassword1");
  const confirmPasswordInput = document.getElementById("exampleInputPassword2");
  const exampleInputUsername = document.getElementById("exampleInputUsername");
  const passwordHelp = document.getElementById("passwordHelp");
  const confirmPasswordHelp = document.getElementById("confirmPasswordHelp");

  const criteria = {
    minLength: /.{12,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const validationMessages = {
    minLength: "At least 12 characters",
    uppercase: "At least one uppercase letter",
    lowercase: "At least one lowercase letter",
    number: "At least one number",
    specialChar: "At least one special character",
  };

  function validatePassword(password) {
    let results = {};
    for (const [key, regex] of Object.entries(criteria)) {
      results[key] = regex.test(password);
    }
    return results;
  }

  function updatePasswordFeedback() {
    const validation = validatePassword(passwordInput.value);
    passwordHelp.innerHTML = ""; // Clear previous messages

    let allValid = true;
    for (const [key, valid] of Object.entries(validation)) {
      const message = validationMessages[key];
      const icon = valid ? "✅" : "❌";
      passwordHelp.innerHTML += `<div>${icon} ${message}</div>`;
      if (!valid) allValid = false;
    }
    return allValid;
  }

  function checkPasswordMatch() {
    if (confirmPasswordInput.value === passwordInput.value) {
      confirmPasswordHelp.innerHTML = "✅ Passwords match";
      confirmPasswordHelp.style.color = "green";
    } else {
      confirmPasswordHelp.innerHTML = "❌ Passwords do not match";
      confirmPasswordHelp.style.color = "red";
    }
  }

  passwordInput.addEventListener("input", updatePasswordFeedback);
  confirmPasswordInput.addEventListener("input", checkPasswordMatch);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!updatePasswordFeedback()) {
      event.preventDefault();
      alert("Please fix password errors before submitting.");
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
      event.preventDefault();
      alert("Passwords do not match.");
    }

    const formData = {
      email: email.value,
      username: exampleInputUsername.value,
      password: confirmPasswordInput.value,
    };

    console.log("Form Data:", formData); // Debugging (Remove in production)

    try {
      // Send data to backend
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        form.reset(); // Reset form fields
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signInForm");
  const signInEmail = document.getElementById("signinMainEmail");
  const signInPassword = document.getElementById("current-password");

  // 🟢 Show username if already logged in
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    document.getElementById(
      "welcomeUser"
    ).textContent = `Welcome, ${user.username}!`;
    signInDropdown.classList.add("d-none");
    signOutBtn.classList.remove("d-none");
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const signInData = {
      email: signInEmail.value,
      password: signInPassword.value,
    };

    try {
      const sent = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
      });

      const data = await sent.json();

      if (sent.ok) {
        alert("Data Checked successfully");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Update welcome message
        document.getElementById(
          "welcomeUser"
        ).textContent = `Welcome, ${data.user.username}!`;

        // Optional redirect
        window.location.href = "index.html";
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Email or password is incorrect. Please try again.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("dropDownSignInForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signInDropDownEmail").value;
    const password = document.getElementById("signInDropDownPassword").value;

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        document.getElementById(
          "welcomeUser"
        ).textContent = `Welcome, ${data.user.username}!`;
        document.getElementById("signOutBtn").classList.remove("d-none");
        document.getElementById("babesGallary").classList.remove("d-none");
        document.getElementById("signInDropdown").classList.add("d-none");

        // Redirect to homepage or reload if needed
        window.location.href = "index.html";
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const signOutBtn = document.getElementById("signOutBtn");
  const welcomeUser = document.getElementById("welcomeUser");
  const signInDropdown = document.getElementById("signInDropdown");
  const loginForm = document.getElementById("dropDownSignInForm");
  const signInDropDownEmail = document.getElementById("signInDropDownEmail");
  const signInDropDownPassword = document.getElementById(
    "signInDropDownPassword"
  );

  // ✅ Define once: show/hide links
  function toggleAuthLinks(isLoggedIn) {
    const toHide = document.querySelectorAll(".hide-when-logged-in");
    const toShow = document.querySelectorAll(".show-when-logged-in");

    toHide.forEach((el) => el.classList.toggle("d-none", isLoggedIn));
    toShow.forEach((el) => el.classList.toggle("d-none", !isLoggedIn));
  }

  // ✅ Check for existing user on page load
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    welcomeUser.textContent = `Welcome, ${user.username}!`;
    signInDropdown.classList.add("d-none");
    signOutBtn.classList.remove("d-none");
    toggleAuthLinks(true); // user is logged in
  } else {
    toggleAuthLinks(false); // user is NOT logged in
  }

  // ✅ Handle Sign In Form Submit
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const dropDownSignInData = {
        email: signInDropDownEmail.value,
        password: signInDropDownPassword.value,
      };

      try {
        const sent = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dropDownSignInData),
        });

        const data = await sent.json();

        if (sent.ok) {
          // ✅ Store user and update UI
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          welcomeUser.textContent = `Welcome, ${data.user.username}!`;
          signInDropdown.classList.add("d-none");
          signOutBtn.classList.remove("d-none");
          toggleAuthLinks(true);

          form.reset(); // Reset form fields
          window.location.href = "/pricing.html";
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Email or password is incorrect. Please try again.");
      }
    });
  }

  // ✅ Handle Sign Out
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      welcomeUser.textContent = "";
      signOutBtn.classList.add("d-none");
      signInDropdown.classList.remove("d-none");
      toggleAuthLinks(false);

      window.location.href = "index.html";
    });
  }
});

document.querySelectorAll(".subscribe-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const priceId = btn.dataset.price;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return (window.location.href = "/signUp.html");
    }

    try {
      const response = await fetch("/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, priceId }),
      });

      const sessionUrl = await response.text();

      if (sessionUrl.startsWith("http")) {
        window.location.href = sessionUrl; // ✅ Redirect to Stripe Checkout
      } else {
        console.error("Unexpected response:", sessionUrl);
        alert("Checkout could not be started.");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Something went wrong.");
    }
  });
});

// Logic for resetting the password

document.addEventListener("DOMContentLoaded", function () {
  const formForForgottenPass = document.getElementById("formForForgottenPass");
  const emailForReset = document.getElementById("emailForForgottenPass");

  formForForgottenPass.addEventListener("submit", async function (event) {
    event.preventDefault();

    const forgotPassData = {
      email: emailForReset.value,
    };

    try {
      const sent = await fetch(
        "http://localhost:5000/api/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(forgotPassData),
        }
      );

      const data = await sent.json();

      if (sent.ok) {
        alert("If you have an account with us please check your email.");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    form.reset(); // Reset form fields
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetPasswordForm");
  const newPassword = document.getElementById("newPassword");
  const repeatPassword = document.getElementById("repeatPassword");
  const statusMsg = document.getElementById("resetStatus");

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  // const token = decodeURIComponent(queryParams.get('token'));

  if (!token) {
    statusMsg.textContent = "Invalid or missing reset token.";
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validation
    if (newPassword.value !== repeatPassword.value) {
      statusMsg.textContent = "Passwords do not match.";
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        statusMsg.textContent =
          "✅ Password successfully reset. You can now sign in.";
        form.reset();
        form.style.display = "none";
      } else {
        statusMsg.textContent = `❌ ${
          data.error || "Reset failed. Please try again."
        }`;
      }
    } catch (err) {
      statusMsg.textContent = "❌ An error occurred. Please try again later.";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 💡 Fetch values *when form is submitted*
    const email = document.getElementById("contactUsEmail").value;
    const subject = document.getElementById("contactUsSubject").value;
    const text = document.getElementById("contactUsText").value;

    console.log("Contact Form Submission", { email, subject, text });

    try {
      const send = await fetch("http://localhost:5000/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subject,
          text,
        }),
      });

      const dataSent = await send.json();

      if (send.ok) {
        alert("✅ Message sent!");
        form.reset();
      } else {
        alert("❌ Error: " + dataSent.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const tier = localStorage.getItem("subscriptionTier");

  document.getElementById("thanksMessage").textContent = user?.username
    ? `Thank you, ${user.username}, for subscribing!`
    : `Thank you for your subscription!`;

  if (tier) {
    document.getElementById(
      "tierMessage"
    ).textContent = `You've subscribed to the ${tier} plan.`;
  }

  // Confetti 🎉
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    radius: Math.random() * 6 + 4,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    speed: Math.random() * 3 + 2,
    angle: Math.random() * 2 * Math.PI,
    spin: Math.random() * 0.2 - 0.1,
  }));

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.y += p.speed;
      p.x += Math.sin(p.angle) * 1.5;
      p.angle += p.spin;

      if (p.y > canvas.height) {
        p.y = 0;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(drawConfetti);
  }

  drawConfetti();
});

document.addEventListener("DOMContentLoaded", function () {

  const deleteAccountForm = document.getElementById("deleteAccountForm");

  deleteAccountForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("deleteAccountEmail").value;
    const password = document.getElementById("deleteAccountPassword").value;

     // ✅ Confirmation popup
     const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
     if (!confirmed) return;
  
    try {
      const response = await fetch("/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

    if (response.ok){

      alert("Your account has been deleted.");

      // ✅ Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    
      window.location.href = "/index.html" // Redirect to homepage
    
    }else {
      alert(result.error || "Failed to delete account");
    }
  } catch (err){
    console.error("Error", err);
    alert("An error occurred. Please try again.")
  }
});
});
