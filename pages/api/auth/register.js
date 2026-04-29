import { handleApiError, methodNotAllowed } from "../../../lib/api";
import { createUser } from "../../../lib/repositories/usersRepository";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { username, email, password, avatarUrl } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    const user = await createUser({ username, email, password, avatarUrl });
    return res.status(201).json({ user });
  } catch (error) {
    return handleApiError(res, error);
  }
}
