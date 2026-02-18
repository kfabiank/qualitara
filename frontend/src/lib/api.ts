import type { Comment, Post } from "@/types/jsonplaceholder";

const JPH = "https://jsonplaceholder.typicode.coms";

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

export async function createPost(input: {
  title: string;
  body: string;
  userId: number;
}): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create post");
  const data = (await res.json()) as { post: Post };
  return data.post;
}

export async function patchPost(
  id: number,
  input: Partial<{ title: string; body: string; userId: number }>
): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update post");
  const data = (await res.json()) as { post: Post };
  return data.post;
}
