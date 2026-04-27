const repository = require("../../../lib/repository");

export async function GET() {
  const users = await repository.getAllUsers();
  return Response.json(users);
}
