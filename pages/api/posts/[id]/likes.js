import { handleApiError, methodNotAllowed, parseId } from "../../../../lib/api";
import { likePost, unlikePost } from "../../../../lib/repositories/interactionsRepository";

export default async function handler(req, res) {
  const postId = parseId(req.query.id);
  if (!postId) return res.status(400).json({ error: "Invalid post id" });

  try {
    if (req.method === "POST") {
      const like = await likePost({ postId, userId: req.body.userId });
      return res.status(201).json({ like });
    }

    if (req.method === "DELETE") {
      const like = await unlikePost({ postId, userId: req.body.userId });
      return res.status(200).json({ like });
    }

    return methodNotAllowed(res, ["POST", "DELETE"]);
  } catch (error) {
    return handleApiError(res, error);
  }
}
