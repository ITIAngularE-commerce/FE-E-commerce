export interface WishlistItem {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrls: string[];
    categoryId: number;
    categoryName?: string;
    sellerName?: string;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}