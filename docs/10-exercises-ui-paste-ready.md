# 10 Exercises - UI Paste-Ready (Next.js Frontend)

This file focuses only on frontend/UI updates for each exercise.
Project root: `/Users/fmoya/Documents/Staff Interview`

---

## 1) UI for `GET /users/:id/posts`

### A) Add API client method
File: `frontend/src/lib/api.ts`

```ts
export async function getUserPosts(userId: number): Promise<Post[]> {
  const res = await fetch(`/api/users/${userId}/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load user posts");
  return ((await res.json()) as { posts: Post[] }).posts;
}
```

### B) Add page
File: `frontend/src/app/users/[id]/posts/page.tsx`

```tsx
import { getUserPosts } from "@/lib/api";

export default async function UserPostsPage({ params }: { params: { id: string } }) {
  const userId = Number(params.id);
  const posts = await getUserPosts(userId);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">User {params.id} Posts</h1>
      <ul className="mt-4 space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="rounded border p-3">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{p.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

---

## 2) UI for pagination

### A) Add API client method
File: `frontend/src/lib/api.ts`

```ts
export async function getPostsPaginated(page = 1, limit = 10): Promise<{
  posts: Post[];
  meta: { page: number; limit: number; total: number };
}> {
  const res = await fetch(`/api/posts-paginated?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load paginated posts");
  return (await res.json()) as {
    posts: Post[];
    meta: { page: number; limit: number; total: number };
  };
}
```

### B) Add client page wrapper for controls
File: `frontend/src/app/posts-paginated/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { getPostsPaginated } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types/jsonplaceholder";

export default function PostsPaginatedPage() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getPostsPaginated(page, limit)
      .then((data) => {
        if (!mounted) return;
        setPosts(data.posts);
        setTotal(data.meta.total);
      })
      .catch(() => mounted && setError("Failed to load page"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [page, limit]);

  const maxPage = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Paginated Posts</h1>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded border px-3 py-1 disabled:opacity-40"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm">Page {page} / {maxPage}</span>
        <button
          className="rounded border px-3 py-1 disabled:opacity-40"
          disabled={page >= maxPage || loading}
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
        >
          Next
        </button>
      </div>

      {loading ? <p className="mt-4">Loading...</p> : null}
      {error ? <p className="mt-4 text-red-700">{error}</p> : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </main>
  );
}
```

---

## 3) UI for search by title

### A) Add API client method
File: `frontend/src/lib/api.ts`

```ts
export async function searchPosts(search: string): Promise<Post[]> {
  const res = await fetch(`/api/posts?search=${encodeURIComponent(search)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to search posts");
  return ((await res.json()) as { posts: Post[] }).posts;
}
```

### B) Add search demo page
File: `frontend/src/app/posts-search/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { searchPosts } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types/jsonplaceholder";

export default function PostsSearchPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      setPosts(await searchPosts(query));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Search Posts</h1>

      <form className="mt-4 flex gap-2" onSubmit={onSubmit}>
        <input
          className="rounded border px-3 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title"
        />
        <button className="rounded border px-3 py-2" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </main>
  );
}
```

---

## 4) UI for delete post

### A) Add API client method
File: `frontend/src/lib/api.ts`

```ts
export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
}
```

### B) Add delete button in detail
File: `frontend/src/components/PostDetail.tsx`

```tsx
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/api";

// inside component:
const router = useRouter();

async function onDelete() {
  try {
    await deletePost(post.id);
    router.push("/posts");
    router.refresh();
  } catch {
    // set local error state if desired
  }
}

// in JSX (near Edit button)
<button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100" onClick={onDelete}>
  Delete post
</button>
```

---

## 5) UI for N+1 demo

### A) Add API client methods
File: `frontend/src/lib/api.ts`

```ts
export type PostWithComments = Post & { comments: Comment[] };

export async function getPostsNPlus1Demo(): Promise<PostWithComments[]> {
  const res = await fetch("/api/posts-n-plus-1", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed n+1 demo");
  return ((await res.json()) as { posts: PostWithComments[] }).posts;
}

export async function getPostsWithCommentsBatchedDemo(): Promise<PostWithComments[]> {
  const res = await fetch("/api/posts-with-comments", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed batched demo");
  return ((await res.json()) as { posts: PostWithComments[] }).posts;
}
```

### B) Add comparison page
File: `frontend/src/app/n-plus-1/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { getPostsNPlus1Demo, getPostsWithCommentsBatchedDemo } from "@/lib/api";

export default function NPlusOnePage() {
  const [n1Time, setN1Time] = useState<number | null>(null);
  const [batchedTime, setBatchedTime] = useState<number | null>(null);

  async function runN1() {
    const t0 = performance.now();
    await getPostsNPlus1Demo();
    setN1Time(Math.round(performance.now() - t0));
  }

  async function runBatched() {
    const t0 = performance.now();
    await getPostsWithCommentsBatchedDemo();
    setBatchedTime(Math.round(performance.now() - t0));
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">N+1 vs Batched</h1>
      <div className="mt-4 flex gap-2">
        <button className="rounded border px-3 py-2" onClick={runN1}>Run N+1</button>
        <button className="rounded border px-3 py-2" onClick={runBatched}>Run Batched</button>
      </div>
      <p className="mt-3 text-sm">N+1: {n1Time ?? "-"} ms</p>
      <p className="text-sm">Batched: {batchedTime ?? "-"} ms</p>
    </main>
  );
}
```

---

## 6) UI for PUT (full replace)

### A) Add API method
File: `frontend/src/lib/api.ts`

```ts
export async function putPost(
  id: number,
  input: { title: string; body: string; userId: number }
): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to replace post");
  return ((await res.json()) as { post: Post }).post;
}
```

### B) Optional button in `EditPostForm.tsx`
```tsx
const replaced = await putPost(post.id, { title, body, userId: post.userId });
onUpdated(replaced);
```

---

## 7) UI hardening (error/empty already in your project)

### Keep/verify in
- `frontend/src/app/posts/page.tsx`
- `frontend/src/app/posts/[id]/page.tsx`

Checklist
- Error message shown if backend down
- Empty list message if no posts
- No unhandled runtime crash

---

## 8) Request logging middleware

No UI changes required.

---

## 9) Controller/service refactor

No UI changes required.

---

## 10) Mock auth (frontend headers)

### A) Add helper in `frontend/src/lib/api.ts`
```ts
const AUTH_HEADER = { Authorization: "Bearer demo-token" };
```

### B) Apply to write calls
```ts
headers: { "Content-Type": "application/json", ...AUTH_HEADER }
```

Use in:
- `createPost`
- `patchPost`
- `putPost`
- `deletePost` (if needed)

---

## Quick links to test pages
- `/posts`
- `/posts-paginated`
- `/posts-search`
- `/n-plus-1`
- `/users/1/posts`

