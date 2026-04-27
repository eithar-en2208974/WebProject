require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear old data first
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const maryam = await prisma.user.create({
    data: {
      username: "maryam",
      email: "maryam@test.com",
      password: "123456",
      bio: "Architecture and engineering student who enjoys sharing ideas.",
      profilePicture:
        "https://i.pinimg.com/736x/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg",
    },
  });

  const lana = await prisma.user.create({
    data: {
      username: "lana",
      email: "lana@test.com",
      password: "123456",
      bio: "Coffee lover and design enthusiast.",
      profilePicture:
        "https://i.pinimg.com/736x/7c/16/15/7c1615b7f43bfb4d2b9607df46aa2d14.jpg",
    },
  });

  const noora = await prisma.user.create({
    data: {
      username: "noora",
      email: "noora@test.com",
      password: "123456",
      bio: "Sharing daily moments and campus life.",
      profilePicture:
        "https://i.pinimg.com/736x/9f/86/6f/9f866f6471df9f1a21973c60cf9c71d5.jpg",
    },
  });

  const sara = await prisma.user.create({
    data: {
      username: "sara",
      email: "sara@test.com",
      password: "123456",
      bio: "Interested in technology, photography, and social media.",
      profilePicture:
        "https://i.pinimg.com/736x/8d/5f/56/8d5f56359d92c8b6a771fb0d4b5ab52f.jpg",
    },
  });

  const ahmed = await prisma.user.create({
    data: {
      username: "ahmed",
      email: "ahmed@test.com",
      password: "123456",
      bio: "Computer science student and web developer.",
      profilePicture:
        "https://i.pinimg.com/736x/13/88/6d/13886d3a7a7527ad2b5cc8e2e3e28f8f.jpg",
    },
  });

  const users = [maryam, lana, noora, sara, ahmed];

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      content: "Excited to start using Cirqle and connect with everyone!",
      authorId: maryam.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: "Working on a new web development project today.",
      authorId: ahmed.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      content: "Morning coffee and planning my tasks for the week.",
      authorId: lana.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      content: "Campus life has been busy but productive.",
      authorId: noora.id,
    },
  });

  const post5 = await prisma.post.create({
    data: {
      content: "Trying to improve my photography skills this weekend.",
      authorId: sara.id,
    },
  });

  const post6 = await prisma.post.create({
    data: {
      content: "Database setup is finally working with Prisma and SQLite.",
      authorId: maryam.id,
    },
  });

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: "Welcome to Cirqle!",
        authorId: lana.id,
        postId: post1.id,
      },
      {
        content: "Good luck with your project.",
        authorId: maryam.id,
        postId: post2.id,
      },
      {
        content: "That sounds relaxing.",
        authorId: sara.id,
        postId: post3.id,
      },
      {
        content: "Same here, this week is very busy.",
        authorId: ahmed.id,
        postId: post4.id,
      },
      {
        content: "Your photos are always nice.",
        authorId: noora.id,
        postId: post5.id,
      },
      {
        content: "Great progress!",
        authorId: ahmed.id,
        postId: post6.id,
      },
    ],
  });

  // Create likes
  await prisma.like.createMany({
    data: [
      { userId: lana.id, postId: post1.id },
      { userId: noora.id, postId: post1.id },
      { userId: sara.id, postId: post1.id },

      { userId: maryam.id, postId: post2.id },
      { userId: lana.id, postId: post2.id },

      { userId: ahmed.id, postId: post3.id },
      { userId: sara.id, postId: post3.id },

      { userId: maryam.id, postId: post4.id },
      { userId: lana.id, postId: post4.id },

      { userId: noora.id, postId: post5.id },
      { userId: ahmed.id, postId: post5.id },

      { userId: lana.id, postId: post6.id },
      { userId: sara.id, postId: post6.id },
      { userId: noora.id, postId: post6.id },
    ],
  });

  // Create follows
  await prisma.follow.createMany({
    data: [
      { followerId: maryam.id, followingId: lana.id },
      { followerId: maryam.id, followingId: ahmed.id },

      { followerId: lana.id, followingId: maryam.id },
      { followerId: lana.id, followingId: sara.id },

      { followerId: noora.id, followingId: maryam.id },
      { followerId: noora.id, followingId: lana.id },

      { followerId: sara.id, followingId: noora.id },
      { followerId: sara.id, followingId: maryam.id },

      { followerId: ahmed.id, followingId: maryam.id },
      { followerId: ahmed.id, followingId: sara.id },
    ],
  });

  console.log("Database seeded successfully!");
  console.log(`Users created: ${users.length}`);
  console.log("Posts created: 6");
  console.log("Comments created: 6");
  console.log("Likes created: 14");
  console.log("Follows created: 10");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  