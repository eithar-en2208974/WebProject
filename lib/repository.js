const { prisma } = require("./prisma");

// STATISTICS
async function getPlatformStats() {
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();
  const totalLikes = await prisma.like.count();
  const totalMessages = await prisma.message.count();
  const totalFollows = await prisma.follow.count();

  // Stat 1: Average posts per user
  const averagePostsPerUser =
    totalUsers === 0 ? 0 : Number((totalPosts / totalUsers).toFixed(2));

  // Stat 2: Average followers per user
  const averageFollowersPerUser =
    totalUsers === 0 ? 0 : Number((totalFollows / totalUsers).toFixed(2));

  // Stat 3: Most active user (most posts)
  const mostActiveUserData = await prisma.post.groupBy({
    by: ["authorId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  let mostActiveUser = null;
  if (mostActiveUserData.length > 0) {
    const user = await prisma.user.findUnique({
      where: { id: mostActiveUserData[0].authorId },
      select: { username: true },
    });
    mostActiveUser = {
      username: user.username,
      postsCount: mostActiveUserData[0]._count.id,
    };
  }

  // Stat 4: Most liked post
  const mostLikedPostData = await prisma.like.groupBy({
    by: ["postId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  let mostLikedPost = null;
  if (mostLikedPostData.length > 0) {
    const post = await prisma.post.findUnique({
      where: { id: mostLikedPostData[0].postId },
      select: {
        text: true,
        author: { select: { username: true } },
      },
    });
    mostLikedPost = {
      text: post.text,
      author: post.author.username,
      likesCount: mostLikedPostData[0]._count.id,
    };
  }

  // Stat 5: Most commented post
  const mostCommentedPostData = await prisma.comment.groupBy({
    by: ["postId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  let mostCommentedPost = null;
  if (mostCommentedPostData.length > 0) {
    const post = await prisma.post.findUnique({
      where: { id: mostCommentedPostData[0].postId },
      select: {
        text: true,
        author: { select: { username: true } },
      },
    });
    mostCommentedPost = {
      text: post.text,
      author: post.author.username,
      commentsCount: mostCommentedPostData[0]._count.id,
    };
  }

  // Stat 6: Most followed user
  const mostFollowedData = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  let mostFollowedUser = null;
  if (mostFollowedData.length > 0) {
    const user = await prisma.user.findUnique({
      where: { id: mostFollowedData[0].followingId },
      select: { username: true },
    });
    mostFollowedUser = {
      username: user.username,
      followersCount: mostFollowedData[0]._count.id,
    };
  }

  // Stat 7: Top liker (user who liked the most posts)
  const topLikerData = await prisma.like.groupBy({
    by: ["userId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  let topLiker = null;
  if (topLikerData.length > 0) {
    const user = await prisma.user.findUnique({
      where: { id: topLikerData[0].userId },
      select: { username: true },
    });
    topLiker = {
      username: user.username,
      likesGiven: topLikerData[0]._count.id,
    };
  }

  return {
    totalUsers,
    totalPosts,
    totalComments,
    totalLikes,
    totalMessages,
    totalFollows,
    averagePostsPerUser,
    averageFollowersPerUser,
    mostActiveUser,
    mostLikedPost,
    mostCommentedPost,
    mostFollowedUser,
    topLiker,
  };
}

module.exports = {
  getPlatformStats,
};

