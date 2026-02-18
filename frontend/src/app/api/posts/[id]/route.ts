import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_BASE =
  process.env.BACKEND_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:4000";

const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

const PatchPostSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  userId: z.number().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_BASE}/api/posts/${id}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error("Upstream error");
    const data = (await res.json()) as { post: unknown };
    const post = PostSchema.parse(data.post);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const parsed = PatchPostSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_BASE}/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) throw new Error("Upstream error");
    const data = (await res.json()) as { post: unknown };
    const post = PostSchema.parse(data.post);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
