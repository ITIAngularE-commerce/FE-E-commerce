import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Order, OrderStatus } from '../../../../interfaces/order.interface';
import { AdminStats, AdminTab, AdminUser } from '../../../../interfaces/admin.interface';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private adminService = inject(AdminService);
  private router = inject(Router);

  activeTab = signal<AdminTab>('dashboard');

  // ── Sidebar (mobile) ──
  sidebarOpen = signal(false);

  // ── Stats ──
  stats = signal<AdminStats | null>(null);
  isLoadingStats = signal(true);

  // ── Users ──
  users = signal<AdminUser[]>([]);
  isLoadingUsers = signal(false);
  userRoleFilter = signal<string>('All');
  togglingUserId = signal<string | null>(null);
  userSearch = signal('');

  filteredUsers = () => {
    const q = this.userSearch().toLowerCase();
    return this.users().filter(
      (u) =>
        (!q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (this.userRoleFilter() === 'All' || u.role === this.userRoleFilter())
    );
  };

  // ── Orders ──
  orders = signal<Order[]>([]);
  isLoadingOrders = signal(false);
  orderStatusFilter = signal<string>('All');
  updatingOrderId = signal<number | null>(null);
  expandedOrderId = signal<number | null>(null);
  orderSearch = signal('');

  filteredOrders = () => {
    const q = this.orderSearch().toLowerCase();
    return this.orders().filter(
      (o) =>
        (!q || o.trackingCode.toLowerCase().includes(q) || String(o.id).includes(q)) &&
        (this.orderStatusFilter() === 'All' || o.status === this.orderStatusFilter())
    );
  };

  // ── Shared ──
  successMessage = signal<string | null>(null);
  error = signal<string | null>(null);

  readonly roleOptions = ['All', 'Admin', 'Seller', 'Customer'];
  readonly orderStatusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  readonly orderFilterOptions = ['All', ...this.orderStatusOptions];

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadOrders();
  }

  // Close sidebar when clicking outside on mobile
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.sidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  setTab(tab: AdminTab): void {
    this.activeTab.set(tab);
    this.successMessage.set(null);
    this.error.set(null);
    this.sidebarOpen.set(false); // close sidebar on mobile after tab change
  }

  // ── Stats ──
  loadStats(): void {
    this.isLoadingStats.set(true);
    this.adminService.getStats().subscribe({
      next: (res) => {
        if (res.success) this.stats.set(res.data);
        this.isLoadingStats.set(false);
      },
      error: () => this.isLoadingStats.set(false),
    });
  }

  // ── Users ──
  loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.adminService.getUsers().subscribe({
      next: (res) => {
        if (res.success) this.users.set(res.data ?? []);
        this.isLoadingUsers.set(false);
      },
      error: () => this.isLoadingUsers.set(false),
    });
  }

  toggleUser(user: AdminUser): void {
    const action = user.isActive ? 'Deactivate' : 'Activate';
    if (!confirm(`${action} ${user.fullName}?`)) return;
    this.togglingUserId.set(user.id);
    this.adminService.toggleUser(user.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.users.update((list) =>
            list.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
          );
          this.showSuccess(`${user.fullName} has been ${user.isActive ? 'deactivated' : 'activated'}.`);
        }
        this.togglingUserId.set(null);
      },
      error: () => {
        this.error.set('Failed to update user status.');
        this.togglingUserId.set(null);
      },
    });
  }

  // ── Orders ──
  loadOrders(): void {
    this.isLoadingOrders.set(true);
    this.adminService.getAllOrders().subscribe({
      next: (res) => {
        if (res.success) this.orders.set(res.data ?? []);
        this.isLoadingOrders.set(false);
      },
      error: () => this.isLoadingOrders.set(false),
    });
  }

  toggleOrderExpand(id: number): void {
    this.expandedOrderId.set(this.expandedOrderId() === id ? null : id);
  }

  changeOrderStatus(orderId: number, newStatus: string): void {
    this.updatingOrderId.set(orderId);
    this.adminService.updateOrderStatus(orderId, { status: newStatus }).subscribe({
      next: (res) => {
        if (res.success) {
          this.orders.update((list) =>
            list.map((o) => (o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o))
          );
          this.showSuccess(`Order #${orderId} status updated to "${newStatus}".`);
        }
        this.updatingOrderId.set(null);
      },
      error: () => {
        this.error.set('Failed to update order status.');
        this.updatingOrderId.set(null);
      },
    });
  }

  // ── Helpers ──
  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'status-pending', Processing: 'status-processing',
      Shipped: 'status-shipped', Delivered: 'status-delivered', Cancelled: 'status-cancelled',
    };
    return map[status] ?? 'status-pending';
  }

  roleClass(role: string): string {
    const map: Record<string, string> = {
      Admin: 'role-admin', Seller: 'role-seller', Customer: 'role-customer',
    };
    return map[role] ?? 'role-customer';
  }

  formatDate(iso: string): string {
    if (!iso) return 'N/A';
    const d = new Date(iso.includes('Z') ? iso : iso + 'Z');
    return isNaN(d.getTime()) ? 'N/A' :
      d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  userInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }
}
