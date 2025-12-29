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

// // --- replace your current loadGallery() with this version ---
// async function loadGallery() {
//   // accept either id
//   const root = document.getElementById("galleryGrid") || document.getElementById("gallery");
//   if (!root) return; // not on this page

//   // show a spinner while loading
//   root.innerHTML = `
//     <div class="d-flex justify-content-center py-5 w-100">
//       <div class="spinner-border" role="status" aria-label="Loading"></div>
//     </div>`;

//   const token = localStorage.getItem("token");

//   try {
//     // if your site is served from a different port than the API, use the full URL:
//     // const res = await fetch("http://localhost:5000/api/gallery", { ... });
//     const res = await fetch("/api/gallery", {
//       headers: token ? { Authorization: `Bearer ${token}` } : {}
//     });

//     if (!res.ok) throw new Error(`Gallery fetch failed: ${res.status}`);
//     const data = await res.json();

//     if (!data.items || data.items.length === 0) {
//       root.innerHTML = `
//         <div class="col-12">
//           <div class="alert alert-info text-center">No content yet. Check back soon!</div>
//         </div>`;
//       return;
//     }

//     root.innerHTML = "";
//     data.items.forEach(item => {
//       const card = document.createElement("div");
//       card.className = "col-12 col-sm-6 col-md-4 col-lg-3";
//       card.innerHTML = `
//         <div class="card h-100 shadow-sm">
//           <a href="${item.bunnyUrl}" class="glightbox" data-gallery="gallery-set" data-title="${item.title ?? ""}">
//             <img src="${item.thumbnailUrl || item.bunnyUrl}" class="card-img-top" alt="${item.title ?? ""}">
//           </a>
//           <div class="card-body">
//             <h6 class="card-title mb-1">${item.title ?? ""} ${item.isPremium ? "🔒" : ""}</h6>
//             ${item.tags?.length ? `<div class="small text-muted">${item.tags.join(" • ")}</div>` : ""}
//           </div>
//         </div>`;
//       root.appendChild(card);
//     });
//   } catch (err) {
//     console.error(err);
//     root.innerHTML = `
//       <div class="col-12">
//         <div class="alert alert-danger text-center">Could not load gallery. Please try again.</div>
//       </div>`;
//   }
// }


// --- replace your current loadGallery() with this version ---
// async function loadGallery2() {
//   // accept either id
//   const root = document.getElementById("galleryGrid2") || document.getElementById("galleries");
//   if (!root) return; // not on this page

//   // ✅ Tier gating
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const isPaid = user?.paidSubscription === true;
//   const isPremium = user?.tier === "premium";

//   // If you want to hard-redirect unpaid users:
//   if (!isPaid) {
//     window.location.replace("pricing.html");
//     return;
//   }

//   // If paid but not premium: show locked premium message
//   if (!isPremium) {
//     root.innerHTML = `
//       <div class="col-12">
//         <div class="p-4 text-center border rounded bg-light">
//           <h5 class="mb-2">🔒 Premium Gallery Locked</h5>
//           <p class="text-muted mb-3">Upgrade to Premium to unlock these photos.</p>
//           <a href="pricing.html" class="btn btn-primary btn-sm">Upgrade to Premium</a>
//         </div>
//       </div>`;
//     return;
//   }

//   // show a spinner while loading
//   root.innerHTML = `
//     <div class="d-flex justify-content-center py-5 w-100">
//       <div class="spinner-border" role="status" aria-label="Loading"></div>
//     </div>`;

//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch("/api/galleries", {
//       headers: token ? { Authorization: `Bearer ${token}` } : {}
//     });

//     if (!res.ok) throw new Error(`Gallery fetch failed: ${res.status}`);
//     const data = await res.json();

//     // ✅ Only premium items in this premium grid
//     const premiumItems = (data.items || []).filter(item => item.isPremium === true);

//     if (!premiumItems.length) {
//       root.innerHTML = `
//         <div class="col-12">
//           <div class="alert alert-info text-center">No premium content yet. Check back soon!</div>
//         </div>`;
//       return;
//     }

