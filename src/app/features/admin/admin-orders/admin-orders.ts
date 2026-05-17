import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Order } from '../../../interfaces/order.interface';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  private adminService = inject(AdminService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  updatingId = signal<number | null>(null);
  expandedId = signal<number | null>(null);
  successMessage = signal<string | null>(null);
  error = signal<string | null>(null);

  search = signal('');
  statusFilter = signal('All');

  readonly statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  readonly orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  filteredOrders = computed(() => {
    const q = this.search().toLowerCase();
    return this.orders().filter(
      (o) =>
        (this.statusFilter() === 'All' || o.status === this.statusFilter()) &&
        (!q || o.trackingCode.toLowerCase().includes(q) || String(o.id).includes(q)),
    );
  });

  ngOnInit() {
    this.adminService.getAllOrders().subscribe({
      next: (res) => {
        if (res.success) this.orders.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleExpand(id: number) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  changeStatus(orderId: number, newStatus: string) {
    this.updatingId.set(orderId);
    this.adminService.updateOrderStatus(orderId, { status: newStatus }).subscribe({
      next: (res) => {
        if (res.success) {
          this.orders.update((list) =>
            list.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
          );
          this.showSuccess(`Order status updated to ${newStatus}.`);
        }
        this.updatingId.set(null);
      },
      error: () => {
        this.error.set('Failed to update order status.');
        this.updatingId.set(null);
      },
    });
  }

  statusClass(status: string): string {
    return (
      {
        Pending: 'status-pending',
        Processing: 'status-processing',
        Shipped: 'status-shipped',
        Delivered: 'status-delivered',
        Cancelled: 'status-cancelled',
      }[status] ?? 'status-pending'
    );
  }

  formatDate(iso: string) {
    if (!iso) return 'N/A';
    const d = new Date(iso.includes('Z') ? iso : iso + 'Z');
    return isNaN(d.getTime())
      ? 'N/A'
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  private showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }
}
