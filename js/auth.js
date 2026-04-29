const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

async function apiRequest(url, options = {}) {
  const apiUrl = url.startsWith("/api") && location.origin !== "http://localhost:3004"
    ? "http://localhost:3004" + url
    : url;
  const response = await fetch(apiUrl, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const { user } = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: document.getElementById("username").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value
        })
      });

      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Account created");
      window.location.href = location.origin === "http://localhost:3004" ? "/" : "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const { user } = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: document.getElementById("loginEmail").value,
          password: document.getElementById("loginPassword").value
        })
      });

      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = location.origin === "http://localhost:3004" ? "/" : "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}
