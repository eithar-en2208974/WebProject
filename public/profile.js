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
const profilePostsTitle = document.getElementById("profilePostsTitle");

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Request failed with status ${response.status}`,
    );
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

  const profileUserId =
    Number(new URLSearchParams(window.location.search).get("userId")) ||
    currentUser.id;

  const isOwnProfile = profileUserId === currentUser.id;

  const { user } = await apiRequest(`/api/users/${profileUserId}`);

  const { posts } = await apiRequest(
    `/api/posts?authorId=${user.id}&sortBy=createdAt&order=desc`,
  );

  if (isOwnProfile) setCurrentUser(user);

  renderProfile(user, isOwnProfile);
  renderUserPosts(posts, user, isOwnProfile);
}

function renderProfile(user, isOwnProfile) {
  profileInfo.username.textContent = user.username;
  profileInfo.email.textContent = user.email;
  profileInfo.bio.textContent = user.bio || "No bio yet.";
  profileInfo.image.src = user.avatarUrl || defaultAvatar();
  profileInfo.followers.textContent = user._count?.followers || 0;
  profileInfo.following.textContent = user._count?.following || 0;

  if (editProfileBtn) {
    editProfileBtn.classList.toggle("hidden", !isOwnProfile);
  }
}

function openEditForm() {
  const currentUser = getCurrentUser();

  document.getElementById("editUsername").value = currentUser.username || "";
  document.getElementById("editBio").value = currentUser.bio || "";

  document.getElementById("editProfilePicture").value = "";

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
  const bio = document.getElementById("editBio").value.trim();
  const imageFile = document.getElementById("editProfilePicture").files[0];

  let avatarUrl = currentUser.avatarUrl || null;

  if (imageFile) {
    avatarUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(imageFile);
    });
  }

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
        bio: bio || null,
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

function renderUserPosts(posts, user, isOwnProfile) {
  if (profilePostsTitle) {
    profilePostsTitle.textContent = isOwnProfile
      ? "My Posts"
      : `${user.username}'s Posts`;
  }

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

            ${
              isOwnProfile
                ? `
                  <div class="post-actions">
                    <button class="follow-btn edit-post-btn" data-id="${post.id}">Edit</button>
                    <button class="delete-btn" data-id="${post.id}">Delete</button>
                  </div>
                `
                : ""
            }
          </div>

          <p class="post-text">${post.text}</p>

          <div class="comment-input hidden" id="edit-box-${post.id}">
            <input type="text" id="edit-input-${post.id}" value="${post.text}" />
            <button class="follow-btn save-edit-btn" data-id="${post.id}">Save</button>
            <button class="cancel-btn cancel-edit-btn" data-id="${post.id}">Cancel</button>
          </div>
        </article>
      `,
    )
    .join("");

  // DELETE
  document
    .querySelectorAll("#userPostsContainer .delete-btn")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        if (!confirm("Delete this post?")) return;

        try {
          await apiRequest(`/api/posts/${button.dataset.id}`, {
            method: "DELETE",
          });

          await loadProfile();
        } catch (error) {
          alert(error.message);
        }
      });
    });

  // EDIT
  document.querySelectorAll(".edit-post-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.id;
      document.getElementById(`edit-box-${postId}`).classList.remove("hidden");
    });
  });

  document.querySelectorAll(".cancel-edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.id;
      document.getElementById(`edit-box-${postId}`).classList.add("hidden");
    });
  });

  document.querySelectorAll(".save-edit-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const postId = button.dataset.id;
      const text = document.getElementById(`edit-input-${postId}`).value.trim();

      if (!text) {
        alert("Post cannot be empty.");
        return;
      }

      try {
        await apiRequest(`/api/posts/${postId}`, {
          method: "PUT",
          body: JSON.stringify({ text }),
        });

        await loadProfile();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

// EVENTS
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
