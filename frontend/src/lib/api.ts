import type { Comment, Post } from "@/types/jsonplaceholder";

// Server-side: call the upstream directly (backend or JSONPlaceholder).
// Client-side: call the Next.js API routes (relative URLs).
const UPSTREAM =
  process.env.BACKEND_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  null;

function serverUrl(path: string): string {
  if (UPSTREAM) return `${UPSTREAM}/api${path}`;
  return `https://jsonplaceholder.typicode.com${path}`;
}

async function parseServerPost(res: Response): Promise<Post> {
  const raw = await res.json();
  return UPSTREAM ? (raw as { post: Post }).post : (raw as Post);
}

async function parseServerPosts(res: Response): Promise<Post[]> {
  const raw = await res.json();
  return UPSTREAM ? (raw as { posts: Post[] }).posts : (raw as Post[]);
}

async function parseServerComments(res: Response): Promise<Comment[]> {
  const raw = await res.json();
  return UPSTREAM ? (raw as { comments: Comment[] }).comments : (raw as Comment[]);
}

export async function getPosts(): Promise<Post[]> {
  if (typeof window !== "undefined") {
    const res = await fetch("/api/posts", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load posts");
    return ((await res.json()) as { posts: Post[] }).posts;
  }
  const res = await fetch(serverUrl("/posts"), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  return parseServerPosts(res);
}

export async function getPost(id: number): Promise<Post> {
  if (typeof window !== "undefined") {
    const res = await fetch(`/api/posts/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load post");
    return ((await res.json()) as { post: Post }).post;
  }
  const res = await fetch(serverUrl(`/posts/${id}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load post");
  return parseServerPost(res);
}

export async function getPostComments(id: number): Promise<Comment[]> {
  if (typeof window !== "undefined") {
    const res = await fetch(`/api/posts/${id}/comments`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load comments");
    return ((await res.json()) as { comments: Comment[] }).comments;
  }
  const res = await fetch(serverUrl(`/posts/${id}/comments`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load comments");
  return parseServerComments(res);
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
  return ((await res.json()) as { post: Post }).post;
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
  return ((await res.json()) as { post: Post }).post;
}
