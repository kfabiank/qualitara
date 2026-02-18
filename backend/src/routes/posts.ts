import { Router } from "express";
import { fetchPost, fetchPostComments, fetchPosts } from "../services/jsonplaceholder";

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
