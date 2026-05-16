export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface Cart {
    id: number;
    items: CartItem[];
    total: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}