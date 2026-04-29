import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    Promise.all([
      fetch(`/api/users/${currentUser.id}`).then((response) => response.json()),
      fetch(`/api/posts?authorId=${currentUser.id}&sortBy=createdAt&order=desc`).then((response) => response.json())
    ]).then(([userData, postData]) => {
      setProfile(userData.user);
      setPosts(postData.posts || []);
    });
  }, []);

  return (
    <main>
      <nav className="navbar">
        <h1>Vibe</h1>
        <a href="/">Home</a>
      </nav>

      {profile && (
        <section>
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
          <p>{profile._count.posts} posts | {profile._count.followers} followers | {profile._count.following} following</p>
        </section>
      )}

      <section>
        <h3>User Posts</h3>
        {posts.map((post) => (
          <article className="post" key={post.id}>
            <p>{post.text}</p>
            <p>{new Date(post.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
