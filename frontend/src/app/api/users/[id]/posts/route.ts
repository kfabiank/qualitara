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

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/users/${id}/posts`
      : `https://jsonplaceholder.typicode.com/users/${id}/posts`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error("Upstream error");

    const raw = await res.json();
    const posts = z.array(PostSchema).parse(
      BACKEND_BASE ? (raw as { posts: unknown }).posts : raw
    );

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 });
  }
}
