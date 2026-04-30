export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed);
  return res.status(405).json({ error: "Method not allowed" });
}

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function handleApiError(res, error) {
  if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
    return res.status(400).json({ error: "An account with this email already exists. Please log in instead." });
  }

  const message = error?.message || "Server error";
  const status = message.includes("not found") ? 404 : 400;
  return res.status(status).json({ error: message });
}
