import { handleApiError, methodNotAllowed } from "../../../lib/api";
import { findUserByCredentials } from "../../../lib/repositories/usersRepository";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { email, password } = req.body;
    const user = await findUserByCredentials(email, password);
    if (!user) return res.status(401).json({ error: "Invalid login" });
    return res.status(200).json({ user });
  } catch (error) {
    return handleApiError(res, error);
  }
}
