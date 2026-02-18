import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_BASE =
  process.env.BACKEND_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  null;

const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

const CreatePostSchema = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

export async function GET() {
  try {
    let posts;
    if (BACKEND_BASE) {
      const res = await fetch(`${BACKEND_BASE}/api/posts`, { next: { revalidate: 0 } });
      if (!res.ok) throw new Error("Upstream error");
      const data = (await res.json()) as { posts: unknown };
      posts = z.array(PostSchema).parse(data.posts);
    } else {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", { next: { revalidate: 0 } });
      if (!res.ok) throw new Error("Upstream error");
      posts = z.array(PostSchema).parse(await res.json());
    }
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const parsed = CreatePostSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/posts`
      : "https://jsonplaceholder.typicode.com/posts";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) throw new Error("Upstream error");
    const raw = await res.json();
    const post = PostSchema.parse(BACKEND_BASE ? (raw as { post: unknown }).post : raw);
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
