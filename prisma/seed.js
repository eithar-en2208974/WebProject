const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({ data: { username: "Nada", email: "nada@example.com", password: "123456" } }),
    prisma.user.create({ data: { username: "Maha", email: "maha@example.com", password: "123456" } }),
    prisma.user.create({ data: { username: "Omar", email: "omar@example.com", password: "123456" } }),
    prisma.user.create({ data: { username: "Layla", email: "layla@example.com", password: "123456" } })
  ]);

  const posts = await Promise.all([
    prisma.post.create({ data: { authorId: users[0].id, text: "Starting the semester with Cirqle." } }),
    prisma.post.create({ data: { authorId: users[1].id, text: "Working on the Cirqle social media app." } }),
    prisma.post.create({ data: { authorId: users[2].id, text: "Database queries keep the feed data organized." } }),
    prisma.post.create({ data: { authorId: users[0].id, text: "React pages are coming together." } }),
    prisma.post.create({ data: { authorId: users[3].id, text: "Today I followed new classmates on Cirqle." } }),
    prisma.post.create({ data: { authorId: users[1].id, text: "SQLite and Prisma are simple for project demos." } })
  ]);

  await prisma.comment.createMany({
    data: [
      { postId: posts[0].id, authorId: users[1].id, text: "Good luck!" },
      { postId: posts[0].id, authorId: users[2].id, text: "Nice update." },
      { postId: posts[1].id, authorId: users[0].id, text: "The feed is working." },
      { postId: posts[2].id, authorId: users[3].id, text: "Profile page next." },
      { postId: posts[4].id, authorId: users[2].id, text: "Follow feature is useful." }
    ]
  });

  await prisma.like.createMany({
    data: [
      { postId: posts[0].id, userId: users[1].id },
      { postId: posts[0].id, userId: users[2].id },
      { postId: posts[1].id, userId: users[0].id },
      { postId: posts[1].id, userId: users[3].id },
      { postId: posts[2].id, userId: users[0].id },
      { postId: posts[3].id, userId: users[1].id },
      { postId: posts[4].id, userId: users[0].id },
      { postId: posts[5].id, userId: users[2].id }
    ]
  });

  await prisma.follow.createMany({
    data: [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
      { followerId: users[1].id, followingId: users[0].id },
      { followerId: users[2].id, followingId: users[0].id },
      { followerId: users[3].id, followingId: users[0].id },
      { followerId: users[3].id, followingId: users[1].id }
    ]
  });

  await prisma.message.createMany({
    data: [
      { senderId: users[0].id, receiverId: users[1].id, body: "Can you test the login page?" },
      { senderId: users[1].id, receiverId: users[0].id, body: "Yes, I will test it today." },
      { senderId: users[2].id, receiverId: users[0].id, body: "The profile page needs counts." },
      { senderId: users[3].id, receiverId: users[1].id, body: "The database examples look good." }
    ]
  });

  await prisma.notification.createMany({
    data: [
      { userId: users[0].id, text: "Maha liked your post." },
      { userId: users[0].id, text: "Omar commented on your post." },
      { userId: users[1].id, text: "Nada followed you.", isRead: true },
      { userId: users[2].id, text: "Layla commented on a post." }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
