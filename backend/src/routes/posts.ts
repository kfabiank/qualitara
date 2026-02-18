import { Router } from "express";
import { z } from "zod";
import { fetchPost, fetchPostComments, fetchPosts, createPost, patchPost } from "../services/jsonplaceholder";

const CreatePostSchema = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

const PatchPostSchema = CreatePostSchema.partial();

export const postsRouter = Router();

postsRouter.get("/posts", async (_req, res) => {
  try {
    const posts = await fetchPosts();
    return res.status(200).json({ posts });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

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

postsRouter.post("/posts", async (req, res) => {
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

postsRouter.patch("/posts/:id", async (req, res) => {
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
