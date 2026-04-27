const repository = require("../../../lib/repository");

export async function GET() {
  const posts = await repository.getAllPosts();
  return Response.json(posts);
}

export async function POST(request) {
  const body = await request.json();
  const post = await repository.createPost(body.content, body.authorId);
  return Response.json(post);
}
