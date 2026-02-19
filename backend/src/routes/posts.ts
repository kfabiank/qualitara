import { Router } from "express";
import { z } from "zod";
import {
  createPost,
  deletePost,
  fetchAllComments,
  fetchPost,
  fetchPostComments,
  fetchPosts,
  fetchUserPosts,
  patchPost,
  putPost,
  type Comment,
} from "../services/jsonplaceholder";
import { authGuard } from "../middleware/auth";
import { listPostsController } from "../controllers/posts.controller";

const CreatePostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.number().int().positive(),
});

const PatchPostSchema = CreatePostSchema.partial();
const PutPostSchema = CreatePostSchema;

export const postsRouter = Router();

// 1) Base list with optional search (implemented through controller/service)
postsRouter.get("/posts", listPostsController);

// 2) Paginated list
postsRouter.get("/posts-paginated", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  try {
    const posts = await fetchPosts();
    const start = (page - 1) * limit;
    const paginatedPosts = posts.slice(start, start + limit);
    return res.status(200).json({
      posts: paginatedPosts,
      meta: { page, limit, total: posts.length },
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch paginated posts" });
  }
});

// 3) N+1 demo (keep legacy /posts-n1 too)
postsRouter.get(["/posts-n-plus-1", "/posts-n1"], async (_req, res) => {
  try {
    const posts = await fetchPosts();
    const tasks = posts.slice(0, 10).map(async (post) => {
      const comments = await fetchPostComments(post.id);
      return { ...post, comments };
    });

    return res.status(200).json({ mode: "n+1", posts: await Promise.all(tasks) });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts-n-plus-1" });
  }
});

// 4) Batched alternative (no n+1)
postsRouter.get("/posts-with-comments", async (_req, res) => {
  try {
    const posts = (await fetchPosts()).slice(0, 10);
    const comments = await fetchAllComments();

    const byPostId = new Map<number, Comment[]>();
    for (const comment of comments) {
      const list = byPostId.get(comment.postId) ?? [];
      list.push(comment);
      byPostId.set(comment.postId, list);
    }

    const result = posts.map((post) => ({
      ...post,
      comments: byPostId.get(post.id) ?? [],
    }));

    return res.status(200).json({ mode: "batched", posts: result });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts-with-comments" });
  }
});

// 5) Posts by user id
postsRouter.get("/users/:id/posts", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid user id" });

  try {
    const posts = await fetchUserPosts(id);
    return res.status(200).json({ posts });
  } catch {
    return res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

// 6) Single post
postsRouter.get("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid post id" });

  try {
    const post = await fetchPost(id);
    return res.status(200).json({ post });
  } catch {
    return res.status(500).json({ error: "Failed to fetch post" });
  }
});

// 7) Post comments by id
postsRouter.get("/posts/:id/comments", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid post id" });

  try {
    const comments = await fetchPostComments(id);
    return res.status(200).json({ comments });
  } catch {
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// 8) Create post (protected by mock auth)
postsRouter.post("/posts", authGuard, async (req, res) => {
  const parsed = CreatePostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
  }

  try {
    const post = await createPost(parsed.data);
    return res.status(201).json({ post });
  } catch {
    return res.status(500).json({ error: "Failed to create post" });
  }
});

// 9) Patch post (protected)
postsRouter.patch("/posts/:id", authGuard, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid post id" });

  const parsed = PatchPostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
  }

  try {
    const post = await patchPost(id, parsed.data);
    return res.status(200).json({ post });
  } catch {
    return res.status(500).json({ error: "Failed to update post" });
  }
});

// 10) Put full update (protected)
postsRouter.put("/posts/:id", authGuard, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid post id" });

  const parsed = PutPostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
  }

  try {
    const post = await putPost(id, parsed.data);
    return res.status(200).json({ post });
  } catch {
    return res.status(500).json({ error: "Failed to replace post" });
  }
});

// 11) Delete post (protected)
postsRouter.delete("/posts/:id", authGuard, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid post id" });

  try {
    await deletePost(id);
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to delete post" });
  }
});
