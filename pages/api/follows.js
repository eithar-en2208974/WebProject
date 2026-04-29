import { handleApiError, methodNotAllowed } from "../../lib/api";
import { followUser } from "../../lib/repositories/interactionsRepository";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId) {
      return res.status(400).json({ error: "followerId and followingId are required" });
    }
    const follow = await followUser({ followerId, followingId });
    return res.status(201).json({ follow });
  } catch (error) {
    return handleApiError(res, error);
  }
}
