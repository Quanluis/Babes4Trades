// public/js/navbar.js
(function () {
  const $ = (id) => document.getElementById(id);
  const getUser = () => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  };

  function updateNavbarBasedOnUser(user) {
    const welcomeUser    = $("welcomeUser");
    const signOutBtn     = $("signOutBtn");
    const signInDropdown = $("signInDropdown");
    const navSubscribe   = $("navSubscribe"); // <- the Subscribe item

    // Class groups
    const showFree   = document.querySelectorAll(".show-when-free");
    const showLogged = document.querySelectorAll(".show-when-logged-in");
    const showPaid   = document.querySelectorAll(".show-when-paid");
    const hideLogged = document.querySelectorAll(".hide-when-logged-in");

    const isLoggedIn = !!user;
    const isPaid = !!(user && (user.paidSubscription === true || user.tier === "basic" || user.tier === "premium"));

    // Default: hide gated stuff
    showLogged.forEach(el => el.classList.add("d-none"));
    showPaid.forEach(el => el.classList.add("d-none"));

    if (!isLoggedIn) {
      // Guest
      hideLogged.forEach(el => el.classList.remove("d-none"));
      showFree.forEach(el => el.classList.remove("d-none"));
      if (navSubscribe) navSubscribe.classList.add("d-none"); // guests see Pricing via guest link, not this
    } else {
      // Logged in
      hideLogged.forEach(el => el.classList.add("d-none"));
      showLogged.forEach(el => el.classList.remove("d-none"));

      if (isPaid) {
        // Paid: show paid, hide free + hide Subscribe
        showPaid.forEach(el => el.classList.remove("d-none"));
        showFree.forEach(el => el.classList.add("d-none"));
        if (navSubscribe) navSubscribe.classList.add("d-none");
      } else {
        // Unpaid: show free, show Subscribe, hide paid
        showFree.forEach(el => el.classList.remove("d-none"));
        showPaid.forEach(el => el.classList.add("d-none"));
        if (navSubscribe) navSubscribe.classList.remove("d-none");
      }
    }

    // Greeting + buttons
    if (welcomeUser)    welcomeUser.textContent = user?.username ? `Welcome, ${user.username}!` : "";
    if (signOutBtn)     signOutBtn.classList.toggle("d-none", !isLoggedIn);
    if (signInDropdown) signInDropdown.classList.toggle("d-none",  isLoggedIn);

    // Sign out
    if (signOutBtn) {
      signOutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.reload();
      };
    }
  }

  // Run on load & expose globally for post-login refreshes
  const user = getUser();
  updateNavbarBasedOnUser(user);
  window.updateNavbarBasedOnUser = updateNavbarBasedOnUser;
})();
