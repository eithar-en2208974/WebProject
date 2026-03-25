function protectPage() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "login.html";
  }
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function renderNavbar() {
  const navbarContainer = document.getElementById("navbarContainer");
  if (!navbarContainer) return;

  const currentUser = getCurrentUser();

  navbarContainer.innerHTML = `
  <nav class="navbar">
    <div class="nav-left">
      <a href="feed.html" class="brand-link">
        <div class="logo-icon"><span></span></div>
        <span>CIRQLE</span>
      </a>
    </div>

    <div class="nav-right">
      <a href="feed.html">Home</a>
      <a href="profile.html">Profile</a>
      <span class="nav-user">👤 ${currentUser ? currentUser.username : "Guest"}</span>
      ${currentUser ? '<button id="logoutBtn" class="logout-btn">Logout</button>' : '<a href="login.html">Login</a>'}
    </div>
  </nav>
`;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

protectPage();
renderNavbar();
