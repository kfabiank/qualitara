import { getPosts } from "@/lib/api";
import { PostsList } from "@/components/PostsList";
import type { Post } from "@/types/jsonplaceholder";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
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
      <p className="mt-1 text-sm text-gray-600">
        Server-rendered list from the Node backend.
      </p>
      {loadError ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load posts. Verify backend is running on <code>http://localhost:4000</code> and refresh.
        </div>
      ) : (
        <PostsList initialPosts={posts} />
      )}
    </main>
  );
}
