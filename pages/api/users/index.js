import { handleApiError, methodNotAllowed } from "../../../lib/api";
import { listUsers } from "../../../lib/repositories/usersRepository";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const users = await listUsers(req.query);
    return res.status(200).json({ users });
  } catch (error) {
    return handleApiError(res, error);
  }
}
