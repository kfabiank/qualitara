import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_BASE =
  process.env.BACKEND_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:4000";

const CommentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
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
    const res = await fetch(`${BACKEND_BASE}/api/posts/${id}/comments`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error("Upstream error");
    const data = (await res.json()) as { comments: unknown };
    const comments = z.array(CommentSchema).parse(data.comments);
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
