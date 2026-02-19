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

export async function GET(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? 10)));

  try {
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/posts-paginated?page=${page}&limit=${limit}`
      : `https://jsonplaceholder.typicode.com/posts`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error("Upstream error");

    if (BACKEND_BASE) {
      const data = (await res.json()) as {
        posts: unknown;
        meta?: { page: number; limit: number; total: number };
        total?: number;
      };

      const posts = z.array(PostSchema).parse(data.posts);
      const total = data.meta?.total ?? data.total ?? posts.length;
      return NextResponse.json({ posts, meta: { page, limit, total } });
    }

    const allPosts = z.array(PostSchema).parse(await res.json());
    const start = (page - 1) * limit;
    const posts = allPosts.slice(start, start + limit);
    return NextResponse.json({ posts, meta: { page, limit, total: allPosts.length } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch paginated posts" }, { status: 500 });
  }
}
