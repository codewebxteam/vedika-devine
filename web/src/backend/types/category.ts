export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  displayOrder?: number;
  createdAt?: number;
  updatedAt?: number;
}
