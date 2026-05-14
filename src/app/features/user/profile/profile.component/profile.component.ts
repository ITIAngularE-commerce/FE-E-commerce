import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile.service';
import { Address, UserProfile } from '../../../../interfaces/profile.interface';

type ActiveTab = 'info' | 'addresses' | 'security';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);

  activeTab = signal<ActiveTab>('info');
  profile = signal<UserProfile | null>(null);
  // profile = this.profileService.profile;
  addresses = signal<Address[]>([]);
  isLoadingProfile = signal(true);
  isLoadingAddresses = signal(false);
  isSavingProfile = signal(false);
  isSavingAddress = signal(false);
  profileError = signal<string | null>(null);
  addressError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showAddressForm = signal(false);
  editingAddressId = signal<string | null>(null);

  profileForm!: FormGroup;
  addressForm!: FormGroup;

  userInitials = computed(() => {
    const name = this.profile()?.fullName ?? '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  roleBadgeClass = computed(() => {
    const role = this.profile()?.role?.toLowerCase();
    if (role === 'admin') return 'badge-admin';
    if (role === 'seller') return 'badge-seller';
    return 'badge-customer';
  });

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
    this.loadAddresses();
  }

  private initForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)]],
    });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', Validators.required],
      isDefault: [false],
    });
  }

  loadProfile(): void {
    this.isLoadingProfile.set(true);
    this.profileError.set(null);
    this.profileService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.profile.set(res.data);
          this.profileForm.patchValue({
            fullName: res.data.fullName,
            // phoneNumber: res.data.phoneNumber === 'string' ? '' : res.data.phoneNumber,
            phoneNumber: typeof res.data.phoneNumber === 'string' ? res.data.phoneNumber : '',
          });
        }
        this.isLoadingProfile.set(false);
      },
      error: () => {
        this.profileError.set('Failed to load profile. Please try again.');
        this.isLoadingProfile.set(false);
      },
    });
  }

  loadAddresses(): void {
    this.isLoadingAddresses.set(true);
    this.profileService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.isLoadingAddresses.set(false);
      },
      error: () => {
        this.isLoadingAddresses.set(false);
      },
    });
  }

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
    this.successMessage.set(null);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSavingProfile.set(true);
    this.successMessage.set(null);
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.profile.set(res.data);
          this.showSuccess('Profile updated successfully!');
        }
        this.isSavingProfile.set(false);
      },
      error: () => {
        this.profileError.set('Failed to update profile.');
        this.isSavingProfile.set(false);
      },
    });
  }

  openAddressForm(address?: Address): void {
    this.showAddressForm.set(true);
    this.editingAddressId.set(address?.id ?? null);
    if (address) {
      this.addressForm.patchValue(address);
    } else {
      this.addressForm.reset({ isDefault: false });
    }
  }

  closeAddressForm(): void {
    this.showAddressForm.set(false);
    this.editingAddressId.set(null);
    this.addressForm.reset();
  }

  saveAddress(): void {
    if (this.addressForm.invalid) return;
    this.isSavingAddress.set(true);
    const editId = this.editingAddressId();
    const obs = editId
      ? this.profileService.updateAddress(editId, this.addressForm.value)
      : this.profileService.addAddress(this.addressForm.value);

    obs.subscribe({
      next: () => {
        this.loadAddresses();
        this.closeAddressForm();
        this.showSuccess(editId ? 'Address updated!' : 'Address added!');
        this.isSavingAddress.set(false);
      },
      error: () => {
        this.addressError.set('Failed to save address.');
        this.isSavingAddress.set(false);
      },
    });
  }

  deleteAddress(id: string): void {
    this.profileService.deleteAddress(id).subscribe({
      next: () => {
        this.addresses.update((list) => list.filter((a) => a.id !== id));
        this.showSuccess('Address removed.');
      },
    });
  }

  setDefault(id: string): void {
    this.profileService.setDefaultAddress(id).subscribe({
      next: () => {
        this.loadAddresses();
        this.showSuccess('Default address updated.');
      },
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }


  formatDate(iso: string): string {
    if (!iso) return 'N/A';
    const normalized = iso.includes('Z') ? iso : iso + 'Z';
    return new Date(normalized).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}
