export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    isActive: boolean;
}

export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}