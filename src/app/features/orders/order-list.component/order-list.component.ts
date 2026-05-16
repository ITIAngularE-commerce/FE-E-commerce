import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../interfaces/order.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent {
  private orderService = inject(OrderService);
  private router = inject(Router);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  expandedOrderId = signal<number | null>(null);
  cancellingId = signal<number | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        if (res.success) this.orders.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load orders. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  toggleExpand(id: number): void {
    this.expandedOrderId.set(this.expandedOrderId() === id ? null : id);
  }

  cancelOrder(id: number): void {
    if (!confirm('Cancel this order?')) return;
    this.cancellingId.set(id);
    this.orderService.cancelOrder(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.orders.update((list) =>
            list.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o))
          );
          this.showSuccess('Order cancelled successfully.');
        }
        this.cancellingId.set(null);
      },
      error: () => {
        this.error.set('Failed to cancel order.');
        this.cancellingId.set(null);
      },
    });
  }

  canCancel(status: OrderStatus): boolean {
    return status === 'Pending';
  }

  statusClass(status: OrderStatus): string {
    const map: Record<string, string> = {
      Pending: 'status-pending',
      Processing: 'status-processing',
      Shipped: 'status-shipped',
      Delivered: 'status-delivered',
      Cancelled: 'status-cancelled',
    };
    return map[status] ?? 'status-pending';
  }

  statusIcon(status: OrderStatus): string {
    const map: Record<string, string> = {
      Pending: 'fa-regular fa-clock',
      Processing: 'fa-solid fa-gear',
      Shipped: 'fa-solid fa-truck',
      Delivered: 'fa-solid fa-circle-check',
      Cancelled: 'fa-solid fa-circle-xmark',
    };

    return map[status] ?? 'fa-regular fa-clock';
  }
  formatDate(iso: string): string {
    if (!iso) return 'N/A';
    const normalized = iso.includes('Z') ? iso : iso + 'Z';
    const d = new Date(normalized);
    return isNaN(d.getTime())
      ? 'N/A'
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }
}
