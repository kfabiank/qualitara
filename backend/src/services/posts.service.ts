import { fetchPosts } from "./jsonplaceholder";

export async function listPosts(search: string) {
  const posts = await fetchPosts();
  if (!search) return posts;
  return posts.filter((p) => p.title.toLowerCase().includes(search));
}
