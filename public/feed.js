const postContent = document.getElementById("postContent");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("postsContainer");
const peopleContainer = document.getElementById("peopleContainer");

async function apiRequest(path, options = {}) {
  const apiBases = ["", "http://localhost:3005", "http://localhost:3000"];
  let lastError;

  for (const baseUrl of apiBases) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      lastError = error;
      if (!String(error.message).includes("404") && baseUrl) break;
    }
  }

  throw lastError;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-GB");
}

function avatarFor(user) {
  return (
    user?.avatarUrl ||
    "https://i.pinimg.com/736x/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg"
  );
}

async function loadPosts() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const [{ posts }, { followingIds }] = await Promise.all([
    apiRequest(`/api/posts?feedUserId=${currentUser.id}&sortBy=createdAt&order=desc`),
    apiRequest(`/api/follows?followerId=${currentUser.id}`),
  ]);

  renderPosts(posts, followingIds);
  await loadPeople(followingIds);
}

async function loadPeople(followingIds) {
  if (!peopleContainer) return;

  const currentUser = getCurrentUser();
  const { users } = await apiRequest("/api/users?sortBy=username&order=asc");
  const otherUsers = users.filter((user) => user.id !== currentUser.id);

  peopleContainer.innerHTML = otherUsers
    .map((user) => {
      const isFollowing = followingIds.includes(user.id);
      return `
        <article class="post-card">
          <div class="post-header">
            <div class="post-user-info">
              <img src="${avatarFor(user)}" alt="${user.username}" class="post-profile-img" />
              <div class="post-user-text">
                <a class="post-user" href="profile.html?userId=${user.id}">${user.username}</a>
                <div class="post-time">${user._count.posts} posts</div>
              </div>
            </div>
            <button class="${isFollowing ? "unfollow-btn" : "follow-btn"}" data-user-id="${user.id}">
              ${isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("#peopleContainer .follow-btn").forEach((button) => {
    button.addEventListener("click", () => followUser(Number(button.dataset.userId)));
  });

  document.querySelectorAll("#peopleContainer .unfollow-btn").forEach((button) => {
    button.addEventListener("click", () => unfollowUser(Number(button.dataset.userId)));
  });
}

function renderPosts(posts, followingIds = []) {
  const currentUser = getCurrentUser();

  postsContainer.innerHTML = "";

  if (!posts.length) {
    postsContainer.innerHTML = "<p>No posts yet. Follow someone below to add their posts to your feed.</p>";
    return;
  }

  posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");

    postCard.innerHTML = `
      <div class="post-header">
        <div class="post-user-info">
          <img src="${avatarFor(post.author)}" alt="${post.author.username}" class="post-profile-img" />
          <div class="post-user-text">
            <a class="post-user" href="profile.html?userId=${post.author.id}">${post.author.username}</a>
            <div class="post-time">${formatDate(post.createdAt)}</div>
          </div>
        </div>
        ${
          currentUser && currentUser.id === post.authorId
            ? `<button class="delete-btn" data-id="${post.id}">Delete</button>`
            : ""
        }
      </div>

      <p class="post-text">${post.text}</p>

      <div class="post-actions">
        <button class="like-btn" data-id="${post.id}">Like (${post._count.likes})</button>
        <button class="toggle-comments-btn" data-id="${post.id}">
          Comment (${post._count.comments})
        </button>

        ${
          currentUser && currentUser.id !== post.authorId
            ? `<button class="${followingIds.includes(post.authorId) ? "unfollow-btn" : "follow-btn"}" data-user-id="${post.authorId}">
                ${followingIds.includes(post.authorId) ? "Unfollow" : "Follow"}
              </button>`
            : ""
        }
      </div>

      <div class="comments-section hidden-comments" id="comments-${post.id}">
        <div class="comments-list">
          ${post.comments
            .map(
              (comment) => `
                <div class="comment-card">
                  <div class="comment-header">
                    <img src="${avatarFor(comment.author)}" class="comment-profile-img" alt="${comment.author.username}" />
                    <div class="comment-user-text">
                      <div class="comment-user">${comment.author.username}</div>
                      <div class="comment-time">${formatDate(comment.createdAt)}</div>
                    </div>
                  </div>
                  <p class="comment-text">${comment.text}</p>
                </div>
              `,
            )
            .join("")}
        </div>

        <div class="comment-input">
          <input type="text" class="comment-text" placeholder="Write a comment..." />
          <button class="comment-btn" data-id="${post.id}">Comment</button>
        </div>
      </div>
    `;

    postsContainer.appendChild(postCard);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => deletePost(Number(button.dataset.id)));
  });

  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", () => likePost(Number(button.dataset.id)));
  });

  document.querySelectorAll(".toggle-comments-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const commentsSection = document.getElementById(`comments-${button.dataset.id}`);
      commentsSection.classList.toggle("hidden-comments");
    });
  });

  document.querySelectorAll(".comment-btn").forEach((button) => {
    button.addEventListener("click", () => addComment(Number(button.dataset.id), button));
  });

  document.querySelectorAll(".follow-btn").forEach((button) => {
    button.addEventListener("click", () => followUser(Number(button.dataset.userId)));
  });

  document.querySelectorAll(".unfollow-btn").forEach((button) => {
    button.addEventListener("click", () => unfollowUser(Number(button.dataset.userId)));
  });
}

async function createPost() {
  const text = postContent.value.trim();
  const currentUser = getCurrentUser();

  if (!text) {
    alert("Post cannot be empty.");
    return;
  }

  if (!currentUser) {
    alert("No user is logged in.");
    window.location.href = "login.html";
    return;
  }

  try {
    await apiRequest("/api/posts", {
      method: "POST",
      body: JSON.stringify({ authorId: currentUser.id, text }),
    });
    postContent.value = "";
    await loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

async function deletePost(postId) {
  try {
    await apiRequest(`/api/posts/${postId}`, { method: "DELETE" });
    await loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

async function likePost(postId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  try {
    await apiRequest(`/api/posts/${postId}/likes`, {
      method: "POST",
      body: JSON.stringify({ userId: currentUser.id }),
    });
    await loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

async function addComment(postId, button) {
  const currentUser = getCurrentUser();
  const input = button.previousElementSibling;
  const text = input.value.trim();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  if (!text) return;

  try {
    await apiRequest(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ authorId: currentUser.id, text }),
    });
    input.value = "";
    await loadPosts();
    document.getElementById(`comments-${postId}`)?.classList.remove("hidden-comments");
  } catch (error) {
    alert(error.message);
  }
}

async function followUser(followingId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  try {
    await apiRequest("/api/follows", {
      method: "POST",
      body: JSON.stringify({ followerId: currentUser.id, followingId }),
    });
    await loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

async function unfollowUser(followingId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  try {
    await apiRequest("/api/follows", {
      method: "DELETE",
      body: JSON.stringify({ followerId: currentUser.id, followingId }),
    });
    await loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

postBtn.addEventListener("click", createPost);
loadPosts().catch((error) => {
  postsContainer.innerHTML = `<p>${error.message}</p>`;
});
