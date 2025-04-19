import { Post } from "./types";

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("/api/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};

export const createPost = async (
  post: Omit<Post, "id" | "createdAt">,
): Promise<Post> => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return response.json();
};
