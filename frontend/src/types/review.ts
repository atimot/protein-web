export interface User {
  id: number;
  name: string;
  avatar?: string;
  level: string;
}

export interface Review {
  id: number;
  user: User;
  postedAt: string;
  images: string[];
  proteinPerServing: string;
  pricePerServing: string;
  comment: string;
}

export interface ReviewFormData {
  proteinPerServing: string;
  pricePerServing: string;
  comment: string;
  images: File[];
}
