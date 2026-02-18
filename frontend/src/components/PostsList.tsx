"use client";

import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { NewPostForm } from "@/components/NewPostForm";
import type { Post } from "@/types/jsonplaceholder";
import styles from "@/styles/components/PostsList.module.scss";

export function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);

  return (
    <div className={styles["posts-list"]}>
      <NewPostForm onCreated={(post) => setPosts((prev) => [post, ...prev])} />
      <div className={styles["posts-list__grid"]}>
        {posts.slice(0, 30).map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
