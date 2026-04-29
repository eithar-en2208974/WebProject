import { handleApiError, methodNotAllowed, parseId } from "../../../lib/api";
import { deletePost, getPostById, updatePost } from "../../../lib/repositories/postsRepository";

export default async function handler(req, res) {
  const id = parseId(req.query.id);
  if (!id) return res.status(400).json({ error: "Invalid post id" });

  try {
    if (req.method === "GET") {
      const post = await getPostById(id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.status(200).json({ post });
    }

    if (req.method === "PUT") {
      const post = await updatePost(id, req.body);
      return res.status(200).json({ post });
    }

    if (req.method === "DELETE") {
      const post = await deletePost(id);
      return res.status(200).json({ post });
    }

    return methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
  } catch (error) {
    return handleApiError(res, error);
  }
}
