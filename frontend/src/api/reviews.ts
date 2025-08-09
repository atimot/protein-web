import { ReviewFormData, Review } from "@/types/review";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface CreateReviewRequest {
  proteinPerServing: string;
  pricePerServing: string;
  comment: string;
  images: string[];
}

export interface CreateReviewResponse {
  id: number;
  message?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  limit: number;
  offset: number;
}

export const reviewApi = {
  // レビューを投稿
  async createReview(data: ReviewFormData): Promise<CreateReviewResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("認証が必要です");
    }

    // 画像アップロードは一旦URLの配列として扱う
    // 実際の実装では、画像をBase64やFormDataで送信し、
    // バックエンドでS3等にアップロードしてURLを返す処理が必要
    const requestData: CreateReviewRequest = {
      proteinPerServing: data.proteinPerServing,
      pricePerServing: data.pricePerServing,
      comment: data.comment,
      images: [], // 一旦空配列で送信
    };

    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "レビューの投稿に失敗しました");
    }

    return response.json();
  },

  // 全レビューを取得
  async getAllReviews(limit = 20, offset = 0): Promise<Review[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/reviews?limit=${limit}&offset=${offset}`,
    );

    if (!response.ok) {
      throw new Error("レビューの取得に失敗しました");
    }

    return response.json();
  },

  // 特定のレビューを取得
  async getReview(id: number): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`);

    if (!response.ok) {
      throw new Error("レビューの取得に失敗しました");
    }

    return response.json();
  },

  // ユーザーのレビューを取得
  async getUserReviews(
    userId: number,
    limit = 20,
    offset = 0,
  ): Promise<Review[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/users/${userId}/reviews?limit=${limit}&offset=${offset}`,
    );

    if (!response.ok) {
      throw new Error("レビューの取得に失敗しました");
    }

    return response.json();
  },
};