# Interview Exercises With Code (Express + Next + TypeScript)

## 1) `GET /users/:id/posts`

**Goal:** Add endpoint to return posts by user id.

```ts
// backend/src/routes/posts.ts
import { Router } from "express";
import axios from "axios";

const postsRouter = Router();

postsRouter.get("/users/:id/posts", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}/posts`,
      { timeout: 10000 }
    );
    return res.status(200).json({ posts: data });
  } catch {
    return res.status(500).json({ error: "Failed to fetch user posts" });
  }
});
```

---

## 2) Pagination `GET /posts?page=1&limit=10`

**Goal:** Add basic pagination.

```ts
postsRouter.get("/posts", async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));
  const start = (page - 1) * limit;

  try {
    const posts = await fetchPosts(); // existing service
    const paged = posts.slice(start, start + limit);

    return res.status(200).json({
      posts: paged,
      meta: { page, limit, total: posts.length },
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});
```

---

## 3) Search by title `GET /posts?search=foo`

**Goal:** Filter posts by title.

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

## 4) `DELETE /posts/:id`

**Goal:** Add delete route with proper status code.

```ts
import axios from "axios";

postsRouter.delete("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid post id" });
  }

  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      timeout: 10000,
    });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to delete post" });
  }
});
```

---

## 5) N+1 demo and batched fix

**Goal:** Show bad pattern vs optimized pattern.

```ts
// N+1 demo: 1 call for posts + N calls for comments
postsRouter.get("/posts-n-plus-1", async (_req, res) => {
  try {
    const posts = (await fetchPosts()).slice(0, 10);
    const tasks = posts.map(async (post) => {
      const comments = await fetchPostComments(post.id);
      return { ...post, comments };
    });

    const result = await Promise.all(tasks);
    return res.status(200).json({ mode: "n+1", posts: result });
  } catch {
    return res.status(500).json({ error: "Failed n+1" });
  }
});

// Batched approach: 2 fixed calls total
postsRouter.get("/posts-with-comments", async (_req, res) => {
  try {
    const posts = (await fetchPosts()).slice(0, 10);
    const allComments = await fetchAllComments(); // create service helper

    const map = new Map<number, any[]>();
    for (const c of allComments) {
      const arr = map.get(c.postId) ?? [];
      arr.push(c);
      map.set(c.postId, arr);
    }

    const result = posts.map((p) => ({ ...p, comments: map.get(p.id) ?? [] }));
    return res.status(200).json({ mode: "batched", posts: result });
  } catch {
    return res.status(500).json({ error: "Failed batched" });
  }
});
```

```ts
// backend/src/services/jsonplaceholder.ts
export async function fetchAllComments() {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/comments", {
    timeout: 10000,
  });
  return z.array(CommentSchema).parse(data);
}
```

---

## 6) Add `PUT /posts/:id` (full update)

**Goal:** Differentiate PUT (full) from PATCH (partial).

```ts
const PutPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.number().int().positive(),
});

postsRouter.put("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid post id" });
  }

  const parsed = PutPostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
  }

  try {
    const { data } = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      parsed.data,
      { timeout: 10000 }
    );
    return res.status(200).json({ post: data });
  } catch {
    return res.status(500).json({ error: "Failed to replace post" });
  }
});
```

---

## 7) Frontend loading + error + empty states

**Goal:** Avoid crash and show user-friendly states.

```tsx
// frontend/src/app/posts/page.tsx
export default async function PostsPage() {
  let posts: Post[] = [];
  let error = false;

  try {
    posts = await getPosts();
  } catch {
    error = true;
  }

  return (
    <main>
      {error ? <p>Failed to load posts. Check backend.</p> : null}
      {!error && posts.length === 0 ? <p>No posts found.</p> : null}
      {!error && posts.length > 0 ? <PostsList initialPosts={posts} /> : null}
    </main>
  );
}
```

---

## 8) Request logging middleware

**Goal:** Log method/path/status/duration.

```ts
// backend/src/app.ts
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

## 9) Refactor to controller/service

**Goal:** Separate HTTP layer from business logic.

```ts
// backend/src/controllers/posts.controller.ts
export async function listPosts(_req: Request, res: Response) {
  try {
    const posts = await postsService.listPosts();
    return res.status(200).json({ posts });
  } catch {
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
}

// backend/src/services/posts.service.ts
export async function listPosts() {
  return fetchPosts();
}

// backend/src/routes/posts.ts
postsRouter.get("/posts", listPosts);
```

---

## 10) Mock JWT auth guard (concept)

**Goal:** Show auth/authz basics quickly.

```ts
function authGuard(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = auth.slice("Bearer ".length);
  // mock check for interview demo
  if (token !== "demo-token") {
    return res.status(401).json({ error: "Invalid token" });
  }

  (req as any).user = { id: 1, role: "admin" };
  next();
}

postsRouter.post("/posts", authGuard, async (req, res) => {
  // protected route
});
```

---

## Suggested practice order

1. #1 users posts
2. #4 delete
3. #6 put vs patch
4. #7 ui states
5. #5 n+1 vs batched
6. #8 logging
7. #9 refactor
8. #10 auth concept

