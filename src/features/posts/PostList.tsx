import React from 'react';
import { Post, PostListProps } from './types';
import { Button } from '../../components/Button';

export const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <div className="post-meta">
            <span>By {post.author}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <Button onClick={() => onPostClick(post.id)}>詳細を見る</Button>
        </div>
      ))}
    </div>
  );
}; 