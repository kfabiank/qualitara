import Link from "next/link";
import { getUserPosts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function UserPostsPage({ params }: { params: { id: string } }) {
  const userId = Number(params.id);
  const posts = await getUserPosts(userId);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/posts" className="text-sm underline">
        ← Back to posts
      </Link>
      <h1 className="mt-4 text-2xl font-bold">User {params.id} Posts</h1>
      <p className="mt-1 text-sm text-gray-600">Using `/api/users/:id/posts`.</p>

      <ul className="mt-6 space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="rounded-lg border p-4">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
