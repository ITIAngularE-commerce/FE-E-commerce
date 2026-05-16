import { Component, computed, inject, signal } from '@angular/core';
import { Order, OrderStatus } from '../../../interfaces/order.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private location = inject(Location);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isCancelling = signal(false);
  isUpdatingStatus = signal(false);
  selectedStatus = signal<string>('');

  // ── Role helpers ──────────────────────────────────────────────────────────
  // Adjust this computed to match however your AuthService exposes the role.
  // Common patterns: this.authService.currentUser()?.role  OR  this.authService.role()
  isAdmin = computed(() => {
    const user = this.authService.currentUser?.();
    return user?.role === 'Admin';
  });

  readonly orderStatusOptions: OrderStatus[] = [
    'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled',
  ];

  // Progress steps shown in the tracker (Cancelled handled separately)
  readonly progressSteps: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.router.navigate(['/orders']);
      return;
    }
    this.loadOrder(id);
  }

  loadOrder(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.order.set(res.data);
          this.selectedStatus.set(res.data.status);
        } else {
          this.error.set(res.message ?? 'Failed to load order.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Order not found or you do not have permission to view it.');
        this.isLoading.set(false);
      },
    });
  }

  // ── Customer: cancel order ────────────────────────────────────────────────
  cancelOrder(): void {
    const o = this.order();
    if (!o || !confirm(`Cancel order #${o.id}?`)) return;
    this.isCancelling.set(true);
    this.orderService.cancelOrder(o.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.order.set(res.data);
          this.selectedStatus.set(res.data.status);
          this.showSuccess('Order cancelled successfully.');
        }
        this.isCancelling.set(false);
      },
      error: () => {
        this.error.set('Failed to cancel order.');
        this.isCancelling.set(false);
      },
    });
  }

  // ── Admin: update status ──────────────────────────────────────────────────
  updateStatus(): void {
    const o = this.order();
    const newStatus = this.selectedStatus();
    if (!o || newStatus === o.status) return;
    this.isUpdatingStatus.set(true);
    this.orderService.updateOrderStatus(o.id, { status: newStatus }).subscribe({
      next: (res) => {
        if (res.success) {
          this.order.set(res.data);
          this.showSuccess(`Status updated to "${newStatus}".`);
        }
        this.isUpdatingStatus.set(false);
      },
      error: () => {
        this.error.set('Failed to update order status.');
        this.isUpdatingStatus.set(false);
        // reset dropdown to current order status
        this.selectedStatus.set(this.order()?.status ?? newStatus);
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  stepIndex(status: string): number {
    return this.progressSteps.indexOf(status as OrderStatus);
  }

  currentStepIndex = computed(() =>
    this.stepIndex(this.order()?.status ?? '')
  );

  isCancelled = computed(() => this.order()?.status === 'Cancelled');

  canCancel = computed(() => {
    const s = this.order()?.status;
    return s === 'Pending' || s === 'Processing';
  });

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'chip-pending', Processing: 'chip-processing',
      Shipped: 'chip-shipped', Delivered: 'chip-delivered', Cancelled: 'chip-cancelled',
    };
    return map[status] ?? 'chip-pending';
  }

  paymentIcon(method: string): string {
    if (method === 'CreditCard') return '💳';
    if (method === 'CashOnDelivery') return '💵';
    if (method === 'PayPal') return '🅿';
    return 'fa-solid fa-wallet';
  }

  formatDate(iso: string): string {
    if (!iso) return 'N/A';
    const d = new Date(iso.includes('Z') ? iso : iso + 'Z');
    return isNaN(d.getTime()) ? 'N/A' :
      d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/orders']);
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }
}
