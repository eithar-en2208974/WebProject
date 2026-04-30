import { prisma } from "../prisma";

export async function createPost({ authorId, text }) {
  return prisma.post.create({
    data: { authorId: Number(authorId), text },
    select: postSelect(),
  });
}

export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
    select: postSelect(),
  });
}

export async function listPosts({
  authorId,
  feedUserId,
  search = "",
  sortBy = "createdAt",
  order = "desc",
  limit = 50,
} = {}) {
  const allowedSorts = new Set(["createdAt", "id"]);
  const followingIds = feedUserId ? await getFollowingIds(feedUserId) : null;
  const visibleAuthorIds = followingIds
    ? [Number(feedUserId), ...followingIds]
    : null;

  return prisma.post.findMany({
    where: {
      ...(authorId ? { authorId: Number(authorId) } : {}),
      ...(visibleAuthorIds ? { authorId: { in: visibleAuthorIds } } : {}),
      ...(search ? { text: { contains: search } } : {}),
    },
    orderBy: {
      [allowedSorts.has(sortBy) ? sortBy : "createdAt"]:
        order === "asc" ? "asc" : "desc",
    },
    take: Math.min(Number(limit) || 50, 100),
    select: postSelect(),
  });
}

async function getFollowingIds(followerId) {
  const follows = await prisma.follow.findMany({
    where: { followerId: Number(followerId) },
    select: { followingId: true },
  });

  return follows.map((follow) => follow.followingId);
}

export async function updatePost(id, { text }) {
  return prisma.post.update({
    where: { id: Number(id) },
    data: { text },
    select: postSelect(),
  });
}

export async function deletePost(id) {
  return prisma.post.delete({
    where: { id: Number(id) },
    select: { id: true },
  });
}

function postSelect() {
  return {
    id: true,
    text: true,
    createdAt: true,
    authorId: true,

    author: {
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    },

    comments: {
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        text: true,
        createdAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    },

    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  };
}
