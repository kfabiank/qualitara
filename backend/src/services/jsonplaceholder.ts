import axios from "axios";
import { z } from "zod";

const BASE_URL = "https://jsonplaceholder.typicode.com";

const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string()
});

const CommentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string()
});

export type Post = z.infer<typeof PostSchema>;
export type Comment = z.infer<typeof CommentSchema>;

export async function fetchPosts(): Promise<Post[]> {
  const { data } = await axios.get(`${BASE_URL}/posts`, { timeout: 10_000 });
  return z.array(PostSchema).parse(data);
}

export async function fetchPost(id: number): Promise<Post> {
  const { data } = await axios.get(`${BASE_URL}/posts/${id}`, { timeout: 10_000 });
  return PostSchema.parse(data);
}

export async function fetchPostComments(id: number): Promise<Comment[]> {
  const { data } = await axios.get(`${BASE_URL}/posts/${id}/comments`, { timeout: 10_000 });
  return z.array(CommentSchema).parse(data);
}
