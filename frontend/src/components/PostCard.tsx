import Link from "next/link";
import type { Post } from "@/types/jsonplaceholder";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block rounded-xl border p-4 hover:shadow-sm transition"
    >
      <h3 className="text-lg font-semibold line-clamp-1">{post.title}</h3>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.body}</p>
      <p className="mt-3 text-xs text-gray-500">Post #{post.id}</p>
    </Link>
  );
}
