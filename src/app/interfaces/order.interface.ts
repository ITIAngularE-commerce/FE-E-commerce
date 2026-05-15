export interface OrderAddress {
    street: string;
    city: string;
    country: string;
}

export interface OrderItem {
    productId: number;
    productName: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'CreditCard' | 'CashOnDelivery' | 'PayPal' | string;

export interface Order {
    id: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    trackingCode: string;
    total: number;
    createdAt: string;
    address: OrderAddress;
    items: OrderItem[];
}

export interface CreateOrderRequest {
    addressId: number;
    paymentMethod: string;
}

export interface UpdateOrderStatusRequest {
    status: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}