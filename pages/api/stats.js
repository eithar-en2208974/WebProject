const repository = require("../../lib/repository");

export default async function handler(req, res) {
  try {
    const stats = await repository.getPlatformStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}