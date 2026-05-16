export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrls: string[];
  categoryId: number;
  categoryName: string;
  sellerName: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  images: File[];
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface UpdateStockRequest {
  stock: number;
}
