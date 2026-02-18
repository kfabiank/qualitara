"use client";

import { useState } from "react";
import { createPost } from "@/lib/api";
import type { Post } from "@/types/jsonplaceholder";

export function NewPostForm({ onCreated }: { onCreated: (post: Post) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const post = await createPost({ title, body, userId: 1 });
      onCreated(post);
      setTitle("");
      setBody("");
      setOpen(false);
    } catch {
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-dashed px-4 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition"
      >
        + New post
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border p-4 flex flex-col gap-3 bg-gray-50"
    >
      <h2 className="font-semibold text-sm">New post</h2>
      <input
        required
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <textarea
        required
        placeholder="Body"
        rows={3}
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
          {loading ? "Creating…" : "Create"}
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
