import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) throw new Error("Upstream error");
    const data = await res.json();
    const comments = z.array(CommentSchema).parse(data);
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
