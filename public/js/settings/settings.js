document.addEventListener("DOMContentLoaded", async () => {
  const profileWrap = document.getElementById("userProfile");
  const usernameEl = document.getElementById("profileUsername");
  const emailEl = document.getElementById("profileEmail");
  const statusEl = document.getElementById("profileStatus");
  const discordInput = document.getElementById("discordId");

  // Only run on settings page
  if (!profileWrap || !statusEl) return;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    profileWrap.innerHTML = "<p class='text-center'>Please log in to view your profile.</p>";
    return;
  }

  const user = JSON.parse(storedUser);

  try {
    const response = await fetch(`/api/user/${encodeURIComponent(user.email)}`);
    const data = await response.json();

    if (data.error) {
      console.error("User fetch error:", data.error);
      return;
    }

    if (usernameEl) usernameEl.textContent = `Username: ${data.username}`;
    if (emailEl) emailEl.textContent = `Email: ${data.email}`;

    // ✅ Tier-aware status badge (B4T CSS)
    const tier = String(data.tier || "").trim().toLowerCase();
    const isPaid = data.paidSubscription === true;

    let label = "Free Account";
    let cls = "badge-b4t badge-b4t-free";

    if (tier === "premium") {
      label = "Tier: Premium";
      cls = "badge-b4t badge-b4t-premium";
    } else if (tier === "basic") {
      label = "Tier: Basic";
      cls = "badge-b4t badge-b4t-basic";
    } else if (isPaid) {
      label = "Paid Subscriber";
      cls = "badge-b4t badge-b4t-purple";
    }

    statusEl.textContent = label;
    statusEl.className = cls;

    // ✅ Discord autofill
    if (discordInput) discordInput.value = data.discordId || "";

  } catch (err) {
    console.error("Failed to load user profile:", err);
  }
});
