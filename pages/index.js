import { useEffect, useState } from "react";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("currentUser")));
    loadPosts();
  }, []);

  async function loadPosts() {
    const data = await apiRequest("/api/posts?sortBy=createdAt&order=desc");
    setPosts(data.posts || []);
  }

  async function createPost() {
    if (!requireLogin(user, setError) || !text.trim()) return;
    await apiRequest("/api/posts", {
      method: "POST",
      body: JSON.stringify({ authorId: user.id, text })
    });
    setText("");
    await loadPosts();
  }

  async function likePost(id) {
    if (!requireLogin(user, setError)) return;
    await apiRequest(`/api/posts/${id}/likes`, {
      method: "POST",
      body: JSON.stringify({ userId: user.id })
    });
    await loadPosts();
  }

  async function deletePost(id) {
    await apiRequest(`/api/posts/${id}`, { method: "DELETE" });
    await loadPosts();
  }

  async function addComment(postId, commentText) {
    if (!requireLogin(user, setError) || !commentText.trim()) return false;
    await apiRequest(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ authorId: user.id, text: commentText })
    });
    await loadPosts();
    return true;
  }

  return (
    <main>
      <nav className="navbar">
        <h1>Vibe</h1>
        <div>
          <a href="/profile">Profile</a>
          <a href="/stats">Stats</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <section className="createPost">
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="What's on your mind?" />
        <button onClick={createPost}>Post</button>
        {error && <p className="error">{error}</p>}
      </section>

      <section id="feed">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={likePost} onDelete={deletePost} onComment={addComment} />
        ))}
      </section>
    </main>
  );
}

function PostCard({ post, onLike, onDelete, onComment }) {
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <article className="post">
      <h4>{post.author.username}</h4>
      <p>{post.text}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>
      <button onClick={() => onLike(post.id)}>Like ({post._count.likes})</button>
      <button onClick={() => onDelete(post.id)}>Delete</button>
      <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write comment" />
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const saved = await onComment(post.id, comment);
          if (saved) setComment("");
          setBusy(false);
        }}
      >
        Comment
      </button>
      {post.comments.map((item) => (
        <p className="comment" key={item.id}>{item.author.username}: {item.text}</p>
      ))}
    </article>
  );
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
  return data;
}

function requireLogin(user, setError) {
  if (user) {
    setError("");
    return true;
  }
  setError("Please login first. Use nada@example.com / 123456 for the seeded account.");
  return false;
}
