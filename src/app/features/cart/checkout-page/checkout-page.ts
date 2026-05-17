// src/app/features/checkout/checkout.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AddressService, Address, CreateAddressDto } from '../../../core/services/address.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CreateOrderRequest } from '../../../interfaces/order.interface';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './checkout-page.html',
    styleUrls: ['./checkout-page.css']
})
export class CheckoutComponent implements OnInit {
    private cartService = inject(CartService);
    private orderService = inject(OrderService);
    private paymentService = inject(PaymentService);
    private addressService = inject(AddressService);
    private notif = inject(NotificationService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    // State
    addresses = signal<Address[]>([]);
    selectedAddressId = signal<number | null>(null);
    isLoading = signal(true);
    isProcessing = signal(false);
    showAddressForm = signal(false);
    error = signal<string | null>(null);
    cart = signal<any>(null);

    // Cart totals
    itemCount = signal(0);
    subtotal = signal(0);
    shipping = signal(0);
    total = signal(0);

    // Payment
    selectedPaymentMethod = signal<'CreditCard' | 'CashOnDelivery'>('CreditCard');

    // Address form
    addressForm: FormGroup = this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: [''],
        country: ['Egypt', [Validators.required]],
        zipCode: [''],
        isDefault: [false]
    });

    ngOnInit(): void {
        this.loadCart();
        this.loadAddresses();
    }

    loadCart(): void {
        this.isLoading.set(true);
        this.cartService.getCart().subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.cart.set(res.data);
                    const items = res.data.items ?? [];
                    const sub = items.reduce((sum: number, i: any) => sum + i.subtotal, 0);
                    this.itemCount.set(items.reduce((sum: number, i: any) => sum + i.quantity, 0));
                    this.subtotal.set(sub);
                    this.shipping.set(sub >= 50 ? 0 : 5.99);
                    this.total.set(sub + this.shipping());
                } else {
                    this.cart.set({ items: [] });
                }
                this.isLoading.set(false);
            },
            error: () => {
                this.notif.error('Error', 'Failed to load cart');
                this.cart.set({ items: [] });
                this.isLoading.set(false);
            }
        });
    }

    loadAddresses(): void {
        this.addressService.getAddresses().subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.addresses.set(res.data);
                    const defaultAddr = this.addresses().find(a => a.isDefault);
                    if (defaultAddr) {
                        this.selectedAddressId.set(defaultAddr.id);
                    } else if (this.addresses().length > 0) {
                        this.selectedAddressId.set(this.addresses()[0].id);
                    }
                }
            },
            error: (err) => {
                console.error('Failed to load addresses', err);
            }
        });
    }

    selectAddress(addressId: number): void {
        this.selectedAddressId.set(addressId);
    }

    addAddress(): void {
        if (this.addressForm.invalid) {
            Object.keys(this.addressForm.controls).forEach(key => {
                this.addressForm.get(key)?.markAsTouched();
            });
            return;
        }

        const dto: CreateAddressDto = this.addressForm.value;
        this.addressService.addAddress(dto).subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.addresses.update(prev => [...prev, res.data!]);
                    this.selectedAddressId.set(res.data!.id);
                    this.showAddressForm.set(false);
                    this.addressForm.reset({ country: 'Egypt', isDefault: false });
                    this.notif.success('Address Added', 'Your new address has been saved.');
                }
            },
            error: (err) => {
                this.notif.error('Error', err.error?.message || 'Failed to add address');
            }
        });
    }

    selectPaymentMethod(method: 'CreditCard' | 'CashOnDelivery'): void {
        this.selectedPaymentMethod.set(method);
    }

    placeOrder(): void {
        if (!this.selectedAddressId()) {
            this.notif.warning('No Address', 'Please select a shipping address');
            return;
        }

        if (this.itemCount() === 0) {
            this.notif.warning('Empty Cart', 'Your cart is empty');
            return;
        }

        this.isProcessing.set(true);
        this.error.set(null);

        const orderRequest: CreateOrderRequest = {
            addressId: this.selectedAddressId()!,
            paymentMethod: this.selectedPaymentMethod()
        };

        this.orderService.createOrder(orderRequest).subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    const order = res.data;

                    if (this.selectedPaymentMethod() === 'CreditCard') {
                        this.paymentService.initiatePayment(order.id).subscribe({
                            next: (paymentRes) => {
                                if (paymentRes.success && paymentRes.data?.iframeUrl) {
                                    window.open(paymentRes.data.iframeUrl, '_blank');
                                    this.router.navigate(['/order-confirmation', order.id]);
                                } else {
                                    this.notif.error('Payment Failed', paymentRes.message || 'Payment initiation failed');
                                    this.isProcessing.set(false);
                                }
                            },
                            error: (err) => {
                                this.notif.error('Payment Failed', err.error?.message || 'Failed to initiate payment');
                                this.isProcessing.set(false);
                            }
                        });
                    } else {
                        // ✅ Cash on Delivery
                        this.notif.success('Order Placed!', 'Your order has been placed successfully.');
                        setTimeout(() => {
                            this.router.navigate(['/order-confirmation', order.id]);
                        }, 1500);
                    }
                } else {
                    this.notif.error('Order Failed', res.message || 'Failed to create order');
                    this.isProcessing.set(false);
                }
            },
            error: (err) => {
                this.notif.error('Order Failed', err.error?.message || 'Failed to create order');
                this.isProcessing.set(false);
            }
        });
    }

    goBackToCart(): void {
        this.router.navigate(['/cart']);
    }
}