function redirectIfLoggedIn() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser && window.location.pathname.includes("login.html")) {
    window.location.href = "feed.html";
  }
  if (currentUser && window.location.pathname.includes("register.html")) {
    window.location.href = "feed.html";
  }
}

redirectIfLoggedIn();
// Get users from localStorage or return empty array
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Register logic
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
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

    const users = getUsers();

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      message.textContent = "This email is already registered.";
      return;
    }

    const newUser = {
      id: Date.now(),
      username: username,
      email: email,
      password: password,
      bio: "",
      profilePicture: "https://via.placeholder.com/100",
      followers: [],
      following: [],
    };

    users.push(newUser);
    saveUsers(users);

    message.style.color = "green";
    message.textContent = "Registration successful! Redirecting to login...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
}

// Login logic
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    message.style.color = "red";

    if (!email || !password) {
      message.textContent = "Please fill in all fields.";
      return;
    }

    const users = getUsers();

    const foundUser = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (!foundUser) {
      message.textContent = "Invalid email or password.";
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    message.style.color = "green";
    message.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "feed.html";
    }, 1000);
  });
}
