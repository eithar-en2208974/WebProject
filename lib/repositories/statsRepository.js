import { prisma } from "../prisma";

export async function getPlatformStats() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [
    userCount,
    postCount,
    messageCount,
    followers,
    postsPerUser,
    mostActiveUser,
    topLikedPost,
    unreadNotifications
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.message.count(),
    prisma.follow.count(),
    prisma.user.findMany({
      select: { id: true, username: true, _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
      take: 1
    }),
    prisma.user.findMany({
      where: { posts: { some: { createdAt: { gte: threeMonthsAgo } } } },
      select: { id: true, username: true, _count: { select: { posts: true, comments: true, likes: true } } },
      orderBy: { posts: { _count: "desc" } },
      take: 1
    }),
    prisma.post.findFirst({
      orderBy: { likes: { _count: "desc" } },
      select: {
        id: true,
        text: true,
        author: { select: { username: true } },
        _count: { select: { likes: true } }
      }
    }),
    prisma.notification.count({ where: { isRead: false } })
  ]);

  return {
    userCount,
    postCount,
    messageCount,
    averageFollowersPerUser: userCount ? followers / userCount : 0,
    averagePostsPerUser: userCount ? postCount / userCount : 0,
    mostPostsUser: postsPerUser[0] || null,
    mostActiveUserLast3Months: mostActiveUser[0] || null,
    topLikedPost,
    unreadNotifications
  };
}
