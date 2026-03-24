function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}
function updateFollowCounts() {
  const currentUser = getCurrentUser();

  document.getElementById("followersCount").textContent = currentUser.followers
    ? currentUser.followers.length
    : 0;

  document.getElementById("followingCount").textContent = currentUser.following
    ? currentUser.following.length
    : 0;
}

function renderProfile() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("ProfileUsername").textContent = currentUser.username;
  document.getElementById("ProfileEmail").textContent = currentUser.email;
  document.getElementById("ProfileBio").textContent =
    currentUser.bio && currentUser.bio.trim() !== ""
      ? currentUser.bio
      : "No bio yet.";
  document.getElementById("profileImage").src =
    currentUser.profilePicture ||
    "https://i.pinimg.com/736x/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg";

  updateFollowCounts();
}

function openEditForm() {
  const currentUser = getCurrentUser();

  document.getElementById("editUsername").value = currentUser.username || "";
  document.getElementById("editBio").value = currentUser.bio || "";
  document.getElementById("editProfilePicture").value =
    currentUser.profilePicture || "";
  document.getElementById("editProfileSection").classList.remove("hidden");
}

function closeEditForm() {
  document.getElementById("editProfileSection").classList.add("hidden");
  document.getElementById("profileMessage").textContent = "";
}

function saveProfileChanges(e) {
  e.preventDefault();

  const currentUser = getCurrentUser();
  const users = getUsers();
  const newUsername = document.getElementById("editUsername").value.trim();
  const newBio = document.getElementById("editBio").value.trim();
  const newProfilePicture = document
    .getElementById("editProfilePicture")
    .value.trim();
  const message = document.getElementById("profileMessage");

  message.style.color = "red";

  if (!newUsername) {
    message.textContent = "Username cannot be empty.";
    return;
  }

  const usernameExists = users.find(
    (user) => user.username === newUsername && user.id !== currentUser.id,
  );
  if (usernameExists) {
    message.textContent = "This username is already taken.";
    return;
  }

  const updatedUsers = users.map((user) => {
    if (user.id === currentUser.id) {
      return {
        ...user,
        username: newUsername,
        bio: newBio,
        profilePicture:
          newProfilePicture ||
          "https://i.pinimg.com/736x/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg",
      };
    }
    return user;
  });

  const updatedCurrentUser = updatedUsers.find(
    (user) => user.id === currentUser.id,
  );
  localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
  saveUsers(updatedUsers);
  updateFollowCounts();

  message.style.color = "green";
  message.textContent = "Profile updated successfully.";

  renderProfile();
  renderUserPosts();
  setTimeout(() => {
    closeEditForm();
  }, 1000);
}

function renderUserPosts() {
  const currentUser = getCurrentUser();
  const posts = getPosts();
  const userPostsContainer = document.getElementById("userPostsContainer");

  if (!userPostsContainer) {
    return;
  }

  if (!currentUser) {
    userPostsContainer.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  const userPosts = posts.filter((post) => post.userId === currentUser.id);

  if (userPosts.length === 0) {
    userPostsContainer.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  let html = "";

  userPosts
    .slice()
    .reverse()
    .forEach((post) => {
      html += `
        <article class="post-card">
          <h3>${post.username}</h3>
          <p>${post.content}</p>
          <small>${new Date(post.timestamp).toLocaleString("en-GB")}</small>
        </article>
      `;
    });

  userPostsContainer.innerHTML = html;
}
const editProfileBtn = document.getElementById("editProfileBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editProfileForm = document.getElementById("editProfileForm");

if (editProfileBtn) {
  editProfileBtn.addEventListener("click", openEditForm);
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", closeEditForm);
}

if (editProfileForm) {
  editProfileForm.addEventListener("submit", saveProfileChanges);
}

renderProfile();
renderUserPosts();
