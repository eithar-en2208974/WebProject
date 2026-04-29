import { useEffect, useState } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div style={pageWrapper}>
      {/* Background bubbles */}
      <div style={bgContainer}>
        <span style={bubble1}></span>
        <span style={bubble2}></span>
        <span style={bubble3}></span>
      </div>

      <main style={container}>
        <h1 style={title}>Platform Statistics</h1>
        <p style={subtitle}>
          Overview of users, posts, comments, likes, messages, and follows.
        </p>

        <div style={grid}>
          <Card title="Total Users" value={stats.totalUsers} />
          <Card title="Total Posts" value={stats.totalPosts} />
          <Card title="Total Comments" value={stats.totalComments} />
          <Card title="Total Likes" value={stats.totalLikes} />
          <Card title="Total Messages" value={stats.totalMessages} />
          <Card title="Total Follows" value={stats.totalFollows} />
          <Card
            title="Average Posts per User"
            value={stats.averagePostsPerUser}
          />
        </div>

        <section style={detailCard}>
          <h2>Most Active User</h2>
          <p>
            {stats.mostActiveUser
              ? `${stats.mostActiveUser.username} (${stats.mostActiveUser.postsCount} posts)`
              : "No data available"}
          </p>
        </section>

        <section style={detailCard}>
          <h2>Most Liked Post</h2>
          {stats.mostLikedPost ? (
            <>
              <p><strong>Author:</strong> {stats.mostLikedPost.author}</p>
              <p><strong>Likes:</strong> {stats.mostLikedPost.likesCount}</p>
              <p>{stats.mostLikedPost.text}</p>
            </>
          ) : (
            <p>No data available</p>
          )}
        </section>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

const pageWrapper = {
  minHeight: "100vh",
  position: "relative",
  background: "linear-gradient(135deg, #eef2ff, #dbeafe, #f8fbff)",
};

const container = {
  position: "relative",
  zIndex: 2,
  maxWidth: "1100px",
  margin: "30px auto",
  padding: "20px",
  fontFamily: "Arial",
};

const title = {
  fontSize: "34px",
  color: "#1e1b4b",
  marginBottom: "8px",
};

const subtitle = {
  color: "#6b7280",
  marginBottom: "24px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const card = {
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: "22px",
  padding: "20px",
  boxShadow: "0 18px 35px rgba(30,41,59,0.1)",
};

const valueStyle = {
  fontSize: "30px",
  fontWeight: "bold",
  color: "#4f46e5",
};

const detailCard = {
  marginTop: "22px",
  padding: "20px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 18px 35px rgba(30,41,59,0.1)",
};

const bgContainer = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
};

const bubble1 = {
  position: "absolute",
  width: "220px",
  height: "220px",
  background: "rgba(99,102,241,0.16)",
  borderRadius: "50%",
  top: "90px",
  left: "-60px",
};

const bubble2 = {
  position: "absolute",
  width: "280px",
  height: "280px",
  background: "rgba(59,130,246,0.14)",
  borderRadius: "50%",
  bottom: "40px",
  right: "-70px",
};

const bubble3 = {
  position: "absolute",
  width: "140px",
  height: "140px",
  background: "rgba(191,219,254,0.55)",
  borderRadius: "50%",
  top: "180px",
  right: "180px",
};