//     root.innerHTML = "";
//     premiumItems.forEach(item => {
//       const card = document.createElement("div");
//       card.className = "col-12 col-sm-6 col-md-4 col-lg-3";
//       card.innerHTML = `
//         <div class="card h-100 shadow-sm">
//           <a href="${item.bunnyUrl}" class="glightbox" data-gallery="premium-gallery" data-title="${item.title ?? ""}">
//             <img src="${item.thumbnailUrl || item.bunnyUrl}" class="card-img-top" alt="${item.title ?? ""}">
//           </a>
//           <div class="card-body">
//             <h6 class="card-title mb-1">${item.title ?? ""}</h6>
//             ${item.tags?.length ? `<div class="small text-muted">${item.tags.join(" • ")}</div>` : ""}
//           </div>
//         </div>`;
//       root.appendChild(card);
//     });

//   } catch (err) {
//     console.error(err);
//     root.innerHTML = `
//       <div class="col-12">
//         <div class="alert alert-danger text-center">Could not load gallery. Please try again.</div>
//       </div>`;
//   }
// }

// async function loadGalleriesForKaraPage() {
//   const basicRoot = document.getElementById("galleryGridBasic");
//   const premiumRoot = document.getElementById("galleryGridPremium");

//   // Only run on pages that have either container
//   if (!basicRoot && !premiumRoot) return;

//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const isPaid = user?.paidSubscription === true;
//   const isPremium = user?.tier === "premium";
//   const token = localStorage.getItem("token");

//   // If you want to hard redirect unpaid users from this page:
//   if (!isPaid) {
//     window.location.replace("pricing.html");
//     return;
//   }

//   // Spinners
//   if (basicRoot) {
//     basicRoot.innerHTML = `
//       <div class="d-flex justify-content-center py-5 w-100">
//         <div class="spinner-border" role="status" aria-label="Loading"></div>
//       </div>`;
//   }

//   if (premiumRoot) {
//     premiumRoot.innerHTML = `
//       <div class="d-flex justify-content-center py-5 w-100">
//         <div class="spinner-border" role="status" aria-label="Loading"></div>
//       </div>`;
//   }

//   try {
//     const res = await fetch("/api/galleries", {
//       headers: token ? { Authorization: `Bearer ${token}` } : {}
//     });

//     if (!res.ok) throw new Error(`Gallery fetch failed: ${res.status}`);
//     const data = await res.json();

//     const items = data.items || [];

//     // Basic items (anything not premium)
//     const basicItems = items.filter(item => !item.isPremium);

//     // Premium items (be tolerant if your DB uses true/"true"/1)
//     const premiumItems = items.filter(item => {
//       const v = item.isPremium;
//       return v === true || v === "true" || v === 1 || v === "1";
//     });

//     // Render BASIC
//     if (basicRoot) {
//       if (!basicItems.length) {
//         basicRoot.innerHTML = `
//           <div class="col-12">
//             <div class="alert alert-info text-center">No basic content yet. Check back soon!</div>
//           </div>`;
//       } else {
//         basicRoot.innerHTML = "";
//         basicItems.forEach(item => basicRoot.appendChild(makeGalleryCard(item, "basic-gallery")));
//       }
//     }

//     // Render PREMIUM
//     if (premiumRoot) {
//       // If not premium user: lock message
//       if (!isPremium) {
//         premiumRoot.innerHTML = `
//           <div class="col-12">
//             <div class="p-4 text-center border rounded bg-light">
//               <h5 class="mb-2">🔒 Premium Gallery Locked</h5>
//               <p class="text-muted mb-3">Upgrade to Premium to unlock these photos.</p>
//               <a href="pricing.html" class="btn btn-primary btn-sm">Upgrade to Premium</a>
//             </div>
//           </div>`;
//       } else {
//         // Premium user: show premium images (or "none yet")
//         if (!premiumItems.length) {
//           premiumRoot.innerHTML = `
//             <div class="col-12">
//               <div class="alert alert-info text-center">No premium content yet. Check back soon!</div>
//             </div>`;
//         } else {
//           premiumRoot.innerHTML = "";
//           premiumItems.forEach(item => premiumRoot.appendChild(makeGalleryCard(item, "premium-gallery")));
//         }
//       }
//     }

//   } catch (err) {
//     console.error(err);

//     if (basicRoot) {
//       basicRoot.innerHTML = `
//         <div class="col-12">
//           <div class="alert alert-danger text-center">Could not load basic gallery. Please try again.</div>
//         </div>`;
//     }

//     if (premiumRoot) {
//       premiumRoot.innerHTML = `
//         <div class="col-12">
//           <div class="alert alert-danger text-center">Could not load premium gallery. Please try again.</div>
//         </div>`;
//     }
//   }
// }


