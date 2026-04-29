import { handleApiError, methodNotAllowed } from "../../lib/api";
import { getPlatformStats } from "../../lib/repositories/statsRepository";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const stats = await getPlatformStats();
    return res.status(200).json({ stats });
  } catch (error) {
    return handleApiError(res, error);
  }
}
