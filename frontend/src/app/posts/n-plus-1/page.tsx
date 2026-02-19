import Link from "next/link";
import { getPostsBatched, getPostsNPlusOne } from "@/lib/api";
import { PostsList } from "@/components/PostsList";
import type { Post } from "@/types/jsonplaceholder";

export const dynamic = "force-dynamic";

export default async function PostsNPlusOnePage() {
  let posts: Post[] = [];
  let batchedPosts: Post[] = [];
  let loadError = false;

  try {
    const [nPlusOne, batched] = await Promise.all([getPostsNPlusOne(), getPostsBatched()]);
    posts = nPlusOne;
    batchedPosts = batched;
  } catch {
    loadError = true;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/posts" className="text-sm underline">
        ← Back to posts
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Posts (N+1 Demo)</h1>
      <p className="mt-1 text-sm text-gray-600">Comparing `/api/posts-n-plus-1` vs `/api/posts-with-comments`.</p>

      {loadError ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load N+1 demo posts. Verify backend is running on <code>http://localhost:4000</code>.
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-gray-700">
            N+1 result count: <strong>{posts.length}</strong> | Batched result count: <strong>{batchedPosts.length}</strong>
          </p>
          <PostsList initialPosts={posts} />
        </>
      )}
    </main>
  );
}