// // Helper: build one card
// function makeGalleryCard(item, galleryName) {
//   const card = document.createElement("div");
//   card.className = "col-12 col-sm-6 col-md-4 col-lg-3";
//   card.innerHTML = `
//     <div class="card h-100 shadow-sm">
//       <a href="${item.bunnyUrl}" class="glightbox" data-gallery="${galleryName}" data-title="${item.title ?? ""}">
//         <img src="${item.thumbnailUrl || item.bunnyUrl}" class="card-img-top" alt="${item.title ?? ""}">
//       </a>
//       <div class="card-body">
//         <h6 class="card-title mb-1">${item.title ?? ""}</h6>
//         ${item.tags?.length ? `<div class="small text-muted">${item.tags.join(" • ")}</div>` : ""}
//       </div>
//     </div>`;
//   return card;
// }




// document.addEventListener("DOMContentLoaded", async () => {
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const isPremium = user?.tier === "premium";
//   const isPaid = user?.paidSubscription === true;

//   const grid = document.getElementById("galleryGrid2");
//   if (!grid) return;

//   // If you want: hard redirect for unpaid
//   if (!isPaid) {
//     window.location.replace("pricing.html");
//     return;
//   }

//   // If not premium: show locked premium message instead of photos
//   if (!isPremium) {
//     grid.innerHTML = `
//       <div class="col-12">
//         <div class="p-4 text-center border rounded bg-light">
//           <h5 class="mb-2">🔒 Premium Gallery Locked</h5>
//           <p class="text-muted mb-3">Upgrade to Premium to unlock Kara’s premium photos.</p>
//           <a href="pricing.html" class="btn btn-primary btn-sm">Upgrade to Premium</a>
//         </div>
//       </div>
//     `;
//     return;
//   }

//   // Premium user: load premium photos
//   await loadPremiumGallery(grid);
// });

// document.addEventListener("DOMContentLoaded", () => {
//   if (document.querySelector("#galleryGridBasic, #galleryGridPremium")) {
//     loadGalleriesForKaraPage();
//   }
// });



// // --- add this once (near your other DOMContentLoaded handlers) ---
// document.addEventListener("DOMContentLoaded", () => {
//   // only run on pages that actually have the gallery container
//   if (document.getElementById("galleryGrid") || document.getElementById("gallery")) {
//     loadGallery();
//   }
// });

// // --- add this once (near your other DOMContentLoaded handlers) ---
// document.addEventListener("DOMContentLoaded", () => {
//   // only run on pages that actually have the gallery container
//   if (document.getElementById("galleryGrid2") || document.getElementById("galleries")) {
//     loadGallery2();
//   }
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   const hasGallery = document.querySelector("#galleryGrid2, #galleries");
//   if (hasGallery) await loadGallery2();
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   // only run on pages that actually have the gallery container
//   if (document.getElementById("galleryGrid2") || document.getElementById("galleries")) {
//     await loadGallery2();
//   }
// });



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
  if (document.querySelector(".glightbox")) {
    const lightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      zoomable: true,
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    document.getElementById(
      "welcomeUser"
    ).textContent = `Welcome, ${user.username}!`;
  }
});

