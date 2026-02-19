"use client";

import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { getPosts } from "@/lib/api";
import type { Post } from "@/types/jsonplaceholder";

export default function PostsSearchPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(query);
      setPosts(data.slice(0, 30));
    } catch {
      setError("Failed to search posts.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Posts Search</h1>
      <p className="mt-1 text-sm text-gray-600">Search by title using backend `?search=`.</p>

      <form className="mt-4 flex gap-2" onSubmit={onSubmit}>
        <input
          className="w-full max-w-md rounded border px-3 py-2"
          placeholder="Type title keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="rounded border px-4 py-2" disabled={loading} type="submit">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
