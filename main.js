// const { Button } = require("bootstrap");

  // document.getElementById('containerPrice').style.display = "none";
  // document.getElementById('containerPrice2').style.display = "block";

  // import { isEmail } from "validator";



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






// Email verfication 

function validateEmail(email){

  let re =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return re.test(email)

};

if (validateEmail("user@example.com")){
  console.log("Email is valid")
}
  else{
    console.log("Email is invalid.");
};


import { isEmail } from "validator";

const valid = require("validator");

const emailToValidate = "quanluis@protonmail.com";

console.log(isEmail(emailToValidate)
    ? "valid email address"
    : "Invalid email address");

  




