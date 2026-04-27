module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/prisma.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { PrismaClient } = __turbopack_context__.r("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
const { PrismaBetterSqlite3 } = __turbopack_context__.r("[project]/node_modules/@prisma/adapter-better-sqlite3/dist/index.js [app-route] (ecmascript)");
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL
});
const prisma = new PrismaClient({
    adapter
});
module.exports = prisma;
}),
"[project]/lib/repository.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const prisma = __turbopack_context__.r("[project]/lib/prisma.js [app-route] (ecmascript)");
// POSTS
async function getAllPosts() {
    return prisma.post.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            author: true,
            comments: {
                include: {
                    author: true
                }
            },
            likes: true
        }
    });
}
async function createPost(content, authorId) {
    return prisma.post.create({
        data: {
            content,
            authorId
        }
    });
}
// USERS
async function getAllUsers() {
    return prisma.user.findMany({
        include: {
            posts: true,
            followers: true,
            following: true
        }
    });
}
// COMMENTS
async function getAllComments() {
    return prisma.comment.findMany({
        include: {
            author: true,
            post: true
        }
    });
}
async function createComment(content, authorId, postId) {
    return prisma.comment.create({
        data: {
            content,
            authorId,
            postId
        }
    });
}
// LIKES
async function getAllLikes() {
    return prisma.like.findMany();
}
async function createLike(userId, postId) {
    return prisma.like.create({
        data: {
            userId,
            postId
        }
    });
}
// FOLLOWS
async function getAllFollows() {
    return prisma.follow.findMany({
        include: {
            follower: true,
            following: true
        }
    });
}
async function createFollow(followerId, followingId) {
    return prisma.follow.create({
        data: {
            followerId,
            followingId
        }
    });
}
module.exports = {
    getAllPosts,
    createPost,
    getAllUsers,
    getAllComments,
    createComment,
    getAllLikes,
    createLike,
    getAllFollows,
    createFollow
};
}),
"[project]/app/api/likes/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
const repository = __turbopack_context__.r("[project]/lib/repository.js [app-route] (ecmascript)");
async function GET() {
    const likes = await repository.getAllLikes();
    return Response.json(likes);
}
async function POST(request) {
    const body = await request.json();
    const like = await repository.createLike(body.userId, body.postId);
    return Response.json(like);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.4y~.b._.js.map