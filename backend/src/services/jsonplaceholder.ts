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

const CreatePostSchema = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

const PatchPostSchema = CreatePostSchema.partial();

export type Post = z.infer<typeof PostSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type PatchPostInput = z.infer<typeof PatchPostSchema>;

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

export async function createPost(input: CreatePostInput): Promise<Post> {
  const { data } = await axios.post(`${BASE_URL}/posts`, input, { timeout: 10_000 });
  return PostSchema.parse(data);
}

export async function patchPost(id: number, input: PatchPostInput): Promise<Post> {
  const { data } = await axios.patch(`${BASE_URL}/posts/${id}`, input, { timeout: 10_000 });
  return PostSchema.parse(data);
}

export async function putPost(id: number, input: CreatePostInput): Promise<Post> {
  const { data } = await axios.put(`${BASE_URL}/posts/${id}`, input, { timeout: 10_000 });
  return PostSchema.parse(data);
}

export async function deletePost(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/posts/${id}`, { timeout: 10_000 });
}

export async function fetchUserPosts(userId: number): Promise<Post[]> {
  const { data } = await axios.get(`${BASE_URL}/users/${userId}/posts`, { timeout: 10_000 });
  return z.array(PostSchema).parse(data);
}

export async function fetchAllComments(): Promise<Comment[]> {
  const { data } = await axios.get(`${BASE_URL}/comments`, { timeout: 10_000 });
  return z.array(CommentSchema).parse(data);
}
