import { handleApiError, methodNotAllowed } from "../../../lib/api";
import { createPost, listPosts } from "../../../lib/repositories/postsRepository";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const posts = await listPosts(req.query);
      return res.status(200).json({ posts });
    }

    if (req.method === "POST") {
      const { authorId, text } = req.body;
      if (!authorId || !text) return res.status(400).json({ error: "authorId and text are required" });
      const post = await createPost({ authorId, text });
      return res.status(201).json({ post });
    }

    return methodNotAllowed(res, ["GET", "POST"]);
  } catch (error) {
    return handleApiError(res, error);
  }
}
