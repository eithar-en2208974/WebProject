const repository = require("../../../lib/repository");

export async function GET() {
  const follows = await repository.getAllFollows();
  return Response.json(follows);
}

export async function POST(request) {
  const body = await request.json();
  const follow = await repository.createFollow(
    body.followerId,
    body.followingId
  );
  return Response.json(follow);
}
