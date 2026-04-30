import { handleApiError, methodNotAllowed, parseId } from "../../../../lib/api";
import { addComment } from "../../../../lib/repositories/interactionsRepository";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const postId = parseId(req.query.id);
  if (!postId) return res.status(400).json({ error: "Invalid post id" });

  try {
    const { authorId, text } = req.body;
    if (!authorId || !text)
      return res.status(400).json({ error: "authorId and text are required" });
    const comment = await addComment({ postId, authorId, text });
    return res.status(201).json({ comment });
  } catch (error) {
    return handleApiError(res, error);
  }
}
