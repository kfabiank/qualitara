"use client";

import { useState } from "react";
import { patchPost } from "@/lib/api";
import type { Post } from "@/types/jsonplaceholder";

export function EditPostForm({ post, onUpdated }: { post: Post; onUpdated: (post: Post) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updated = await patchPost(post.id, { title, body });
      onUpdated(updated);
      setOpen(false);
    } catch {
      setError("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 transition"
      >
        Edit post
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border p-4 flex flex-col gap-3 bg-gray-50"
    >
      <h2 className="font-semibold text-sm">Edit post</h2>
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <textarea
        required
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-800 transition"
        >
          {loading ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
