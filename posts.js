// --- UTILITY FUNCTIONS ---
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// --- FOLLOW / UNFOLLOW ---
function followUser(targetId) {
  const users = getUsers();
  const currentUser = getCurrentUser();

  if (!currentUser.following.includes(targetId)) {
    currentUser.following.push(targetId);
    const targetUser = users.find((u) => u.id === targetId);
    targetUser.followers.push(currentUser.id);
    saveUsers(users);
    setCurrentUser(currentUser);
  }
}

function unfollowUser(targetId) {
  const users = getUsers();
  const currentUser = getCurrentUser();

  currentUser.following = currentUser.following.filter((id) => id !== targetId);
  const targetUser = users.find((u) => u.id === targetId);
  targetUser.followers = targetUser.followers.filter(
    (id) => id !== currentUser.id,
  );

  saveUsers(users);
  setCurrentUser(currentUser);
}

function toggleFollow(userId) {
  if (getCurrentUser().following.includes(userId)) {
    unfollowUser(userId);
  } else {
    followUser(userId);
  }
  renderCurrentPagePosts();
}

// --- LIKE / UNLIKE ---
function toggleLike(postId) {
  const posts = getPosts();
  const currentUser = getCurrentUser();
  const post = posts.find((p) => p.id === postId);

  post.likedBy = post.likedBy || [];
  post.likes = post.likes || 0;

  if (post.likedBy.includes(currentUser.id)) {
    post.likedBy = post.likedBy.filter((id) => id !== currentUser.id);
    post.likes--;
  } else {
    post.likedBy.push(currentUser.id);
    post.likes++;
  }

  savePosts(posts);
  renderCurrentPagePosts();
}

// --- ADD COMMENT ---
function addComment(postId) {
  const input = document.getElementById(`comment-${postId}`);
  const text = input.value.trim();
  if (!text) return;

  const posts = getPosts();
  const currentUser = getCurrentUser();
  const post = posts.find((p) => p.id === postId);

  post.comments = post.comments || [];
  post.comments.push({
    id: Date.now(),
    userId: currentUser.id,
    username: currentUser.username,
    text,
    timestamp: new Date().toLocaleString(),
  });

  savePosts(posts);
  input.value = "";
  renderCurrentPagePosts();
}

// --- CREATE NEW POST ---
function createPost(content) {
  const currentUser = getCurrentUser();
  const posts = getPosts();

  posts.unshift({
    id: Date.now(),
    userId: currentUser.id,
    username: currentUser.username,
    text: content,
    likes: 0,
    likedBy: [],
    comments: [],
  });

  savePosts(posts);
  renderCurrentPagePosts();
}

// --- RENDER POSTS FOR HOME OR PROFILE ---
function renderPosts(postsArray) {
  return postsArray
    .map((post) => {
      const currentUser = getCurrentUser();
      const isLiked = post.likedBy.includes(currentUser.id);
      const likeText = isLiked ? "Unlike" : "Like";
      const followText = currentUser.following.includes(post.userId)
        ? "Unfollow"
        : "Follow";

      return `
      <div class="post">
        <h3>${post.username}</h3>
        <p>${post.text}</p>
        <button onclick="toggleLike(${post.id})">${likeText} (${post.likes})</button>
        ${
          post.userId !== getCurrentUser().id
            ? `<button onclick="toggleFollow(${post.userId})">${followText}</button>`
            : ""
        }
        <div class="comments" id="comments-${post.id}">
          ${post.comments.map((c) => `<p><strong>${c.username}:</strong> ${c.text}</p>`).join("")}
        </div>
        <input id="comment-${post.id}" placeholder="Add a comment...">
        <button onclick="addComment(${post.id})">Comment</button>
      </div>
      `;
    })
    .join("");
}

function renderCurrentPagePosts() {
  const postsContainer = document.getElementById("postsContainer");
  if (!postsContainer) return;

  const posts = getPosts();
  const currentUser = getCurrentUser();

  // Check if profile page
  if (window.location.pathname.includes("profile.html")) {
    // Show only current user's posts
    const userPosts = posts.filter((post) => post.userId === currentUser.id);
    postsContainer.innerHTML = renderPosts(userPosts);
  } else {
    // Home feed shows all posts
    postsContainer.innerHTML = renderPosts(posts);
  }
}

// --- INITIALIZE PAGE ---
document.addEventListener("DOMContentLoaded", () => {
  // Create post button listener
  const postBtn = document.getElementById("postBtn");
  if (postBtn) {
    postBtn.addEventListener("click", () => {
      const contentEl = document.getElementById("postContent");
      const content = contentEl.value.trim();
      if (!content) return;
      createPost(content);
      contentEl.value = "";
    });
  }

  renderCurrentPagePosts();
});
