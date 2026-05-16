export interface WishlistItem {
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    stock: number;
    categoryName?: string;
    sellerName?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}