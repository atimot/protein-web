import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>ログインしてください</div>;
  }

  return (
    <div className="profile">
      <h1>プロフィール</h1>
      <div className="profile-info">
        <div>
          <strong>名前:</strong> {user.name}
        </div>
        <div>
          <strong>メールアドレス:</strong> {user.email}
        </div>
      </div>
      <Button onClick={logout}>ログアウト</Button>
    </div>
  );
}; 