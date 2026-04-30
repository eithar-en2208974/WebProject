# Cirqle Database Queries for Report

## First-Time Setup Instructions

These steps explain how to run Cirqle on a new computer.

1. Install Node.js from https://nodejs.org if it is not already installed.
2. Open a terminal in the project folder.
3. Install the project dependencies:

```bash
npm install
```

4. Make sure the `.env` file exists in the project root and contains this database URL:

```bash
DATABASE_URL="file:dev.db"
```

5. Create the SQLite database from the migration file:

```bash
npm run db:create
```

6. Generate/update the Prisma database tables from the schema:

```bash
npm run db:push
```

7. Populate the database with sample users, posts, follows, likes, comments, messages, and notifications:

```bash
npm run db:seed
```

8. Start the development server:

```bash
npm run dev
```

9. Open the app in a browser at:

```text
http://localhost:3000
```

Seeded demo accounts all use the password `123456`. Useful logins are `nada@example.com`, `maha@example.com`, `omar@example.com`, `layla@example.com`, `yousef@example.com`, `aisha@example.com`, `sara@example.com`, `malak123@hotmail.com`, and `khalid@example.com`.

## Demo Video Checklist

Scenario A: Log in as `nada@example.com`, share two posts, open the profile page, confirm both posts appear, delete one post from the feed, follow another user from Find People, show that their posts appear in the News Feed, then unfollow that user and show that their posts disappear from the News Feed.

Scenario B: Log out, log in as `maha@example.com`, open Nada's profile from a post or by visiting `profile.html?userId=1`, and confirm Nada's remaining post is still visible.

Scenario C: Open `/stats`, show the current statistics, create a new post or like/comment, then refresh `/stats` to show that totals and averages update.

These are the main Prisma Client queries used by the repository and API layer. Filtering, sorting, counting, and limiting are expressed in the Prisma query so they run in the database instead of filtering full tables in JavaScript.

## User CRUD

Create user:

```js
prisma.user.create({
  data: { username, email, password, avatarUrl },
  select: { id: true, username: true, email: true, avatarUrl: true, createdAt: true }
});
```

Find user by login credentials:

```js
prisma.user.findFirst({
  where: { email, password },
  select: { id: true, username: true, email: true, avatarUrl: true, createdAt: true }
});
```

Search and sort users in the database:

```js
prisma.user.findMany({
  where: {
    OR: [
      { username: { contains: search } },
      { email: { contains: search } }
    ]
  },
  orderBy: { username: "asc" },
  select: {
    id: true,
    username: true,
    email: true,
    _count: { select: { posts: true, followers: true, following: true } }
  }
});
```

## Post CRUD

Create post:

```js
prisma.post.create({
  data: { authorId, text },
  select: { id: true, text: true, createdAt: true, authorId: true }
});
```

Filter posts by author, search text, sort newest first, and limit rows:

```js
prisma.post.findMany({
  where: {
    authorId: Number(authorId),
    text: { contains: search }
  },
  orderBy: { createdAt: "desc" },
  take: 50,
  select: {
    id: true,
    text: true,
    createdAt: true,
    author: { select: { id: true, username: true } },
    comments: {
      orderBy: { createdAt: "asc" },
      select: { id: true, text: true, author: { select: { username: true } } }
    },
    _count: { select: { likes: true, comments: true } }
  }
});
```

Update post:

```js
prisma.post.update({
  where: { id: Number(id) },
  data: { text },
  select: { id: true, text: true, createdAt: true }
});
```

Delete post:

```js
prisma.post.delete({
  where: { id: Number(id) },
  select: { id: true }
});
```

## Interactions

Add a comment:

```js
prisma.comment.create({
  data: { postId, authorId, text },
  select: { id: true, text: true, createdAt: true, postId: true }
});
```

Like a post only once per user:

```js
prisma.like.upsert({
  where: { postId_userId: { postId, userId } },
  create: { postId, userId },
  update: {},
  select: { id: true, postId: true, userId: true }
});
```

Follow a user only once:

```js
prisma.follow.upsert({
  where: { followerId_followingId: { followerId, followingId } },
  create: { followerId, followingId },
  update: {},
  select: { id: true, followerId: true, followingId: true }
});
```
