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

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

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
    const existingUsername = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );

    if (existingUsername) {
      message.textContent = "This username is already taken.";
      return;
    }

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
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
      profilePicture:
        "https://i.pinimg.com/736x/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg",
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
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password,
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
