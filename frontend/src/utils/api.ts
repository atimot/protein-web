// API呼び出しのヘルパー関数
interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiRequest = async (
  url: string, 
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { requireAuth = true, ...fetchOptions } = options;

  // デフォルトヘッダー
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // 認証が必要な場合はトークンを追加
  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // 401 Unauthorized - トークンが無効または期限切れ
    if (response.status === 401 && requireAuth) {
      // トークンとユーザー情報をクリア
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // カスタムイベントを発行してAuthContextに通知
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      throw new ApiError(401, 'セッションが期限切れです。再度ログインしてください。');
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'ネットワークエラーが発生しました');
  }
};

// 便利なヘルパー関数
export const apiGet = (url: string, options: ApiRequestOptions = {}) =>
  apiRequest(url, { ...options, method: 'GET' });

export const apiPost = (url: string, data: any, options: ApiRequestOptions = {}) =>
  apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiPut = (url: string, data: any, options: ApiRequestOptions = {}) =>
  apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiDelete = (url: string, options: ApiRequestOptions = {}) =>
  apiRequest(url, { ...options, method: 'DELETE' });