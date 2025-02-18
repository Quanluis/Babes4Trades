const { Button } = require("bootstrap");




  // document.getElementById('containerPrice').style.display = "none";
  // document.getElementById('containerPrice2').style.display = "block";


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

  }




// function displayText(){

//     // displaymonthly.remove();

//     document.getElementById("yearlySub").innerHTML = 
 
//     <div class="container">
//     <div class="row">
//       <div class="col-md-6">
//         <div class="card-container pt-5">
//           <div class="card">
//             <div class="card-body">
//               <h5 class="card-title">Yearly Standard Subscription</h5>
//               <p class="card-text">This is the first centered card.</p>
//               <a href="#" class="btn btn-primary">Subscribe</a>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div class="col-md-6">
//         <div class="card-container pt-5">
//           <div class="card">
//             <div class="card-body">
//               <h5 class="card-title">Yearly Elite Subscription</h5>
//               <p class="card-text">This is the second centered card.</p>
//               <a href="#" class="btn btn-primary">Subscribe</a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//  ' </div> `

//  element.removeChild();

// }




