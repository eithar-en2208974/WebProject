const postContent = document.getElementById("postContent");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("postsContainer");
const peopleContainer = document.getElementById("peopleContainer");

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
    apiRequest(
      `/api/posts?feedUserId=${currentUser.id}&sortBy=createdAt&order=desc`,
    ),
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

  document
    .querySelectorAll("#peopleContainer .follow-btn[data-user-id]")
    .forEach((button) => {
      button.addEventListener("click", () =>
        followUser(Number(button.dataset.userId)),
      );
    });

  document
    .querySelectorAll("#peopleContainer .unfollow-btn[data-user-id]")
    .forEach((button) => {
      button.addEventListener("click", () =>
        unfollowUser(Number(button.dataset.userId)),
      );
    });
}

function renderPosts(posts, followingIds = []) {
  const currentUser = getCurrentUser();
  postsContainer.innerHTML = "";

  if (!posts.length) {
    postsContainer.innerHTML =
      "<p>No posts yet. Follow someone below to add their posts to your feed.</p>";
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

      ${
        currentUser && currentUser.id === post.authorId
          ? `
            <div class="comment-input hidden" id="edit-box-${post.id}">
              <input type="text" id="edit-input-${post.id}" value="${post.text}" />
              <button class="follow-btn save-edit-btn" data-id="${post.id}">Save</button>
              <button class="cancel-btn cancel-edit-btn" data-id="${post.id}">Cancel</button>
            </div>
          `
          : ""
      }

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
                  <div class="comment-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <img src="${avatarFor(comment.author)}" class="comment-profile-img" alt="${comment.author.username}" />

                      <div class="comment-user-text">
                        <div class="comment-user">${comment.author.username}</div>
                        <div class="comment-time">${formatDate(comment.createdAt)}</div>
                      </div>
                    </div>

                    ${
                      currentUser && currentUser.id === comment.authorId
                        ? `<button class="delete-btn delete-comment-btn" data-id="${comment.id}">Delete</button>`
                        : ""
                    }
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

  document
    .querySelectorAll(".delete-btn:not(.delete-comment-btn)")
    .forEach((button) => {
      button.addEventListener("click", () =>
        deletePost(Number(button.dataset.id)),
      );
    });

  document.querySelectorAll(".delete-comment-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Delete this comment?")) return;

      try {
        await apiRequest(`/api/comments/${button.dataset.id}`, {
          method: "DELETE",
        });

        await loadPosts();
      } catch (error) {
        alert(error.message);
      }
    });
  });

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

        await loadPosts();
      } catch (error) {
        alert(error.message);
      }
    });
  });

  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", () => likePost(Number(button.dataset.id)));
  });

  document.querySelectorAll(".toggle-comments-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const commentsSection = document.getElementById(
        `comments-${button.dataset.id}`,
      );
      commentsSection.classList.toggle("hidden-comments");
    });
  });

  document.querySelectorAll(".comment-btn").forEach((button) => {
    button.addEventListener("click", () =>
      addComment(Number(button.dataset.id), button),
    );
  });

  document.querySelectorAll(".follow-btn[data-user-id]").forEach((button) => {
    button.addEventListener("click", () =>
      followUser(Number(button.dataset.userId)),
    );
  });

  document.querySelectorAll(".unfollow-btn[data-user-id]").forEach((button) => {
    button.addEventListener("click", () =>
      unfollowUser(Number(button.dataset.userId)),
    );
  });
}

async function createPost() {
  const text = postContent.value.trim();
  const currentUser = getCurrentUser();

  if (!text) {
    alert("Post cannot be empty.");
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
  if (!confirm("Delete this post?")) return;

  try {
    await apiRequest(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    await loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

async function likePost(postId) {
  const currentUser = getCurrentUser();

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

  if (!text) return;

  try {
    await apiRequest(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ authorId: currentUser.id, text }),
    });

    input.value = "";
    await loadPosts();
    document
      .getElementById(`comments-${postId}`)
      ?.classList.remove("hidden-comments");
  } catch (error) {
    alert(error.message);
  }
}

async function followUser(followingId) {
  const currentUser = getCurrentUser();

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
