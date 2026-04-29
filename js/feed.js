const feed = document.getElementById("feed");

async function loadFeed() {
  const { posts } = await apiRequest("/api/posts?sortBy=createdAt&order=desc");
  feed.innerHTML = "";

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h4>${post.author.username}</h4>
      <p>${post.text}</p>
      <p>${new Date(post.createdAt).toLocaleString()}</p>
      <button onclick="likePost(${post.id})">Like (${post._count.likes})</button>
      <button onclick="deletePost(${post.id})">Delete</button>
      <input id="comment${post.id}" placeholder="Write comment">
      <button onclick="addComment(${post.id})">Comment</button>
      <div id="comments${post.id}">
        ${post.comments.map((c) => `<p class="comment">${c.author.username}: ${c.text}</p>`).join("")}
      </div>
    `;
    feed.appendChild(div);
  });
}

async function likePost(id) {
  try {
    const user = requireCurrentUser();
    await apiRequest(`/api/posts/${id}/likes`, {
      method: "POST",
      body: JSON.stringify({ userId: user.id })
    });
    await loadFeed();
  } catch (error) {
    alert(error.message);
  }
}

async function addComment(id) {
  try {
    const user = requireCurrentUser();
    const input = document.getElementById("comment" + id);
    const text = input.value.trim();
    if (!text) return;

    await apiRequest(`/api/posts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ authorId: user.id, text })
    });
    input.value = "";
    await loadFeed();
  } catch (error) {
    alert(error.message);
  }
}

loadFeed().catch((error) => {
  feed.innerHTML = `<p>${error.message}</p>`;
});
