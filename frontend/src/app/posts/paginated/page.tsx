import Link from "next/link";
import { getPostsPaginated } from "@/lib/api";
import { PostsList } from "@/components/PostsList";
import type { Post } from "@/types/jsonplaceholder";

export const dynamic = "force-dynamic";

export default async function PostsPaginatedPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const limit = Math.min(20, Math.max(1, Number(searchParams.limit ?? 10)));
  let loadError = false;
  let posts: Post[] = [];
  let total = 0;

  try {
    const data = await getPostsPaginated(page, limit);
    posts = data.posts;
    total = data.meta.total;
  } catch {
    loadError = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const prevHref = `/posts/paginated?page=${Math.max(1, page - 1)}&limit=${limit}`;
  const nextHref = `/posts/paginated?page=${Math.min(totalPages, page + 1)}&limit=${limit}`;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/posts" className="text-sm underline">
        ← Back to posts
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Posts (Paginated Demo)</h1>
      <p className="mt-1 text-sm text-gray-600">Using `/api/posts-paginated` from backend.</p>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <Link
          className={`rounded border px-3 py-1.5 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
          href={prevHref}
        >
          Prev
        </Link>
        <span>
          Page {page} / {totalPages}
        </span>
        <Link
          className={`rounded border px-3 py-1.5 ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
          href={nextHref}
        >
          Next
        </Link>
      </div>

      {loadError ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load paginated posts. Verify backend is running on <code>http://localhost:4000</code>.
        </div>
      ) : (
        <PostsList initialPosts={posts} />
      )}
    </main>
  );
}
