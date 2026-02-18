"use client";

import { useState } from "react";
import { EditPostForm } from "@/components/EditPostForm";
import { CommentList } from "@/components/CommentList";
import type { Post, Comment } from "@/types/jsonplaceholder";

export function PostDetail({ initialPost, comments }: { initialPost: Post; comments: Comment[] }) {
  const [post, setPost] = useState(initialPost);

  return (
    <>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <EditPostForm post={post} onUpdated={setPost} />
      </div>
      <p className="mt-3 text-gray-700">{post.body}</p>

      <h2 className="mt-10 text-xl font-semibold">Comments ({comments.length})</h2>
      <div className="mt-4">
        <CommentList comments={comments} />
      </div>
    </>
  );
}
