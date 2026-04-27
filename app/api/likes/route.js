const repository = require("../../../lib/repository");

export async function GET() {
  const likes = await repository.getAllLikes();
  return Response.json(likes);
}

export async function POST(request) {
  const body = await request.json();
  const like = await repository.createLike(body.userId, body.postId);
  return Response.json(like);
}
