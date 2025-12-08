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
    const navSubscribe   = $("navSubscribe");

    // Groups
    const showFree   = document.querySelectorAll(".show-when-free");
    const showLogged = document.querySelectorAll(".show-when-logged-in");
    const showPaid   = document.querySelectorAll(".show-when-paid");
    const hideLogged = document.querySelectorAll(".hide-when-logged-in");

    const isLoggedIn = !!user;
    const isPaid =
      !!(user &&
      (user.paidSubscription === true ||
       user.tier === "basic" ||
       user.tier === "premium"));

    ////////////////////////////////////////////////
    //               RESET ALL
    ////////////////////////////////////////////////
    showFree.forEach(el => el.classList.add("d-none"));
    showLogged.forEach(el => el.classList.add("d-none"));
    showPaid.forEach(el => el.classList.add("d-none"));
    hideLogged.forEach(el => el.classList.add("d-none"));

    ////////////////////////////////////////////////
    //               USER STATES
    ////////////////////////////////////////////////

    if (!isLoggedIn) {
      // Guest
      showFree.forEach(el => el.classList.remove("d-none"));
      hideLogged.forEach(el => el.classList.remove("d-none"));

      // Sign-in visible
      signInDropdown.classList.remove("d-none");
      signOutBtn.classList.add("d-none");
      if (welcomeUser) welcomeUser.textContent = "";

      if (navSubscribe) navSubscribe.classList.add("d-none");

    } else {
      // Logged in
      showLogged.forEach(el => el.classList.remove("d-none"));
      hideLogged.forEach(el => el.classList.add("d-none"));

      // Sign-in hidden, Sign-out visible
      signInDropdown.classList.add("d-none");
      signOutBtn.classList.remove("d-none");

      if (welcomeUser && user.username)
        welcomeUser.textContent = `Welcome, ${user.username}!`;

      if (isPaid) {
        // PAID USER
        showPaid.forEach(el => el.classList.remove("d-none"));
        showFree.forEach(el => el.classList.add("d-none"));
        if (navSubscribe) navSubscribe.classList.add("d-none");

      } else {
        // LOGGED IN BUT UNPAID
        showFree.forEach(el => el.classList.remove("d-none"));
        if (navSubscribe) navSubscribe.classList.remove("d-none");
      }
    }

    ////////////////////////////////////////////////
    //          SIGN-OUT HANDLER
    ////////////////////////////////////////////////
    if (signOutBtn) {
      signOutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.reload();
      };
    }
  }

  ////////////////////////////////////////////////
  //    RUN ON LOAD + EXPOSE TO WINDOW
  ////////////////////////////////////////////////
  document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    updateNavbarBasedOnUser(user);
  });

  window.updateNavbarBasedOnUser = updateNavbarBasedOnUser;

})();