// 🔥 Update "Courses" heading dynamically if the page has it
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return;

  const user = JSON.parse(savedUser);
  const courseHeading = document.getElementById("courseHeading");

  // Only change the title if the element exists (course.html)
  if (courseHeading && user.username) {
    courseHeading.textContent = `${user.username}'s Courses`;
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

    const discordInput = document.getElementById("InputDiscord").value.trim();

    const formData = {
      email: email.value,
      username: exampleInputUsername.value,
      password: confirmPasswordInput.value,
      discordId: discordInput || null, // Store null if left blank
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
  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const getUser = () => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  };

  function applyAuthUI(user) {
    const welcomeUser   = $("welcomeUser");
    const signOutBtn    = $("signOutBtn");
    const signInDropdown= $("signInDropdown");

    // Toggle welcome text + buttons
    if (welcomeUser)   welcomeUser.textContent = user?.username ? `Welcome, ${user.username}!` : "";
    if (signOutBtn)    signOutBtn.classList.toggle("d-none", !user);
    if (signInDropdown)signInDropdown.classList.toggle("d-none", !!user);

    // Class-based nav visibility (matches your HTML classes)
    const showFree    = document.querySelectorAll(".show-when-free");
    const showLogged  = document.querySelectorAll(".show-when-logged-in");
    const showPaid    = document.querySelectorAll(".show-when-paid");
    const hideLogged  = document.querySelectorAll(".hide-when-logged-in");

    const isPaid = !!(user && (user.paidSubscription === true || user.tier === "basic" || user.tier === "premium"));

    if (user) {
      hideLogged.forEach(el => el.classList.add("d-none"));
      showLogged.forEach(el => el.classList.remove("d-none"));
      showFree.forEach(el => el.classList.remove("d-none"));    // keep free visible if you prefer
      if (isPaid) showPaid.forEach(el => el.classList.remove("d-none"));
      else        showPaid.forEach(el => el.classList.add("d-none"));
    } else {
      hideLogged.forEach(el => el.classList.remove("d-none"));
      showLogged.forEach(el => el.classList.add("d-none"));
      showPaid.forEach(el => el.classList.add("d-none"));
      showFree.forEach(el => el.classList.remove("d-none"));
    }

    // Sign out handler (safe if missing)
    if (signOutBtn) {
      signOutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.reload();
      };
    }
  }

  // ---------- Initial UI from saved user ----------
  applyAuthUI(getUser());

  // ---------- Main page form sign-in (if present) ----------
  const form = $("signInForm");                          // your main sign-in form (if this page has it)
  const signInEmail = $("signinMainEmail");
  const signInPassword = $("current-password");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const signInData = {
        email:    signInEmail?.value || "",
        password: signInPassword?.value || "",
      };

      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signInData),
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          applyAuthUI(data.user);
          // Optional: redirect (works from /video.html since it's served at /video.html)
          window.location.href = "/";
        } else {
          alert("Error: " + (data?.error || "Login failed"));
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Email or password is incorrect. Please try again.");
      }
    });
  }

  // ---------- Navbar dropdown sign-in (if present) ----------
  const loginForm = $("dropDownSignInForm");             // your navbar dropdown form
  const ddEmail = $("signInDropDownEmail");
  const ddPass  = $("signInDropDownPassword");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = ddEmail?.value || "";
      const password = ddPass?.value || "";

      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          applyAuthUI(data.user);
          window.location.href = "/";
        } else {
          alert(data?.error || "Login failed");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong.");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const btn = document.getElementById("getStartedBtn");

  // Only run on pages that have the button
  if (!btn) return;

  // If logged in AND premium → hide button
  if (user && user.paidSubscription === true) {
    btn.style.display = "none";
  } else {
    // If guest OR not premium → show and send to signUp/pricing
    btn.style.display = "inline-block";

    btn.addEventListener("click", () => {
      if (!user) {
        window.location.href = "/signUp.html";
      } else {
        window.location.href = "/pricing.html";
      }
    });
  }
});


// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.getElementById("signInForm");
//   const signInEmail = document.getElementById("signinMainEmail");
//   const signInPassword = document.getElementById("current-password");

//   // 🟢 Show username if already logged in
//   const savedUser = localStorage.getItem("user");
//   if (savedUser) {
//     const user = JSON.parse(savedUser);
//     document.getElementById(
//       "welcomeUser"
//     ).textContent = `Welcome, ${user.username}!`;
//     signInDropdown.classList.add("d-none");
//     signOutBtn.classList.remove("d-none");
//   }

//   form.addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const signInData = {
//       email: signInEmail.value,
//       password: signInPassword.value,
//     };

//     try {
//       const sent = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(signInData),
//       });

//       const data = await sent.json();

//       if (sent.ok) {
//         alert("Data Checked successfully");

//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         // ✅ Update welcome message
//         document.getElementById(
//           "welcomeUser"
//         ).textContent = `Welcome, ${data.user.username}!`;

//         // Optional redirect
//         window.location.href = "index.html";
//       } else {
//         alert("Error: " + data.error);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Email or password is incorrect. Please try again.");
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const loginForm = document.getElementById("dropDownSignInForm");

//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = document.getElementById("signInDropDownEmail").value;
//     const password = document.getElementById("signInDropDownPassword").value;

