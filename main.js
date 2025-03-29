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

function subscribeButton() {
  let buttonPressed = document.getElementById("subscribeButton");

  if (buttonPressed == true) {
    console.log("This button has been clicked.");
  }
}

function visitPage() {
  window.location = "/pages/signUp.html";

  console.log("This is working");
}

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

// fetch("/api/register", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(formData),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log("Success:", data);
//     alert("Registration successful!");
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//     alert("There was an error with your registration.");
//   });
