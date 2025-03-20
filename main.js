// const { Button } = require("bootstrap");


  function swapDivsYearly() {
    let monthlyDiv = document.getElementById("containerPrice");  // Monthly Subscription
    let yearlyDiv = document.getElementById("containerPrice2");  // Yearly Subscription

    if (monthlyDiv && yearlyDiv) {
        monthlyDiv.style.display = "none"; // Hide Monthly
        yearlyDiv.style.display = "block"; // Show Yearly
    } else {
      console.error("Element not found!");
    }

};

  function swapDivsMonthly() {

    let monthlyDiv = document.getElementById("containerPrice");  // Monthly Subscription
    let yearlyDiv = document.getElementById("containerPrice2");  // Yearly Subscription

    if (monthlyDiv && yearlyDiv) {
      monthlyDiv.style.display = "block"; // Show Monthly
      yearlyDiv.style.display = "none"; // Hide Yearly
    } else {
    console.error("Element not found!");
    }

  };


  window.onscroll = function() {
    // Get the height of the document, viewport and current scroll position
    var docHeight = document.documentElement.scrollHeight;
    var windowHeight = window.innerHeight;
    var scrollTop = window.scrollY;

    // Show footer when at the bottom
    if (scrollTop + windowHeight >= docHeight - 100) { // 100px threshold
        document.getElementById("footer").classList.remove("d-none");
    } else {
        document.getElementById("footer").classList.add("d-none");
    }
};


function subscribeButton(){

  let buttonPressed = document.getElementById("subscribeButton");

  if(buttonPressed == true){
    console.log("This button has been clicked.")
  }

}

// // Password validator 

// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.getElementById("signupForm");
//   const passwordInput = document.getElementById("exampleInputPassword1");
//   const confirmPasswordInput = document.getElementById("exampleInputPassword2");
//   const passwordHelp = document.getElementById("passwordHelp");
//   const confirmPasswordHelp = document.getElementById("confirmPasswordHelp");

//   function validatePassword(password) {
//       const minLength = /.{12,}/;
//       const uppercase = /[A-Z]/;
//       const lowercase = /[a-z]/;
//       const number = /\d/;
//       const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

//       let errors = [];
//       if (!minLength.test(password)) errors.push("At least 12 characters");
//       if (!uppercase.test(password)) errors.push("At least one uppercase letter");
//       if (!lowercase.test(password)) errors.push("At least one lowercase letter");
//       if (!number.test(password)) errors.push("At least one number");
//       if (!specialChar.test(password)) errors.push("At least one special character");

//       return errors;
//   }

//   passwordInput.addEventListener("input", function () {
//       const errors = validatePassword(passwordInput.value);
//       if (errors.length > 0) {
//           passwordHelp.textContent = "Password must have: " + errors.join(", ");
//       } else {
//           passwordHelp.textContent = "";
//       }
//   });

//   confirmPasswordInput.addEventListener("input", function () {
//       if (confirmPasswordInput.value !== passwordInput.value) {
//           confirmPasswordHelp.textContent = "Passwords do not match.";
//       } else {
//           confirmPasswordHelp.textContent = "";
//       }
//   });

//   form.addEventListener("submit", function (event) {
//       const passwordErrors = validatePassword(passwordInput.value);
//       if (passwordErrors.length > 0) {
//           event.preventDefault();
//           passwordHelp.textContent = "Password must have: " + passwordErrors.join(", ");
//       }

//       if (confirmPasswordInput.value !== passwordInput.value) {
//           event.preventDefault();
//           confirmPasswordHelp.textContent = "Passwords do not match.";
//       }
//   });
// });

console.log("hello")

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const passwordInput = document.getElementById("exampleInputPassword1");
  const confirmPasswordInput = document.getElementById("exampleInputPassword2");
  const passwordHelp = document.getElementById("passwordHelp");
  const confirmPasswordHelp = document.getElementById("confirmPasswordHelp");

  const criteria = {
      minLength: /.{12,}/,
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /\d/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/
  };

  const validationMessages = {
      minLength: "At least 12 characters",
      uppercase: "At least one uppercase letter",
      lowercase: "At least one lowercase letter",
      number: "At least one number",
      specialChar: "At least one special character"
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

  form.addEventListener("submit", function (event) {
      if (!updatePasswordFeedback()) {
          event.preventDefault();
          alert("Please fix password errors before submitting.");
      }
      if (confirmPasswordInput.value !== passwordInput.value) {
          event.preventDefault();
          alert("Passwords do not match.");
      }
  });
});




// IF email verfication turns on the dynamic buttons on the pricing page cease to work.



// // Email verfication 

// function validateEmail(email){

//   let re =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   return re.test(email)

// };

// if (validateEmail("user@example.com")){
//   console.log("Email is valid")
// }
//   else{
//     console.log("Email is invalid.");
// };


// import { isEmail } from "validator";

// const valid = require("validator");

// const emailToValidate = "quanluis@protonmail.com";

// console.log(isEmail(emailToValidate)
//     ? "valid email address"
//     : "Invalid email address");

  




