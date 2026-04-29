import { prisma } from "../prisma";

export async function createUser(data) {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
      avatarUrl: data.avatarUrl || null
    },
    select: userPublicSelect()
  });
}

export async function findUserByCredentials(email, password) {
  return prisma.user.findFirst({
    where: { email, password },
    select: userPublicSelect()
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      ...userPublicSelect(),
      _count: { select: { posts: true, followers: true, following: true } }
    }
  });
}

export async function listUsers({ search = "", sortBy = "createdAt", order = "desc" } = {}) {
  const allowedSorts = new Set(["createdAt", "username", "email"]);
  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } }
          ]
        }
      : undefined,
    orderBy: { [allowedSorts.has(sortBy) ? sortBy : "createdAt"]: order === "asc" ? "asc" : "desc" },
    select: {
      ...userPublicSelect(),
      _count: { select: { posts: true, followers: true, following: true } }
    }
  });
}

export async function updateUser(id, data) {
  const updateData = {};
  if (data.username !== undefined) updateData.username = data.username;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

  return prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
    select: userPublicSelect()
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
    select: userPublicSelect()
  });
}

function userPublicSelect() {
  return {
    id: true,
    username: true,
    email: true,
    avatarUrl: true,
    createdAt: true
  };
}
