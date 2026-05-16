export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: 'Admin' | 'Seller' | 'Customer';
    createdAt: string;
    isActive: boolean;
}

export interface AdminStats {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
}
export type AdminTab = 'dashboard' | 'users' | 'orders';