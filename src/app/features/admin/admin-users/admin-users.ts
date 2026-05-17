import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AdminUser } from '../../../interfaces/admin.interface';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);

  users = signal<AdminUser[]>([]);
  isLoading = signal(true);
  togglingUserId = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  error = signal<string | null>(null);

  search = signal('');
  roleFilter = signal('All');
  readonly roleOptions = ['All', 'Admin', 'Seller', 'Customer'];

  filteredUsers = computed(() => {
    const q = this.search().toLowerCase();
    return this.users().filter(
      (u) =>
        (this.roleFilter() === 'All' || u.role === this.roleFilter()) &&
        (!q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    );
  });

  ngOnInit() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        if (res.success) this.users.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleUser(user: AdminUser) {
    if (!confirm(`${user.isActive ? 'Deactivate' : 'Activate'} ${user.fullName}?`)) return;
    this.togglingUserId.set(user.id);
    this.adminService.toggleUser(user.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.users.update((list) =>
            list.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)),
          );
          this.showSuccess(`${user.fullName} ${user.isActive ? 'deactivated' : 'activated'}.`);
        }
        this.togglingUserId.set(null);
      },
      error: () => {
        this.error.set('Failed to update user.');
        this.togglingUserId.set(null);
      },
    });
  }

  roleClass(role: string) {
    return (
      { Admin: 'role-admin', Seller: 'role-seller', Customer: 'role-customer' }[role] ??
      'role-customer'
    );
  }

  formatDate(iso: string) {
    if (!iso) return 'N/A';
    const d = new Date(iso.includes('Z') ? iso : iso + 'Z');
    return isNaN(d.getTime())
      ? 'N/A'
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  userInitial(name: string) {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }

  private showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }
}
