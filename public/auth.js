async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

function redirectIfLoggedIn() {
  const currentUser = localStorage.getItem("currentUser");

  if (
    currentUser &&
    (window.location.pathname.includes("index.html") ||
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("register.html"))
  ) {
    window.location.href = "feed.html";
  }
}

redirectIfLoggedIn();

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const message = document.getElementById("registerMessage");

    message.style.color = "red";

    if (!username || !email || !password || !confirmPassword) {
      message.textContent = "Please fill in all fields.";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      message.textContent = "Please enter a valid email.";
      return;
    }

    if (password.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      return;
    }

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      message.style.color = "green";
      message.textContent = "Registration successful! Redirecting to login...";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    message.style.color = "red";

    if (!email || !password) {
      message.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const { user } = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("currentUser", JSON.stringify(user));

      message.style.color = "green";
      message.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "feed.html";
      }, 700);
    } catch (error) {
      message.textContent = error.message;
    }
  });
}
