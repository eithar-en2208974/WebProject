import { useEffect, useState } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data.stats));
  }, []);

  if (!stats) return <main><p>Loading...</p></main>;

  return (
    <main>
      <nav className="navbar">
        <h1>Vibe Stats</h1>
        <a href="/">Home</a>
      </nav>
      <section id="feed">
        <Stat label="Total users" value={stats.userCount} />
        <Stat label="Total posts" value={stats.postCount} />
        <Stat label="Total messages" value={stats.messageCount} />
        <Stat label="Average followers per user" value={stats.averageFollowersPerUser.toFixed(2)} />
        <Stat label="Average posts per user" value={stats.averagePostsPerUser.toFixed(2)} />
        <Stat label="Unread notifications" value={stats.unreadNotifications} />
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <article className="post">
      <h3>{label}</h3>
      <p>{value}</p>
    </article>
  );
}
