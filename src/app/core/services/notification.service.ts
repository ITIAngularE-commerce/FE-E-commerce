import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<Notification[]>([]);
  private counter = 0;

  show(type: NotificationType, title: string, message: string, duration = 4000) {
    const id = ++this.counter;
    this.notifications.update((n) => [...n, { id, type, title, message }]);
    setTimeout(() => this.remove(id), duration);
  }

  success(title: string, message: string) {
    this.show('success', title, message);
  }
  error(title: string, message: string) {
    this.show('error', title, message);
  }
  warning(title: string, message: string) {
    this.show('warning', title, message);
  }
  info(title: string, message: string) {
    this.show('info', title, message);
  }

  remove(id: number) {
    this.notifications.update((n) => n.filter((x) => x.id !== id));
  }
}
