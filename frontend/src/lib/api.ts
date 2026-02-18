import type { Comment, Post } from "@/types/jsonplaceholder";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000");

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/api/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  const data = (await res.json()) as { posts: Post[] };
  return data.posts;
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/api/posts/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load post");
  const data = (await res.json()) as { post: Post };
  return data.post;
}

export async function getPostComments(id: number): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/api/posts/${id}/comments`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load comments");
  const data = (await res.json()) as { comments: Comment[] };
  return data.comments;
}
