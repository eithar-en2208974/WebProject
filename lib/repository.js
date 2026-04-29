const { prisma } = require("./prisma");
// STATISTICS
async function getPlatformStats() {
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();
  const totalLikes = await prisma.like.count();
  const totalMessages = await prisma.message.count();
  const totalFollows = await prisma.follow.count();

  const averagePostsPerUser =
    totalUsers === 0 ? 0 : Number((totalPosts / totalUsers).toFixed(2));

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
        author: {
          select: { username: true },
        },
      },
    });

    mostLikedPost = {
      text: post.text,
      author: post.author.username,
      likesCount: mostLikedPostData[0]._count.id,
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
    mostActiveUser,
    mostLikedPost,
  };
}

module.exports = {
  getPlatformStats,
};