//     try {
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         document.getElementById(
//           "welcomeUser"
//         ).textContent = `Welcome, ${data.user.username}!`;
//         document.getElementById("signOutBtn").classList.remove("d-none");
//         document.getElementById("babesGallary").classList.remove("d-none");
//         document.getElementById("signInDropdown").classList.add("d-none");

//         // Redirect to homepage or reload if needed
//         window.location.href = "index.html";
//       } else {
//         alert(data.error);
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Something went wrong.");
//     }
//   });
// });

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

      window.location.href = "/";
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

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  try {
    const response = await fetch(`/api/user/${encodeURIComponent(user.email)}`);
    const freshUser = await response.json();

    if (response.ok && !freshUser.error) {
      // Update localStorage with the fresh user (should now have paidSubscription: true)
      localStorage.setItem("user", JSON.stringify(freshUser));

      // Optionally update the navbar or redirect if needed
      if (typeof updateNavbarBasedOnUser === "function") {
        updateNavbarBasedOnUser(freshUser);
      }

      console.log("✅ User updated after payment:", freshUser);
    } else {
      console.warn("⚠️ Could not fetch fresh user info:", freshUser.error);
    }
  } catch (err) {
    console.error("❌ Error fetching updated user after payment:", err);
  }
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

document.addEventListener("DOMContentLoaded", () => {
  const unsubscribeBtn = document.getElementById("unsubscribeBtn");

  if (unsubscribeBtn) {
    unsubscribeBtn.addEventListener("click", async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        return alert("You must be logged in to unsubscribe.");
      }

      const confirmUnsub = confirm(
        "Are you sure you want to cancel your subscription? This will remove access to premium features."
      );

      if (!confirmUnsub) return;

      try {
        // ✅ Call the new cancel-subscription endpoint
        const response = await fetch("/api/cancel-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email }),
        });

        const result = await response.json();
        alert(result.message || "Subscription canceled.");

        if (response.ok) {
          // ✅ Clear localStorage and redirect to home
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      } catch (error) {
        console.error("❌ Unsubscribe error:", error);
        alert("Something went wrong while unsubscribing.");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Save Discord handler
  const discordForm = document.getElementById("updateDiscordForm");

  if (discordForm) {
    discordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const discordId = document.getElementById("discordId").value.trim();
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.email) {
        alert("You must be logged in to update Discord.");
        return;
      }

      try {
        const response = await fetch("/api/user/discord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, discordId }),
        });

        const result = await response.json();
        const feedback = document.getElementById("discordUpdateFeedback");

        if (result.message) {
          feedback.style.display = "block";
          feedback.classList.remove("text-danger");
          feedback.classList.add("text-success");
          feedback.textContent = result.message;

          // Optional: refresh localStorage
          user.discordId = discordId;
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          feedback.style.display = "block";
          feedback.classList.remove("text-success");
          feedback.classList.add("text-danger");
          feedback.textContent = result.error || "An error occurred.";
        }
      } catch (error) {
        console.error("❌ Error updating Discord ID:", error);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const deleteAccountForm = document.getElementById("deleteAccountForm");

  deleteAccountForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("deleteAccountEmail").value;
    const password = document.getElementById("deleteAccountPassword").value;

    // ✅ Confirmation popup
    const confirmed = confirm(
      "Are you sure you want to delete your account? Your subscription will be cancelled along with your account deleted. This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Your account has been deleted.");

        // ✅ Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.href = "/"; // Redirect to homepage
      } else {
        alert(result.error || "Failed to delete account");
      }
    } catch (err) {
      console.error("Error", err);
      alert("An error occurred. Please try again.");
    }
  });
});

// document.addEventListener("DOMContentLoaded", async () => {
//   const storedUser = localStorage.getItem("user");

//   if (!storedUser) {
//     document.getElementById("userProfile").innerHTML =
//       "<p class='text-center'>Please log in to view your profile.</p>";
//     return;
//   }

//   const user = JSON.parse(storedUser);

//   try {
//     const response = await fetch(`/api/user/${encodeURIComponent(user.email)}`);
//     const data = await response.json();

//     if (data.error) {
//       return console.error("User fetch error:", data.error);
//     }

//     document.getElementById(
//       "profileUsername"
//     ).textContent = `Username: ${data.username}`;
//     document.getElementById(
//       "profileEmail"
//     ).textContent = `Email: ${data.email}`;

