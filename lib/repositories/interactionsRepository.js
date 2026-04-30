import { prisma } from "../prisma";

export async function addComment({ postId, authorId, text }) {
  return prisma.comment.create({
    data: { postId: Number(postId), authorId: Number(authorId), text },
    select: {
      id: true,
      text: true,
      createdAt: true,
      postId: true,
      author: { select: { id: true, username: true } }
    }
  });
}

export async function deleteComment(id) {
  return prisma.comment.delete({
    where: { id: Number(id) },
    select: { id: true }
  });
}

export async function likePost({ postId, userId }) {
  return prisma.like.upsert({
    where: { postId_userId: { postId: Number(postId), userId: Number(userId) } },
    create: { postId: Number(postId), userId: Number(userId) },
    update: {},
    select: { id: true, postId: true, userId: true }
  });
}

export async function unlikePost({ postId, userId }) {
  return prisma.like.delete({
    where: { postId_userId: { postId: Number(postId), userId: Number(userId) } },
    select: { id: true }
  });
}

export async function followUser({ followerId, followingId }) {
  return prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: Number(followerId),
        followingId: Number(followingId)
      }
    },
    create: { followerId: Number(followerId), followingId: Number(followingId) },
    update: {},
    select: { id: true, followerId: true, followingId: true }
  });
}

export async function unfollowUser({ followerId, followingId }) {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: Number(followerId),
        followingId: Number(followingId)
      }
    },
    select: { id: true, followerId: true, followingId: true }
  });
}

export async function listFollowingIds(followerId) {
  const follows = await prisma.follow.findMany({
    where: { followerId: Number(followerId) },
    select: { followingId: true }
  });

  return follows.map((follow) => follow.followingId);
}

export async function sendMessage({ senderId, receiverId, body }) {
  return prisma.message.create({
    data: { senderId: Number(senderId), receiverId: Number(receiverId), body },
    select: {
      id: true,
      body: true,
      createdAt: true,
      sender: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } }
    }
  });
}
