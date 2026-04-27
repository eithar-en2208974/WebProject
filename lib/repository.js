const prisma = require("./prisma");

// POSTS
async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      comments: {
        include: { author: true },
      },
      likes: true,
    },
  });
}

async function createPost(content, authorId) {
  return prisma.post.create({
    data: { content, authorId },
  });
}

// USERS
async function getAllUsers() {
  return prisma.user.findMany({
    include: {
      posts: true,
      followers: true,
      following: true,
    },
  });
}

// COMMENTS
async function getAllComments() {
  return prisma.comment.findMany({
    include: {
      author: true,
      post: true,
    },
  });
}

async function createComment(content, authorId, postId) {
  return prisma.comment.create({
    data: { content, authorId, postId },
  });
}

// LIKES
async function getAllLikes() {
  return prisma.like.findMany();
}

async function createLike(userId, postId) {
  return prisma.like.create({
    data: { userId, postId },
  });
}

// FOLLOWS
async function getAllFollows() {
  return prisma.follow.findMany({
    include: {
      follower: true,
      following: true,
    },
  });
}

async function createFollow(followerId, followingId) {
  return prisma.follow.create({
    data: { followerId, followingId },
  });
}

module.exports = {
  getAllPosts,
  createPost,
  getAllUsers,
  getAllComments,
  createComment,
  getAllLikes,
  createLike,
  getAllFollows,
  createFollow,
};
