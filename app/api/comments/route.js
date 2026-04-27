const repository = require("../../../lib/repository");

export async function GET() {
  const comments = await repository.getAllComments();
  return Response.json(comments);
}

export async function POST(request) {
  const body = await request.json();
  const comment = await repository.createComment(
    body.content,
    body.authorId,
    body.postId
  );
  return Response.json(comment);
}
