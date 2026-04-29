import { handleApiError, methodNotAllowed, parseId } from "../../../lib/api";
import { deleteUser, getUserById, updateUser } from "../../../lib/repositories/usersRepository";

export default async function handler(req, res) {
  const id = parseId(req.query.id);
  if (!id) return res.status(400).json({ error: "Invalid user id" });

  try {
    if (req.method === "GET") {
      const user = await getUserById(id);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ user });
    }

    if (req.method === "PUT") {
      const user = await updateUser(id, req.body);
      return res.status(200).json({ user });
    }

    if (req.method === "DELETE") {
      const user = await deleteUser(id);
      return res.status(200).json({ user });
    }

    return methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
  } catch (error) {
    return handleApiError(res, error);
  }
}
