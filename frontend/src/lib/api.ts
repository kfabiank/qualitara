import type { Comment, Post } from "@/types/jsonplaceholder";

function getApiUrl(path: string): string {
  if (typeof window !== "undefined") return path;
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  return `${base}${path}`;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(getApiUrl("/api/posts"), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  const data = (await res.json()) as { posts: Post[] };
  return data.posts;
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(getApiUrl(`/api/posts/${id}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load post");
  const data = (await res.json()) as { post: Post };
  return data.post;
}

export async function getPostComments(id: number): Promise<Comment[]> {
  const res = await fetch(getApiUrl(`/api/posts/${id}/comments`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load comments");
  const data = (await res.json()) as { comments: Comment[] };
  return data.comments;
}

export async function createPost(input: {
  title: string;
  body: string;
  userId: number;
}): Promise<Post> {
  const res = await fetch(getApiUrl("/api/posts"), {
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
  const res = await fetch(getApiUrl(`/api/posts/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update post");
  const data = (await res.json()) as { post: Post };
  return data.post;
}