//     const statusEl = document.getElementById("profileStatus");
//     statusEl.textContent = data.paidSubscription
//       ? "Paid Subscriber"
//       : "Free Account";
//     statusEl.className = `badge fs-6 px-3 py-2 mt-2 ${
//       data.paidSubscription
//         ? "bg-success text-white"
//         : "bg-secondary text-white"
//     }`;

//     // ✅ Autofill Discord input if available
//     if (data.discordId) {
//       document.getElementById("discordId").value = data.discordId;
//     }
//   } catch (err) {
//     console.error("Failed to load user profile:", err);
//   }
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   const storedUser = localStorage.getItem("user");

//   if (!storedUser) {
//     document.getElementById("userProfile").innerHTML =
//       "<p class='text-center'>Please log in to view your profile.</p>";
//     return;
//   }

//   const user = JSON.parse(storedUser);

//   try {
//     const response = await fetch(`/api/user/${encodeURIComponent(user.email)}`);
//     const data = await response.json();

//     if (data.error) {
//       return console.error("User fetch error:", data.error);
//     }

//     document.getElementById("profileUsername").textContent = `Username: ${data.username}`;
//     document.getElementById("profileEmail").textContent = `Email: ${data.email}`;

//     // ✅ Tier-aware status badge (B4T CSS classes)
//     const statusEl = document.getElementById("profileStatus");
//     if (statusEl) {
//       const tier = String(data.tier || "").trim().toLowerCase();
//       const isPaid = data.paidSubscription === true;

//       let label = "Free Account";
//       let cls = "badge-b4t badge-b4t-free";

//       if (tier === "premium") {
//         label = "Tier: Premium";
//         cls = "badge-b4t badge-b4t-premium";
//       } else if (tier === "basic") {
//         label = "Tier: Basic";
//         cls = "badge-b4t badge-b4t-basic";
//       } else if (isPaid) {
//         // fallback if tier missing but paid is true
//         label = "Paid Subscriber";
//         cls = "badge-b4t badge-b4t-purple";
//       }

//       statusEl.textContent = label;
//       statusEl.className = cls;
//     }

//     // ✅ Autofill Discord input if available
//     if (data.discordId) {
//       const discordInput = document.getElementById("discordId");
//       if (discordInput) discordInput.value = data.discordId;
//     }
//   } catch (err) {
//     console.error("Failed to load user profile:", err);
//   }
// });


function updateNavbarBasedOnUser(user) {
  const guestOnly = document.querySelectorAll(".hide-when-logged-in");
  const loggedInOnly = document.querySelectorAll(".show-when-logged-in");
  const paidOnly = document.querySelectorAll(".show-when-paid");
  const freeOnly = document.querySelectorAll(".show-when-free");

  if (user) {
    guestOnly.forEach((el) => el.classList.add("d-none"));
    loggedInOnly.forEach((el) => el.classList.remove("d-none"));

    if (user.paidSubscription) {
      paidOnly.forEach((el) => el.classList.remove("d-none"));
      freeOnly.forEach((el) => el.classList.add("d-none"));
    } else {
      paidOnly.forEach((el) => el.classList.add("d-none"));
      freeOnly.forEach((el) => el.classList.remove("d-none"));
    }
  } else {
    guestOnly.forEach((el) => el.classList.remove("d-none"));
    loggedInOnly.forEach((el) => el.classList.add("d-none"));
    paidOnly.forEach((el) => el.classList.add("d-none"));
    freeOnly.forEach((el) => el.classList.remove("d-none")); // Guests count as free users
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  updateNavbarBasedOnUser(user);
});


document.addEventListener("DOMContentLoaded", () => {
  const viewCourseButtons = document.querySelectorAll(".view-course-btn");

  viewCourseButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // 🧾 Get auth data from localStorage (adjust keys if yours are different)
      const token = localStorage.getItem("token");
      let user = null;

      try {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
          user = JSON.parse(userRaw);
        }
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }

      // 1) Not logged in → go to sign-up
      if (!token || !user) {
        window.location.href = "/signUp.html";
        return;
      }

      // 2) Logged in but NOT paid → go to pricing / subscribe
      //    (adjust 'paidSubscription' if your property name is different)
      if (!user.paidSubscription) {
        window.location.href = "/pricing.html";
        return;
      }

      // 3) Logged in AND paid → send to course page
      const courseSlug = btn.dataset.course; // e.g. "finance-101"
      window.location.href = `/Courses/${courseSlug}.html`;
    });
  });
});

