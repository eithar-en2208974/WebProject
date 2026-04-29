const postContent = document.getElementById("postContent");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("postsContainer");

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
  const { posts } = await apiRequest("/api/posts?sortBy=createdAt&order=desc");
  renderPosts(posts);
}

function renderPosts(posts) {
  const currentUser = getCurrentUser();

  postsContainer.innerHTML = "";

  if (!posts.length) {
    postsContainer.innerHTML = "<p>No posts yet.</p>";
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
            <div class="post-user">${post.author.username}</div>
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
            ? `<button class="follow-btn" data-user-id="${post.authorId}">Follow</button>`
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
    alert("Followed successfully.");
  } catch (error) {
    alert(error.message);
  }
}

postBtn.addEventListener("click", createPost);
loadPosts().catch((error) => {
  postsContainer.innerHTML = `<p>${error.message}</p>`;
});
