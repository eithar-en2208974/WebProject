import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const id = Number(req.query.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid comment id" });
  }

  if (req.method === "DELETE") {
    const comment = await prisma.comment.delete({
      where: { id },
    });

    return res.status(200).json({ comment });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
