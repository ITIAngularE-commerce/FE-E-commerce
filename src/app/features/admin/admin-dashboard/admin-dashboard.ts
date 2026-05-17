import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AdminStats, AdminUser } from '../../../interfaces/admin.interface';
import { Order } from '../../../interfaces/order.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  stats = signal<AdminStats | null>(null);
  recentUsers = signal<AdminUser[]>([]);
  recentOrders = signal<Order[]>([]);

  isLoadingStats = signal(true);
  isLoadingUsers = signal(true);
  isLoadingOrders = signal(true);

  ngOnInit() {
    this.loadStats();
    this.loadRecentUsers();
    this.loadRecentOrders();
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (res) => {
        if (res.success) this.stats.set(res.data);
        this.isLoadingStats.set(false);
      },
      error: () => this.isLoadingStats.set(false),
    });
  }

  loadRecentUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        if (res.success) this.recentUsers.set((res.data ?? []).slice(0, 5));
        this.isLoadingUsers.set(false);
      },
      error: () => this.isLoadingUsers.set(false),
    });
  }

  loadRecentOrders() {
    this.adminService.getAllOrders().subscribe({
      next: (res) => {
        if (res.success) this.recentOrders.set((res.data ?? []).slice(0, 5));
        this.isLoadingOrders.set(false);
      },
      error: () => this.isLoadingOrders.set(false),
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'status-pending',
      Processing: 'status-processing',
      Shipped: 'status-shipped',
      Delivered: 'status-delivered',
      Cancelled: 'status-cancelled',
    };
    return map[status] ?? 'status-pending';
  }

  roleClass(role: string): string {
    const map: Record<string, string> = {
      Admin: 'role-admin',
      Seller: 'role-seller',
      Customer: 'role-customer',
    };
    return map[role] ?? 'role-customer';
  }

  formatDate(iso: string): string {
    if (!iso) return 'N/A';
    const d = new Date(iso.includes('Z') ? iso : iso + 'Z');
    return isNaN(d.getTime())
      ? 'N/A'
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  userInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }
}
