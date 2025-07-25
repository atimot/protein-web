import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, ApiError } from '@/utils/api';

// API呼び出し用のカスタムフック
export const useApi = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 401エラー時の自動リダイレクト処理
    const handleAuthError = () => {
      navigate('/login', { 
        state: { message: 'セッションが期限切れです。再度ログインしてください。' } 
      });
    };

    window.addEventListener('auth:logout', handleAuthError);

    return () => {
      window.removeEventListener('auth:logout', handleAuthError);
    };
  }, [navigate]);

  // 認証付きAPI呼び出し
  const authenticatedRequest = async (
    url: string, 
    options: RequestInit = {}
  ) => {
    try {
      return await apiRequest(url, { ...options, requireAuth: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // 401エラーの場合は既にauth:logoutイベントが発火されているので、
        // ここでは何もしない
      }
      throw error;
    }
  };

  // 公開API呼び出し（認証不要）
  const publicRequest = async (
    url: string, 
    options: RequestInit = {}
  ) => {
    return await apiRequest(url, { ...options, requireAuth: false });
  };

  return {
    authenticatedRequest,
    publicRequest,
  };
};