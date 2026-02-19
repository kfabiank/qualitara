import type { Comment, Post } from "@/types/jsonplaceholder";

export type PaginatedPosts = {
  posts: Post[];
  meta: { page: number; limit: number; total: number };
};

export type PostWithComments = Post & { comments: Comment[] };

const UPSTREAM =
  process.env.BACKEND_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://jsonplaceholder.typicode.com";

const AUTH_HEADER = { Authorization: "Bearer demo-token" };

function serverUrl(path: string): string {
  if (UPSTREAM.includes("jsonplaceholder")) {
    return `${UPSTREAM}${path}`;
  }
  return `${UPSTREAM}/api${path}`;
}

async function parseServerPost(res: Response): Promise<Post> {
  const raw = await res.json();
  return (raw as { post?: Post }).post ?? (raw as Post);
}

async function parseServerPosts(res: Response): Promise<Post[]> {
  const raw = await res.json();
  return (raw as { posts?: Post[] }).posts ?? (raw as Post[]);
}

async function parseServerComments(res: Response): Promise<Comment[]> {
  const raw = await res.json();
  return (raw as { comments?: Comment[] }).comments ?? (raw as Comment[]);
}

export async function getPosts(search?: string): Promise<Post[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  if (typeof window !== "undefined") {
    const res = await fetch(`/api/posts${query}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load posts");
    return ((await res.json()) as { posts: Post[] }).posts;
  }

  const res = await fetch(serverUrl(`/posts${query}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  return parseServerPosts(res);
}

export async function getPostsNPlusOne(): Promise<PostWithComments[]> {
  const path = "/posts-n-plus-1";
  if (typeof window !== "undefined") {
    const res = await fetch(`/api${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load n+1 posts");
    return ((await res.json()) as { posts: PostWithComments[] }).posts;
  }

  const res = await fetch(serverUrl(path), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load n+1 posts");
  return ((await res.json()) as { posts: PostWithComments[] }).posts;
}

export async function getPostsBatched(): Promise<PostWithComments[]> {
  const path = "/posts-with-comments";
  if (typeof window !== "undefined") {
    const res = await fetch(`/api${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load batched posts");
    return ((await res.json()) as { posts: PostWithComments[] }).posts;
  }

  const res = await fetch(serverUrl(path), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load batched posts");
  return ((await res.json()) as { posts: PostWithComments[] }).posts;
}

export async function getPostsPaginated(page = 1, limit = 10): Promise<PaginatedPosts> {
  const query = `?page=${page}&limit=${limit}`;
  if (typeof window !== "undefined") {
    const res = await fetch(`/api/posts-paginated${query}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load paginated posts");
    return (await res.json()) as PaginatedPosts;
  }

  const res = await fetch(serverUrl(`/posts-paginated${query}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load paginated posts");
  return (await res.json()) as PaginatedPosts;
}

export async function getUserPosts(userId: number): Promise<Post[]> {
  if (typeof window !== "undefined") {
    const res = await fetch(`/api/users/${userId}/posts`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load user posts");
    return ((await res.json()) as { posts: Post[] }).posts;
  }

  const res = await fetch(serverUrl(`/users/${userId}/posts`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load user posts");
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
    headers: { "Content-Type": "application/json", ...AUTH_HEADER },
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
    headers: { "Content-Type": "application/json", ...AUTH_HEADER },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return ((await res.json()) as { post: Post }).post;
}

export async function putPost(
  id: number,
  input: { title: string; body: string; userId: number }
): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...AUTH_HEADER },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to replace post");
  return ((await res.json()) as { post: Post }).post;
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
    headers: AUTH_HEADER,
  });
  if (!res.ok) throw new Error("Failed to delete post");
}
