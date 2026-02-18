import Link from "next/link";
import { getPost, getPostComments } from "@/lib/api";
import { PostDetail } from "@/components/PostDetail";
import type { Comment, Post } from "@/types/jsonplaceholder";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id);
  let post: Post | null = null;
  let comments: Comment[] = [];
  let loadError = false;

  try {
    [post, comments] = await Promise.all([getPost(postId), getPostComments(postId)]);
  } catch {
    loadError = true;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/posts" className="text-sm underline">
        ← Back
      </Link>
      {loadError || !post ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load post details. Verify backend is running on <code>http://localhost:4000</code> and refresh.
        </div>
      ) : (
        <PostDetail initialPost={post} comments={comments} />
      )}
    </main>
  );
}
