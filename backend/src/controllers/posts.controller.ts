import { Request, Response } from "express";
import * as postsService from "../services/posts.service";

export async function listPostsController(req: Request, res: Response) {
  const search = String(req.query.search ?? "").trim().toLowerCase();

  try {
    const posts = await postsService.listPosts(search);
    return res.status(200).json({ posts });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
}
