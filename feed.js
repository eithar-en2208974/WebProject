const postContent = document.getElementById("postContent");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("postsContainer");

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

function savePosts(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}
function toggleFollow(targetUsername) {
  const users = getUsers();
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.username === targetUsername) return;

  const currentUserIndex = users.findIndex(
    (user) => user.id === currentUser.id
  );

  const targetUserIndex = users.findIndex(
    (user) => user.username === targetUsername
  );

  if (currentUserIndex === -1 || targetUserIndex === -1) return;

  const currentUserData = users[currentUserIndex];
  const targetUserData = users[targetUserIndex];

  currentUserData.following = currentUserData.following || [];
  targetUserData.followers = targetUserData.followers || [];

  const isFollowing = currentUserData.following.includes(targetUserData.id);

  if (isFollowing) {
    currentUserData.following = currentUserData.following.filter(
      (id) => id !== targetUserData.id
    );
    targetUserData.followers = targetUserData.followers.filter(
      (id) => id !== currentUserData.id
    );
  } else {
    currentUserData.following.push(targetUserData.id);
    targetUserData.followers.push(currentUserData.id);
  }

  users[currentUserIndex] = currentUserData;
  users[targetUserIndex] = targetUserData;

saveUsers(users);
setCurrentUser(currentUserData);
renderPosts();
}

function renderPosts() {
    const posts = getPosts();
    const currentUser = getCurrentUser();

    postsContainer.innerHTML = "";

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet.</p>";
        return;
    }
posts.slice().reverse().forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");

    postCard.innerHTML = `
      <div class="post-header">
        <div>
          <div class="post-user">${post.username}</div>
          <div class="post-time">${formatDate(post.timestamp)}</div>
        </div> 
        ${
          currentUser && currentUser.username === post.username
            ? `<button class="delete-btn" data-id="${post.id}">Delete</button>`
            : ""
        }
      </div>

      <p class="post-text">${post.content}</p>
       

      <div class="post-actions">
        <button class="like-btn" data-id="${post.id}">❤️ Like</button>
        <span class="like-count">${post.likes || 0}</span>

${
  currentUser && currentUser.username !== post.username
    ? `<button class="follow-btn" data-username="${post.username}">
         ${
           (currentUser.following || []).includes(
             (getUsers().find((u) => u.username === post.username) || {}).id
           )
             ? "Unfollow"
             : "Follow"
         }
       </button>`
    : ""
}
      </div>

      <div class="comments-section">
        <div class="comments-list">
          ${(post.comments || []).map(c => `<p>${c}</p>`).join("")}
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
  button.addEventListener("click", function () {
    deletePost(Number(this.dataset.id));
  });
});

document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const postId = Number(this.dataset.id);
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);

    post.likes = post.likes || 0;
    post.likes++;

    savePosts(posts);
    renderPosts();
  });
});

document.querySelectorAll(".comment-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const postId = Number(this.dataset.id);
    const input = this.previousElementSibling;

    const text = input.value.trim();
    if (!text) return;

    const posts = getPosts();
    const post = posts.find(p => p.id === postId);

    post.comments = post.comments || [];
    post.comments.push(text);

    savePosts(posts);

    input.value = "";
    renderPosts();
  });
});
document.querySelectorAll(".follow-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const targetUsername = this.dataset.username;
    toggleFollow(targetUsername);
  });
});
}
function createPost() {
    const content = postContent.value.trim();
    const currentUser = getCurrentUser();

    if (!content) {
        alert("Post cannot be empty.");
        return;
    }
    if (!currentUser) {
        alert("No user is logged in.");
        return;
    }

    const posts = getPosts(); 

const newPost = {
  id: Date.now(),
  username: currentUser.username,
  userId: currentUser.id,
  content: content,
  timestamp: new Date().toISOString(),
  likes: 0,
  likedBy: [],
  comments: []
};

    posts.push(newPost);
    savePosts(posts);
    postContent.value = ""; 
    renderPosts(); 
}
function deletePost(postId) {
    let posts = getPosts();
    posts = posts.filter((post) => post.id !== postId);
    savePosts(posts);
    renderPosts();
}

postBtn.addEventListener("click", createPost);
renderPosts();

