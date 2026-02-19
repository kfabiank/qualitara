import { NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  null;

export async function GET() {
  try {
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/posts-with-comments`
      : "https://jsonplaceholder.typicode.com/posts";

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error("Upstream error");

    const raw = await res.json();
    const posts = (raw as { posts?: unknown[] }).posts ?? (raw as unknown[]);
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch batched posts" }, { status: 500 });
  }
}
