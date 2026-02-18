import type { Comment } from "@/types/jsonplaceholder";

export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium line-clamp-1">{c.name}</p>
            <p className="text-xs text-gray-500">{c.email}</p>
          </div>
          <p className="mt-2 text-sm text-gray-700">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
