import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  const postId = Number(req.query.id);
  const { userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ error: "postId and userId required" });
  }

  try {
    // Check if like exists
    const existing = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existing) {
      // UNLIKE
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      return res.status(200).json({ message: "Unliked" });
    } else {
      // LIKE
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });

      return res.status(201).json({ message: "Liked" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
