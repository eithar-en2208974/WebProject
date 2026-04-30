import { handleApiError, methodNotAllowed } from "../../lib/api";
import {
  followUser,
  listFollowingIds,
  unfollowUser
} from "../../lib/repositories/interactionsRepository";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { followerId } = req.query;
      if (!followerId) return res.status(400).json({ error: "followerId is required" });
      const followingIds = await listFollowingIds(followerId);
      return res.status(200).json({ followingIds });
    }

    if (req.method === "POST") {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) {
        return res.status(400).json({ error: "followerId and followingId are required" });
      }
      const follow = await followUser({ followerId, followingId });
      return res.status(201).json({ follow });
    }

    if (req.method === "DELETE") {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) {
        return res.status(400).json({ error: "followerId and followingId are required" });
      }
      const follow = await unfollowUser({ followerId, followingId });
      return res.status(200).json({ follow });
    }

    return methodNotAllowed(res, ["GET", "POST", "DELETE"]);
  } catch (error) {
    return handleApiError(res, error);
  }
}
