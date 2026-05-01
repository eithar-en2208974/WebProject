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
      <div style={bgContainer}>
        <span style={bubble1}></span>
        <span style={bubble2}></span>
        <span style={bubble3}></span>
      </div>

      <main style={container}>
        <h1 style={title}>Platform Statistics</h1>
        <p style={subtitle}>
          Live overview of Cirqle — users, posts, comments, likes, messages, and follows.
        </p>

        {/* Section 1: Totals */}
        <h2 style={sectionHeading}>Overall Totals</h2>
        <div style={grid}>
          <Card title="Total Users" value={stats.totalUsers} />
          <Card title="Total Posts" value={stats.totalPosts} />
          <Card title="Total Comments" value={stats.totalComments} />
          <Card title="Total Likes" value={stats.totalLikes} />
          <Card title="Total Messages" value={stats.totalMessages} />
          <Card title="Total Follows" value={stats.totalFollows} />
        </div>

        {/* Section 2: Averages */}
        <h2 style={sectionHeading}>Averages</h2>
        <div style={grid}>
          <Card
            title="Avg Posts per User"
            value={stats.averagePostsPerUser}
            sub="Stat 1 — posts ÷ users"
          />
          <Card
            title="Avg Followers per User"
            value={stats.averageFollowersPerUser}
            sub="Stat 2 — follows ÷ users"
          />
        </div>

        {/* Section 3: Top Entities */}
        <h2 style={sectionHeading}>Top Entities</h2>
        <div style={detailGrid}>

          <section style={detailCard}>
            <h3 style={cardLabel}>Stat 3 — Most Active User</h3>
            <p style={cardValue}>
              {stats.mostActiveUser
                ? stats.mostActiveUser.username
                : "No data"}
            </p>
            {stats.mostActiveUser && (
              <p style={cardSub}>{stats.mostActiveUser.postsCount} posts published</p>
            )}
          </section>

          <section style={detailCard}>
            <h3 style={cardLabel}>Stat 4 — Most Followed User</h3>
            <p style={cardValue}>
              {stats.mostFollowedUser
                ? stats.mostFollowedUser.username
                : "No data"}
            </p>
            {stats.mostFollowedUser && (
              <p style={cardSub}>{stats.mostFollowedUser.followersCount} followers</p>
            )}
          </section>

          <section style={detailCard}>
            <h3 style={cardLabel}>Stat 5 — Top Liker</h3>
            <p style={cardValue}>
              {stats.topLiker ? stats.topLiker.username : "No data"}
            </p>
            {stats.topLiker && (
              <p style={cardSub}>{stats.topLiker.likesGiven} likes given</p>
            )}
          </section>

        </div>

        {/* Section 4: Top Posts */}
        <h2 style={sectionHeading}>Top Posts</h2>
        <div style={detailGrid}>

          <section style={detailCard}>
            <h3 style={cardLabel}>Stat 6 — Most Liked Post</h3>
            {stats.mostLikedPost ? (
              <>
                <p style={cardValue}>{stats.mostLikedPost.likesCount} likes</p>
                <p style={cardSub}>by {stats.mostLikedPost.author}</p>
                <p style={postText}>{stats.mostLikedPost.text}</p>
              </>
            ) : (
              <p>No data available</p>
            )}
          </section>

          <section style={detailCard}>
            <h3 style={cardLabel}>Stat 7 — Most Commented Post</h3>
            {stats.mostCommentedPost ? (
              <>
                <p style={cardValue}>{stats.mostCommentedPost.commentsCount} comments</p>
                <p style={cardSub}>by {stats.mostCommentedPost.author}</p>
                <p style={postText}>{stats.mostCommentedPost.text}</p>
              </>
            ) : (
              <p>No data available</p>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

function Card({ title, value, sub }) {
  return (
    <div style={card}>
      <h3 style={{ marginBottom: "6px", fontSize: "14px", color: "#6b7280" }}>{title}</h3>
      <p style={valueStyle}>{value}</p>
      {sub && <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{sub}</p>}
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
const title = { fontSize: "34px", color: "#1e1b4b", marginBottom: "8px" };
const subtitle = { color: "#6b7280", marginBottom: "24px" };
const sectionHeading = {
  fontSize: "18px",
  color: "#1e1b4b",
  margin: "28px 0 12px",
  borderBottom: "2px solid #c7d2fe",
  paddingBottom: "6px",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
};
const detailGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
};
const card = {
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: "22px",
  padding: "20px",
  boxShadow: "0 18px 35px rgba(30,41,59,0.1)",
};
const detailCard = {
  ...card,
};
const valueStyle = { fontSize: "30px", fontWeight: "bold", color: "#4f46e5" };
const cardLabel = { fontSize: "13px", color: "#6b7280", marginBottom: "6px" };
const cardValue = { fontSize: "26px", fontWeight: "bold", color: "#4f46e5", margin: "4px 0" };
const cardSub = { fontSize: "13px", color: "#9ca3af", margin: "2px 0" };
const postText = {
  marginTop: "10px",
  fontSize: "14px",
  color: "#374151",
  background: "#f3f4f6",
  borderRadius: "10px",
  padding: "10px",
};
const bgContainer = { position: "fixed", inset: 0, zIndex: 0 };
const bubble1 = {
  position: "absolute", width: "220px", height: "220px",
  background: "rgba(99,102,241,0.16)", borderRadius: "50%", top: "90px", left: "-60px",
};
const bubble2 = {
  position: "absolute", width: "280px", height: "280px",
  background: "rgba(59,130,246,0.14)", borderRadius: "50%", bottom: "40px", right: "-70px",
};
const bubble3 = {
  position: "absolute", width: "140px", height: "140px",
  background: "rgba(191,219,254,0.55)", borderRadius: "50%", top: "180px", right: "180px",
};
