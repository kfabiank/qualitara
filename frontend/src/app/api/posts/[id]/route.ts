import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_BASE =
  process.env.BACKEND_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  null;

const AUTH_HEADER = { Authorization: "Bearer demo-token" };

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

const PutPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.number().int().positive(),
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
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/posts/${id}`
      : `https://jsonplaceholder.typicode.com/posts/${id}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error("Upstream error");
    const raw = await res.json();
    const post = PostSchema.parse(BACKEND_BASE ? (raw as { post: unknown }).post : raw);
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
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/posts/${id}`
      : `https://jsonplaceholder.typicode.com/posts/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(BACKEND_BASE ? AUTH_HEADER : {}) },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) throw new Error("Upstream error");
    const raw = await res.json();
    const post = PostSchema.parse(BACKEND_BASE ? (raw as { post: unknown }).post : raw);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const parsed = PutPostSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/posts/${id}`
      : `https://jsonplaceholder.typicode.com/posts/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(BACKEND_BASE ? AUTH_HEADER : {}) },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) throw new Error("Upstream error");
    const raw = await res.json();
    const post = PostSchema.parse(BACKEND_BASE ? (raw as { post: unknown }).post : raw);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Failed to replace post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  try {
    const url = BACKEND_BASE
      ? `${BACKEND_BASE}/api/posts/${id}`
      : `https://jsonplaceholder.typicode.com/posts/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: BACKEND_BASE ? AUTH_HEADER : undefined,
    });
    if (!res.ok) throw new Error("Upstream error");
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
