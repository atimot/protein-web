export interface User {
  id: number;
  name: string;
  avatar: string;
  level: string;
}

export interface Review {
  id: number;
  user: User;
  postedAt: string;
  images: string[];
  productName: string;
  flavorProfile: string;
  foamLevel: string;
  proteinPerServing: string;
  pricePerServing: string;
  comment: string;
}
