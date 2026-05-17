import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private notif = inject(NotificationService);

  isLoading = signal(true);
  isSubmitting = signal(false);

  profileForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
  };

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/user/profile`).subscribe({
      next: (res) => {
        const data = res.data;
        this.profileForm = {
          fullName: data.fullName ?? '',
          email: data.email ?? '',
          phoneNumber: data.phoneNumber ?? '',
        };
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  saveProfile() {
    this.isSubmitting.set(true);
    this.http.put<any>(`${environment.apiUrl}/user/profile`, this.profileForm).subscribe({
      next: () => {
        this.notif.success('Saved!', 'Profile updated successfully');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }
}
