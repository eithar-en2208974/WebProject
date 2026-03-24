function addComment(postId) {
  const input = document.getElementById(`comment-${postId}`);
  if (!input) return; // safety check
  const text = input.value.trim();
  if (!text) return;

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  post.comments = post.comments || [];
  post.comments.push({
    id: Date.now(),
    userId: currentUser.id,
    username: currentUser.username,
    text,
    timestamp: new Date().toLocaleString(),
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  input.value = "";
  if (typeof renderComments === "function") renderComments(postId);
}

function renderComments(postId) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const container = document.getElementById(`comments-${postId}`);
  if (!container) return;

  container.innerHTML = post.comments
    .map((c) => `<p><strong>${c.username}:</strong> ${c.text}</p>`)
    .join("");
}
