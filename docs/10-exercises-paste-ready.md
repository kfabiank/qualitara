# 10 Exercises Paste-Ready (Adapted to Your Current Project)

Project paths used in this guide:
- Backend routes: `backend/src/routes/posts.ts`
- Backend services: `backend/src/services/jsonplaceholder.ts`
- Front API client: `frontend/src/lib/api.ts`
- Next API routes: `frontend/src/app/api/...`

Important
- These snippets are practice-ready and adapted to your existing imports/style.
- Paste one exercise at a time, run, test, then continue.

---

## Exercise 1) `GET /users/:id/posts`

### A) Add in `backend/src/services/jsonplaceholder.ts`
```ts
export async function fetchUserPosts(userId: number): Promise<Post[]> {
  const { data } = await axios.get(`${BASE_URL}/users/${userId}/posts`, { timeout: 10_000 });
  return z.array(PostSchema).parse(data);
}
```

### B) Update import in `backend/src/routes/posts.ts`
```ts
import {
  fetchPost,
  fetchPostComments,
  fetchPosts,
  createPost,
  patchPost,
  fetchUserPosts,
} from "../services/jsonplaceholder";
```

### C) Add route in `backend/src/routes/posts.ts`
```ts
postsRouter.get("/users/:id/posts", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const posts = await fetchUserPosts(id);
    return res.status(200).json({ posts });
  } catch {
    return res.status(500).json({ error: "Failed to fetch user posts" });
  }
});
```

### D) Add Next proxy route: `frontend/src/app/api/users/[id]/posts/route.ts`
```ts
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
    const posts = z.array(PostSchema).parse(BACKEND_BASE ? (raw as { posts: unknown }).posts : raw);
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 });
  }
}
```

### E) Add in `frontend/src/lib/api.ts`
```ts
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
```

---

## Exercise 2) Pagination (`/posts-paginated?page=1&limit=10`)

### A) Replace route body in `backend/src/routes/posts.ts`
```ts
postsRouter.get("/posts-paginated", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  try {
    const posts = await fetchPosts();
    const start = (page - 1) * limit;
    const paginatedPosts = posts.slice(start, start + limit);

    return res.status(200).json({
      posts: paginatedPosts,
      meta: { page, limit, total: posts.length },
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch paginated posts" });
  }
});
```

### B) Add in `frontend/src/lib/api.ts`
```ts
export async function getPostsPaginated(page = 1, limit = 10): Promise<{ posts: Post[]; meta: { page: number; limit: number; total: number } }> {
  if (typeof window !== "undefined") {
    const res = await fetch(`/api/posts-paginated?page=${page}&limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load paginated posts");
    return (await res.json()) as { posts: Post[]; meta: { page: number; limit: number; total: number } };
  }

  const res = await fetch(serverUrl(`/posts-paginated?page=${page}&limit=${limit}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load paginated posts");
  return (await res.json()) as { posts: Post[]; meta: { page: number; limit: number; total: number } };
}
```

---

## Exercise 3) Search in backend (`/posts?search=...`)

### Replace `/posts` route in `backend/src/routes/posts.ts`
```ts
postsRouter.get("/posts", async (req, res) => {
  const search = String(req.query.search ?? "").trim().toLowerCase();

  try {
    const posts = await fetchPosts();
    const filtered = search
      ? posts.filter((p) => p.title.toLowerCase().includes(search))
      : posts;

    return res.status(200).json({ posts: filtered });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});
```

---

## Exercise 4) DELETE post

### A) Add in `backend/src/services/jsonplaceholder.ts`
```ts
export async function deletePost(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/posts/${id}`, { timeout: 10_000 });
}
```

### B) Update import in `backend/src/routes/posts.ts`
```ts
import { /* existing */, deletePost } from "../services/jsonplaceholder";
```

### C) Add route in `backend/src/routes/posts.ts`
```ts
postsRouter.delete("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid post id" });

  try {
    await deletePost(id);
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to delete post" });
  }
});
```

---

## Exercise 5) N+1 naming cleanup + batched endpoint

### A) Rename route (recommended) in `backend/src/routes/posts.ts`
```ts
postsRouter.get("/posts-n-plus-1", async (_req, res) => {
  try {
    const posts = await fetchPosts();
    const top10 = posts.slice(0, 10).map(async (post) => {
      const comments = await fetchPostComments(post.id);
      return { ...post, comments };
    });

    return res.status(200).json({ mode: "n+1", posts: await Promise.all(top10) });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts-n-plus-1" });
  }
});
```

### B) Add batched helper in `backend/src/services/jsonplaceholder.ts`
```ts
export async function fetchAllComments(): Promise<Comment[]> {
  const { data } = await axios.get(`${BASE_URL}/comments`, { timeout: 10_000 });
  return z.array(CommentSchema).parse(data);
}
```

### C) Add batched route in `backend/src/routes/posts.ts`
```ts
postsRouter.get("/posts-with-comments", async (_req, res) => {
  try {
    const posts = (await fetchPosts()).slice(0, 10);
    const comments = await fetchAllComments();

    const byPostId = new Map<number, Comment[]>();
    for (const c of comments) {
      const list = byPostId.get(c.postId) ?? [];
      list.push(c);
      byPostId.set(c.postId, list);
    }

    const result = posts.map((p) => ({ ...p, comments: byPostId.get(p.id) ?? [] }));
    return res.status(200).json({ mode: "batched", posts: result });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts-with-comments" });
  }
});
```

---

## Exercise 6) PUT full update

### A) Add in `backend/src/services/jsonplaceholder.ts`
```ts
export async function putPost(id: number, input: CreatePostInput): Promise<Post> {
  const { data } = await axios.put(`${BASE_URL}/posts/${id}`, input, { timeout: 10_000 });
  return PostSchema.parse(data);
}
```

### B) Add in `backend/src/routes/posts.ts`
```ts
const PutPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.number().int().positive(),
});

