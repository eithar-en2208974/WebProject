async function apiRequest(url, options = {}) {
  try {
    const apiUrl = url.startsWith("/api") && location.origin !== "http://localhost:3004"
      ? "http://localhost:3004" + url
      : url;
    const response = await fetch(apiUrl, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `API request failed with status ${response.status}`);
    return data;
  } catch (error) {
    throw error;
  }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function requireCurrentUser() {
  const user = getCurrentUser();
  if (!user) window.location.href = "login.html";
  return user;
}
