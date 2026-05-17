import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Order } from '../../../interfaces/order.interface';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private orderSvc = inject(OrderService);
  private notif = inject(NotificationService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  selected = signal<Order | null>(null);

  // Stats computed from orders
  stats = signal({ total: 0, revenue: 0, pending: 0, delivered: 0 });

  statusColors: Record<string, string> = {
    Pending: '#c8a96e',
    Confirmed: '#4f9cf9',
    Processing: '#a78bfa',
    Shipped: '#34d399',
    Delivered: '#22c55e',
    Cancelled: '#f87171',
  };

  ngOnInit() {
    this.orderSvc.getSellerOrders().subscribe({
      next: (res) => {
        this.orders.set(res.data);
        this.computeStats(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  computeStats(orders: Order[]) {
    const active = orders.filter((o) => o.status !== 'Cancelled');
    this.stats.set({
      total: orders.length,
      revenue: active.reduce((s, o) => s + o.total, 0),
      pending: orders.filter((o) => o.status === 'Pending').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
    });
  }

  selectOrder(order: Order) {
    this.selected.set(this.selected()?.id === order.id ? null : order);
  }

  getColor(status: string): string {
    return this.statusColors[status] ?? '#c8a96e';
  }

  updateStatus(id: number, status: string) {
    this.orderSvc.updateStatus(id, status).subscribe({
      next: () => {
        this.notif.success('Updated!', `Order status changed to ${status}`);
        this.orders.update((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
        this.selected.update((o) => (o?.id === id ? { ...o!, status } : o));
        this.computeStats(this.orders());
      },
      error: (err) => this.notif.error('Failed', err?.error?.message || 'Something went wrong'),
    });
  }

  statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
}