postsRouter.put("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid post id" });

  const parsed = PutPostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
  }

  try {
    const post = await putPost(id, parsed.data);
    return res.status(200).json({ post });
  } catch {
    return res.status(500).json({ error: "Failed to replace post" });
  }
});
```

---

## Exercise 7) Better UI states (posts page)

### Replace `frontend/src/app/posts/page.tsx` body logic
```tsx
let posts: Post[] = [];
let loadError = false;

try {
  posts = await getPosts();
} catch {
  loadError = true;
}

return (
  <main className="mx-auto max-w-5xl p-6">
    <h1 className="text-2xl font-bold">Posts</h1>
    {loadError ? <p className="mt-4 text-red-700">Failed to load posts.</p> : null}
    {!loadError && posts.length === 0 ? <p className="mt-4">No posts found.</p> : null}
    {!loadError && posts.length > 0 ? <PostsList initialPosts={posts} /> : null}
  </main>
);
```

---

## Exercise 8) Logging middleware

### Add in `backend/src/app.ts` before routes
```ts
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});
```

---

## Exercise 9) Controller/Service refactor starter

### Create `backend/src/services/posts.service.ts`
```ts
import { fetchPosts, fetchPost, fetchPostComments } from "./jsonplaceholder";

export async function listPosts() {
  return fetchPosts();
}

export async function getPostById(id: number) {
  return fetchPost(id);
}

export async function listPostComments(id: number) {
  return fetchPostComments(id);
}
```

### Create `backend/src/controllers/posts.controller.ts`
```ts
import { Request, Response } from "express";
import * as postsService from "../services/posts.service";

export async function listPosts(_req: Request, res: Response) {
  try {
    return res.status(200).json({ posts: await postsService.listPosts() });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
}
```

---

## Exercise 10) Mock auth guard

### Create `backend/src/middleware/auth.ts`
```ts
import { NextFunction, Request, Response } from "express";

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = auth.slice("Bearer ".length);
  if (token !== "demo-token") {
    return res.status(401).json({ error: "Invalid token" });
  }

  (req as any).user = { id: 1, role: "admin" };
  next();
}
```

### Use in `backend/src/routes/posts.ts`
```ts
import { authGuard } from "../middleware/auth";

postsRouter.post("/posts", authGuard, async (req, res) => {
  // existing create logic
});

postsRouter.patch("/posts/:id", authGuard, async (req, res) => {
  // existing patch logic
});
```

---

## Quick commands
```bash
# Backend
cd /Users/fmoya/Documents/Staff Interview/backend
npm run dev

# Frontend
cd /Users/fmoya/Documents/Staff Interview/frontend
npm run dev

# Smoke test
curl http://localhost:4000/health
curl http://localhost:4000/api/posts
```
