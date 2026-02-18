import Link from "next/link";
import { getPost, getPostComments } from "@/lib/api";
import { PostDetail } from "@/components/PostDetail";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const [post, comments] = await Promise.all([getPost(postId), getPostComments(postId)]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/posts" className="text-sm underline">
        ← Back
      </Link>
      <PostDetail initialPost={post} comments={comments} />
    </main>
  );
}
