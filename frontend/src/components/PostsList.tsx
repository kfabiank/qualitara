"use client";

import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { NewPostForm } from "@/components/NewPostForm";
import type { Post } from "@/types/jsonplaceholder";

export function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);

  return (
    <>
      <div className="mt-4">
        <NewPostForm onCreated={(post) => setPosts((prev) => [post, ...prev])} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 30).map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  );
}
