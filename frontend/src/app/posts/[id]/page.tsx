import Link from "next/link";
import { getPost, getPostComments } from "@/lib/api";
import { CommentList } from "@/components/CommentList";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const post = await getPost(postId);
  const comments = await getPostComments(postId);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/posts" className="text-sm underline">
        ← Back
      </Link>

      <h1 className="mt-4 text-2xl font-bold">{post.title}</h1>
      <p className="mt-3 text-gray-700">{post.body}</p>

      <h2 className="mt-10 text-xl font-semibold">Comments ({comments.length})</h2>
      <div className="mt-4">
        <CommentList comments={comments} />
      </div>
    </main>
  );
}
