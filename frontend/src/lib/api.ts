import type { Comment, Post } from "@/types/jsonplaceholder";

const JPH = "https://jsonplaceholder.typicode.com";

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${JPH}/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json() as Promise<Post[]>;
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${JPH}/posts/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load post");
  return res.json() as Promise<Post>;
}

export async function getPostComments(id: number): Promise<Comment[]> {
  const res = await fetch(`${JPH}/posts/${id}/comments`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load comments");
  return res.json() as Promise<Comment[]>;
}
