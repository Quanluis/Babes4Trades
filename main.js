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

//The SignIn formData content below needs to be linked to the Server.js file.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signInForm");
  const signInEmail = document.getElementById("signinMainEmail");
  const signInPassword = document.getElementById("current-password");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const signInData = {
      email: signInEmail.value,
      password: signInPassword.value,
    };

    //Send login data to backend

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
        form.reset(); // Reset form fields
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Email or password is incorrect. Please try again.");
    }
  });
});

//The SignIn formData content below needs to be linked to the Server.js file.

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById("dropDownSignInForm");
  const signInDropDownEmail= document.getElementById("signInDropDownEmail");
  const signInDropDownPassword = document.getElementById("signInDropDownPassword");

  form.addEventListener("submit", async function (event){

    event.preventDefault();

    const dropDownSignInData = {
      email: signInDropDownEmail.value,
      password: signInDropDownPassword.value,
    };

    // Sends dropDownSignInData to backend 
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
        alert("Data Checked successfully");
        form.reset(); // Reset form fields
        
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Email or password is incorrect. Please try again.");
    }

  });

})


// Logic for resetting the password

document.addEventListener('DOMContentLoaded', function () {

  const formForForgottenPass = document.getElementById("formForForgottenPass");
  const emailForReset =  document.getElementById("emailForForgottenPass");

  formForForgottenPass.addEventListener("submit", async function (event){

    event.preventDefault();

    const forgotPassData = {
      email: emailForReset.value,
    };

    try {

      const sent = await fetch("http://localhost:5000/api/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotPassData),
      });

      const data = await sent.json();

      if (sent.ok) {
        alert("Data Checked successfully");
        form.reset(); // Reset form fields
        
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Email or password is incorrect. Please try again. BRO");
    }

  })
  
})


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetPasswordForm');
  const newPassword = document.getElementById('newPassword');
  const repeatPassword = document.getElementById('repeatPassword');
  const statusMsg = document.getElementById('resetStatus');

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  // const token = decodeURIComponent(queryParams.get('token'));

  if (!token) {
    statusMsg.textContent = 'Invalid or missing reset token.';
    form.style.display = 'none';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    if (newPassword.value !== repeatPassword.value) {
      statusMsg.textContent = 'Passwords do not match.';
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword.value
        })
      });

      const data = await response.json();

      if (response.ok) {
        statusMsg.textContent = '✅ Password successfully reset. You can now sign in.';
        form.reset();
        form.style.display = 'none';
      } else {
        statusMsg.textContent = `❌ ${data.error || 'Reset failed. Please try again.'}`;
      }
    } catch (err) {
      statusMsg.textContent = '❌ An error occurred. Please try again later.';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("contactForm");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 💡 Fetch values *when form is submitted*
    const email = document.getElementById("contactUsEmail").value;
    const subject = document.getElementById("contactUsSubject").value;
    const text = document.getElementById("contactUsText").value;

    console.log("Contact Form Submission", { email, subject, text });

    try {
      const send = await fetch("http://localhost:5000/api/contact-us", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          subject,
          text
        }),  
      });

      const dataSent = await send.json();

      if(send.ok) {
        alert('✅ Message sent!');
        form.reset();
      } else {
        alert("❌ Error: " + dataSent.error);
      }
    } catch(error) {
      console.error("Error:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  });
});