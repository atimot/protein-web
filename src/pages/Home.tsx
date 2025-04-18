import React from 'react';
import { PostList } from '../features/posts/PostList';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    // 投稿一覧の取得
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: number) => {
    // 投稿詳細ページへの遷移
    window.location.href = `/posts/${postId}`;
  };

  return (
    <div className="home">
      <header>
        <h1>Welcome to Our Blog</h1>
        {user && (
          <div className="user-info">
            <span>Hello, {user.name}</span>
            <Button onClick={logout}>Logout</Button>
          </div>
        )}
      </header>
      <main>
        <PostList posts={posts} onPostClick={handlePostClick} />
      </main>
    </div>
  );
}; 