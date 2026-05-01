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

  const userData = [
    {
      username: "Nada",
      email: "nada@example.com",
      password: "123456",
      bio: "Computer science student building Cirqle for a web project.",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Maha",
      email: "maha@example.com",
      password: "123456",
      bio: "Testing the feed, comments, and profile features.",
      avatarUrl:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Omar",
      email: "omar@example.com",
      password: "123456",
      bio: "Interested in database queries and app statistics.",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Layla",
      email: "layla@example.com",
      password: "123456",
      bio: "Following classmates and sharing project updates.",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Yousef",
      email: "yousef@example.com",
      password: "123456",
      bio: "Preparing a smooth demo walkthrough.",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Aisha",
      email: "aisha@example.com",
      password: "123456",
      bio: "Sharing study notes and testing profile visibility.",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Sara",
      email: "sara@example.com",
      password: "123456",
      bio: "Trying likes, comments, and social interactions.",
      avatarUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Malak",
      email: "malak123@hotmail.com",
      password: "123456",
      bio: "New Cirqle member testing profile edits and posts.",
      avatarUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
    },
    {
      username: "Khalid",
      email: "khalid@example.com",
      password: "123456",
      bio: "Checking how follows change the news feed.",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80",
    },
  ];

  const createdUsers = await Promise.all(
    userData.map((user) => prisma.user.create({ data: user })),
  );

  const users = Object.fromEntries(
    createdUsers.map((user) => [user.username, user]),
  );

  const postData = [
    ["Nada", "Starting the semester with Cirqle and a fresh database."],
    ["Nada", "React pages are finally coming together for the profile demo."],
    ["Nada", "Testing the follow workflow before recording the walkthrough."],
    ["Maha", "Working on the Cirqle social media app with SQLite and Prisma."],
    [
      "Maha",
      "The news feed feels better when there are real classmates to follow.",
    ],
    [
      "Maha",
      "Added comments to make the conversation section easier to demonstrate.",
    ],
    ["Omar", "Database queries keep the feed data organized and fast."],
    ["Omar", "I like how Prisma can count comments and likes directly."],
    ["Layla", "Today I followed new classmates on Cirqle."],
    ["Layla", "Profile pages are useful for checking each user's posts."],
    ["Yousef", "Planning a quick demo script for the presentation."],
    [
      "Yousef",
      "Stats are more interesting now that the seed file has enough data.",
    ],
    [
      "Aisha",
      "Shared a study update and checked that it appears on my profile.",
    ],
    ["Aisha", "The average posts per user stat should change after new posts."],
    ["Sara", "Trying the like and comment buttons from another account."],
    ["Sara", "A good seeded database makes the platform easier to showcase."],
    ["Malak", "Setting up my profile and saving a bio on Cirqle."],
    ["Malak", "Testing that profile edits stay after refreshing the page."],
    ["Khalid", "Following people should make the feed feel personalized."],
    [
      "Khalid",
      "Recording a short video will make the live presentation smoother.",
    ],
    ["Nada", "Keeping one post for the cross-account visibility scenario."],
    ["Omar", "Message data is ready for testing private conversations."],
  ];

  const posts = await Promise.all(
    postData.map(([username, text]) =>
      prisma.post.create({
        data: {
          authorId: users[username].id,
          text,
        },
      }),
    ),
  );

  await prisma.comment.createMany({
    data: [
      {
        postId: posts[0].id,
        authorId: users.Maha.id,
        text: "Good luck with the demo!",
      },
      { postId: posts[0].id, authorId: users.Omar.id, text: "Nice update." },
      {
        postId: posts[1].id,
        authorId: users.Layla.id,
        text: "The profile page looks clear.",
      },
      {
        postId: posts[3].id,
        authorId: users.Nada.id,
        text: "The feed is working well.",
      },
      {
        postId: posts[4].id,
        authorId: users.Sara.id,
        text: "More accounts make it feel real.",
      },
      {
        postId: posts[6].id,
        authorId: users.Khalid.id,
        text: "The query examples are helpful.",
      },
      {
        postId: posts[8].id,
        authorId: users.Omar.id,
        text: "Follow feature is useful.",
      },
      {
        postId: posts[10].id,
        authorId: users.Aisha.id,
        text: "This will help with the video.",
      },
      {
        postId: posts[12].id,
        authorId: users.Yousef.id,
        text: "I can see this on your profile.",
      },
      {
        postId: posts[15].id,
        authorId: users.Maha.id,
        text: "Seed data saves so much time.",
      },
      {
        postId: posts[17].id,
        authorId: users.Nada.id,
        text: "Agreed. A short video will help.",
      },
      {
        postId: posts[19].id,
        authorId: users.Layla.id,
        text: "Messages are ready too.",
      },
    ],
  });

  await prisma.like.createMany({
    data: [
      { postId: posts[0].id, userId: users.Maha.id },
      { postId: posts[0].id, userId: users.Omar.id },
      { postId: posts[0].id, userId: users.Layla.id },
      { postId: posts[1].id, userId: users.Maha.id },
      { postId: posts[2].id, userId: users.Khalid.id },
      { postId: posts[3].id, userId: users.Nada.id },
      { postId: posts[3].id, userId: users.Yousef.id },
      { postId: posts[4].id, userId: users.Sara.id },
      { postId: posts[5].id, userId: users.Nada.id },
      { postId: posts[6].id, userId: users.Aisha.id },
      { postId: posts[6].id, userId: users.Khalid.id },
      { postId: posts[7].id, userId: users.Nada.id },
      { postId: posts[8].id, userId: users.Omar.id },
      { postId: posts[9].id, userId: users.Maha.id },
      { postId: posts[10].id, userId: users.Aisha.id },
      { postId: posts[11].id, userId: users.Sara.id },
      { postId: posts[12].id, userId: users.Yousef.id },
      { postId: posts[13].id, userId: users.Nada.id },
      { postId: posts[14].id, userId: users.Khalid.id },
      { postId: posts[15].id, userId: users.Maha.id },
      { postId: posts[16].id, userId: users.Nada.id },
      { postId: posts[17].id, userId: users.Sara.id },
      { postId: posts[18].id, userId: users.Maha.id },
      { postId: posts[19].id, userId: users.Omar.id },
      { postId: posts[20].id, userId: users.Omar.id },
      { postId: posts[21].id, userId: users.Layla.id },
    ],
  });

  await prisma.follow.createMany({
    data: [
      { followerId: users.Nada.id, followingId: users.Maha.id },
      { followerId: users.Nada.id, followingId: users.Omar.id },
      { followerId: users.Maha.id, followingId: users.Nada.id },
      { followerId: users.Maha.id, followingId: users.Aisha.id },
      { followerId: users.Omar.id, followingId: users.Nada.id },
      { followerId: users.Omar.id, followingId: users.Khalid.id },
      { followerId: users.Layla.id, followingId: users.Nada.id },
      { followerId: users.Layla.id, followingId: users.Maha.id },
      { followerId: users.Yousef.id, followingId: users.Nada.id },
      { followerId: users.Yousef.id, followingId: users.Sara.id },
      { followerId: users.Aisha.id, followingId: users.Maha.id },
      { followerId: users.Aisha.id, followingId: users.Layla.id },
      { followerId: users.Sara.id, followingId: users.Omar.id },
      { followerId: users.Sara.id, followingId: users.Aisha.id },
      { followerId: users.Malak.id, followingId: users.Nada.id },
      { followerId: users.Malak.id, followingId: users.Maha.id },
      { followerId: users.Khalid.id, followingId: users.Nada.id },
      { followerId: users.Khalid.id, followingId: users.Yousef.id },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        senderId: users.Nada.id,
        receiverId: users.Maha.id,
        body: "Can you test the login page?",
      },
      {
        senderId: users.Maha.id,
        receiverId: users.Nada.id,
        body: "Yes, I will test it today.",
      },
      {
        senderId: users.Omar.id,
        receiverId: users.Nada.id,
        body: "The profile page needs counts.",
      },
      {
        senderId: users.Layla.id,
        receiverId: users.Maha.id,
        body: "The database examples look good.",
      },
      {
        senderId: users.Yousef.id,
        receiverId: users.Nada.id,
        body: "I wrote a quick demo checklist.",
      },
      {
        senderId: users.Aisha.id,
        receiverId: users.Sara.id,
        body: "Can you like my latest post?",
      },
      {
        senderId: users.Sara.id,
        receiverId: users.Aisha.id,
        body: "Done. I also added a comment.",
      },
      {
        senderId: users.Khalid.id,
        receiverId: users.Omar.id,
        body: "Follow me so my posts appear in your feed.",
      },
      {
        senderId: users.Maha.id,
        receiverId: users.Layla.id,
        body: "Let's record the stats changing after a post.",
      },
      {
        senderId: users.Nada.id,
        receiverId: users.Yousef.id,
        body: "The seed file now has enough sample data.",
      },
      {
        senderId: users.Malak.id,
        receiverId: users.Nada.id,
        body: "My profile bio is ready to test.",
      },
      {
        senderId: users.Omar.id,
        receiverId: users.Khalid.id,
        body: "The most-liked post stat is ready to show.",
      },
      {
        senderId: users.Layla.id,
        receiverId: users.Sara.id,
        body: "I checked the profile visibility scenario.",
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: users.Nada.id, text: "Maha liked your post." },
      { userId: users.Nada.id, text: "Omar commented on your post." },
      { userId: users.Maha.id, text: "Nada followed you.", isRead: true },
      { userId: users.Omar.id, text: "Sara followed you." },
      { userId: users.Layla.id, text: "Aisha followed you." },
      { userId: users.Yousef.id, text: "Khalid followed you.", isRead: true },
      { userId: users.Aisha.id, text: "Sara liked your post." },
      { userId: users.Sara.id, text: "Yousef followed you." },
      { userId: users.Malak.id, text: "Nada followed you." },
      { userId: users.Khalid.id, text: "Omar liked your post." },
    ],
  });

  console.log(
    `Seeded ${createdUsers.length} users, ${posts.length} posts, 12 comments, 26 likes, 18 follows, 13 messages, and 10 notifications.`,
  );
  console.log(
    "Demo logins use password 123456, for example nada@example.com, maha@example.com, and malak123@hotmail.com.",
  );
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
