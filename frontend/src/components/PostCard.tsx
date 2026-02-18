import Link from "next/link";
import type { Post } from "@/types/jsonplaceholder";
import styles from "@/styles/components/PostCard.module.scss";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className={styles["post-card"]}
    >
      <h3 className={styles["post-card__title"]}>{post.title}</h3>
      <p className={styles["post-card__body"]}>{post.body}</p>
      <p className={styles["post-card__meta"]}>Post #{post.id}</p>
    </Link>
  );
}
