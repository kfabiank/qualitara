"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditPostForm } from "@/components/EditPostForm";
import { CommentList } from "@/components/CommentList";
import { deletePost } from "@/lib/api";
import type { Post, Comment } from "@/types/jsonplaceholder";

export function PostDetail({ initialPost, comments }: { initialPost: Post; comments: Comment[] }) {
  const [post, setPost] = useState(initialPost);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function onDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePost(post.id);
      router.push("/posts");
      router.refresh();
    } catch {
      setDeleteError("Failed to delete post. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            disabled={deleting}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50 transition"
          >
            {deleting ? "Deleting..." : "Delete post"}
          </button>
          <EditPostForm post={post} onUpdated={setPost} />
        </div>
      </div>
      <p className="mt-3 text-gray-700">{post.body}</p>
      {deleteError ? <p className="mt-2 text-xs text-red-500">{deleteError}</p> : null}

      <h2 className="mt-10 text-xl font-semibold">Comments ({comments.length})</h2>
      <div className="mt-4">
        <CommentList comments={comments} />
      </div>
    </>
  );
}
