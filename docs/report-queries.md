# Cirqle Database Queries for Report

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
