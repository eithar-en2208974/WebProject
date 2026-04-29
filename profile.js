const profileInfo = {
  username: document.getElementById("ProfileUsername"),
  email: document.getElementById("ProfileEmail"),
  bio: document.getElementById("ProfileBio"),
  image: document.getElementById("profileImage"),
  followers: document.getElementById("followersCount"),
  following: document.getElementById("followingCount"),
};

const editProfileBtn = document.getElementById("editProfileBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editProfileForm = document.getElementById("editProfileForm");
const userPostsContainer = document.getElementById("userPostsContainer");

function apiBaseUrl() {
  return window.location.protocol === "file:" ? "http://localhost:3000" : "";
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function defaultAvatar() {
  return "https://i.pinimg.com/736x/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg";
}

async function loadProfile() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const [{ user }, { posts }] = await Promise.all([
    apiRequest(`/api/users/${currentUser.id}`),
    apiRequest(`/api/posts?authorId=${currentUser.id}&sortBy=createdAt&order=desc`),
  ]);

  setCurrentUser(user);
  renderProfile(user);
  renderUserPosts(posts);
}

function renderProfile(user) {
  profileInfo.username.textContent = user.username;
  profileInfo.email.textContent = user.email;
  profileInfo.bio.textContent = "No bio yet.";
  profileInfo.image.src = user.avatarUrl || defaultAvatar();
  profileInfo.followers.textContent = user._count?.followers || 0;
  profileInfo.following.textContent = user._count?.following || 0;
}

function openEditForm() {
  const currentUser = getCurrentUser();

  document.getElementById("editUsername").value = currentUser.username || "";
  document.getElementById("editBio").value = "";
  document.getElementById("editProfilePicture").value = currentUser.avatarUrl || "";
  document.getElementById("editProfileSection").classList.remove("hidden");
}

function closeEditForm() {
  document.getElementById("editProfileSection").classList.add("hidden");
  document.getElementById("profileMessage").textContent = "";
}

async function saveProfileChanges(e) {
  e.preventDefault();

  const currentUser = getCurrentUser();
  const username = document.getElementById("editUsername").value.trim();
  const avatarUrl = document.getElementById("editProfilePicture").value.trim();
  const message = document.getElementById("profileMessage");

  message.style.color = "red";

  if (!username) {
    message.textContent = "Username cannot be empty.";
    return;
  }

  try {
    const { user } = await apiRequest(`/api/users/${currentUser.id}`, {
      method: "PUT",
      body: JSON.stringify({
        username,
        email: currentUser.email,
        avatarUrl: avatarUrl || null,
      }),
    });

    setCurrentUser(user);
    message.style.color = "green";
    message.textContent = "Profile updated successfully.";
    await loadProfile();

    setTimeout(() => {
      closeEditForm();
    }, 800);
  } catch (error) {
    message.textContent = error.message;
  }
}

function renderUserPosts(posts) {
  if (!posts.length) {
    userPostsContainer.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  userPostsContainer.innerHTML = posts
    .map(
      (post) => `
        <article class="post-card">
          <div class="post-header">
            <div class="post-user-info">
              <div class="post-user-text">
                <div class="post-user">${post.author.username}</div>
                <div class="post-time">${new Date(post.createdAt).toLocaleString("en-GB")}</div>
              </div>
            </div>
          </div>
          <p class="post-text">${post.text}</p>
        </article>
      `,
    )
    .join("");
}

if (editProfileBtn) {
  editProfileBtn.addEventListener("click", openEditForm);
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", closeEditForm);
}

if (editProfileForm) {
  editProfileForm.addEventListener("submit", saveProfileChanges);
}

loadProfile().catch((error) => {
  document.querySelector(".profile-page").innerHTML = `<p>${error.message}</p>`;
});
