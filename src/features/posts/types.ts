export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface PostListProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
} 