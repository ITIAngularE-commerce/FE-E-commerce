import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  role: 'Customer' | 'Seller' = 'Customer';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (!this.name || !this.email || !this.password) return;
    if (this.password !== this.confirmPassword) return;

    this.isLoading = true;

    const body: RegisterRequest = {
      fullName: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phone,
      role: this.role,
    };

    this.authService.register(body).subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });
  }
}
