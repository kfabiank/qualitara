import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Staff Fullstack Interview</h1>
      <p className="mt-2 text-gray-600">
        Next.js 14 frontend calling a Node/Express backend that proxies JSONPlaceholder.
      </p>
      <div className="mt-6 flex gap-3">
        <Link className="rounded-xl border px-4 py-2 hover:shadow-sm transition" href="/posts">
          Go to Posts →
        </Link>
        <a
          className="rounded-xl border px-4 py-2 hover:shadow-sm transition"
          href="http://localhost:4000/health"
          target="_blank"
          rel="noreferrer"
        >
          Backend health
        </a>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Tip: set <code className="border px-1 rounded">NEXT_PUBLIC_API_BASE</code> if your backend runs elsewhere.
      </p>
    </main>
  );
}
