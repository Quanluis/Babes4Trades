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

    // Greeting + buttons
    if (welcomeUser)    welcomeUser.textContent = user?.username ? `Welcome, ${user.username}!` : "";
    if (signOutBtn)     signOutBtn.classList.toggle("d-none", !user);
    if (signInDropdown) signInDropdown.classList.toggle("d-none", !!user);

    // Class-based visibility
    const showFree   = document.querySelectorAll(".show-when-free");
    const showLogged = document.querySelectorAll(".show-when-logged-in");
    const showPaid   = document.querySelectorAll(".show-when-paid");
    const hideLogged = document.querySelectorAll(".hide-when-logged-in");

    const isPaid = !!(user && (user.paidSubscription === true || user.tier === "basic" || user.tier === "premium"));

    if (user) {
      hideLogged.forEach(el => el.classList.add("d-none"));
      showLogged.forEach(el => el.classList.remove("d-none"));
      showFree.forEach(el => el.classList.remove("d-none"));
      if (isPaid) showPaid.forEach(el => el.classList.remove("d-none"));
      else        showPaid.forEach(el => el.classList.add("d-none"));
    } else {
      hideLogged.forEach(el => el.classList.remove("d-none"));
      showLogged.forEach(el => el.classList.add("d-none"));
      showPaid.forEach(el => el.classList.add("d-none"));
      showFree.forEach(el => el.classList.remove("d-none"));
    }

    if (signOutBtn) {
      signOutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.reload();
      };
    }
  }

  updateNavbarBasedOnUser(getUser());

  // Expose for other scripts that want to refresh navbar after an API call
  window.updateNavbarBasedOnUser = updateNavbarBasedOnUser;
})();


