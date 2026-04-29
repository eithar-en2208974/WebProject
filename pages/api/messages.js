import { handleApiError, methodNotAllowed } from "../../lib/api";
import { sendMessage } from "../../lib/repositories/interactionsRepository";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { senderId, receiverId, body } = req.body;
    if (!senderId || !receiverId || !body) {
      return res.status(400).json({ error: "senderId, receiverId, and body are required" });
    }
    const message = await sendMessage({ senderId, receiverId, body });
    return res.status(201).json({ message });
  } catch (error) {
    return handleApiError(res, error);
  }
}
