import { getPosts } from "@/lib/api";
import { PostsList } from "@/components/PostsList";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      <p className="mt-1 text-sm text-gray-600">
        Server-rendered list from the Node backend.
      </p>
      <PostsList initialPosts={posts} />
    </main>
  );
}
