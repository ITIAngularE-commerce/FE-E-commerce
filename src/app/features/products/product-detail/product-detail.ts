import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../interfaces/product.interface';
import { Review, ProductRating, CreateReviewRequest } from '../../../interfaces/review.interface';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';
import { WishlistItem } from '../../../interfaces/wishlist.interface';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, UpperCasePipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  authService = inject(AuthService);
  private notif = inject(NotificationService);
  private cartService = inject(CartService);

  //wishlist
  private wishlistService = inject(WishlistService);
  isWishlisted = signal(false);
  isTogglingWish = signal(false);

  product = signal<Product | null>(null);
  reviews = signal<Review[]>([]);
  rating = signal<ProductRating | null>(null);
  isLoading = signal(true);
  activeImg = signal(0);
  quantity = signal(1);
  isSubmitting = signal(false);
  addingToCartId = signal<number | null>(null);
  editingReviewId = signal<number | null>(null);

  newReview: CreateReviewRequest = { rating: 5, comment: '' };
  hoveredStar = 0;

  editReviewData = {
    comment: '',
    rating: 5,
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
    this.loadReviews(id);
    this.loadRating(id);

    // Check if product is in wishlist
    this.wishlistService.check(id).subscribe({
      next: (res) => this.isWishlisted.set(res.data),
    });
  }

  loadProduct(id: number) {
    this.productService.getById(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadReviews(id: number) {
    this.reviewService.getByProduct(id).subscribe({
      next: (res) => this.reviews.set(res.data),
    });
  }

  loadRating(id: number) {
    this.reviewService.getProductRating(id).subscribe({
      next: (res) => this.rating.set(res.data),
    });
  }

  setActiveImg(i: number) {
    this.activeImg.set(i);
  }

  increaseQty() {
    if (this.quantity() < (this.product()?.stock ?? 1)) this.quantity.update((q) => q + 1);
  }

  decreaseQty() {
    if (this.quantity() > 1) this.quantity.update((q) => q - 1);
  }

  submitReview() {
    if (!this.newReview.comment.trim()) return;
    this.isSubmitting.set(true);
    const id = this.product()!.id;
    this.reviewService.create(id, this.newReview).subscribe({
      next: () => {
        this.notif.success('Review added!', 'Thanks for your feedback');
        this.newReview = { rating: 5, comment: '' };
        this.loadReviews(id);
        this.loadRating(id);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notif.error('Cannot submit review', err?.error?.message || 'Something went wrong');
        this.isSubmitting.set(false);
      },
    });
  }

  startEdit(review: Review) {
    this.editingReviewId.set(review.id);

    this.editReviewData = {
      comment: review.comment,
      rating: review.rating,
    };
  }

  saveReview(reviewId: number) {
    if (
      !this.editReviewData.comment.trim() ||
      this.editReviewData.rating < 1 ||
      this.editReviewData.rating > 5
    ) {
      this.notif.error('Invalid data', 'Please enter valid review data');
      return;
    }

    this.reviewService
      .update(reviewId, {
        comment: this.editReviewData.comment,
        rating: this.editReviewData.rating,
      })
      .subscribe({
        next: () => {
          this.notif.success('Review updated!', 'Your review has been updated');

          this.editingReviewId.set(null);

          this.loadReviews(this.product()!.id);
          this.loadRating(this.product()!.id);
        },
        error: (err) => {
          this.notif.error('Cannot update review', err?.error?.message || 'Something went wrong');
        },
      });
  }

  cancelEdit() {
    this.editingReviewId.set(null);
  }

  deleteReview(reviewId: number) {
    this.reviewService.delete(reviewId).subscribe({
      next: () => {
        this.notif.success('Deleted', 'Review removed');
        this.loadReviews(this.product()!.id);
        this.loadRating(this.product()!.id);
      },
    });
  }

  getStars(n: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }
  isFullStar(rating: number, i: number): boolean {
    return i < Math.floor(rating);
  }

  toggleWishlist(): void {
    const id = this.product()?.id;
    if (!id) return;
    this.isTogglingWish.set(true);
    this.wishlistService.toggle(id).subscribe({
      next: (res) => {
        this.isWishlisted.set(res.data);
        this.isTogglingWish.set(false);
      },
      error: () => this.isTogglingWish.set(false),
    });
  }

  addToCart() {
    const product = this.product();
    if (!product) return;
    this.addingToCartId.set(product.id);
    this.cartService.addItem(product.id, this.quantity()).subscribe({
      next: () => {
        this.notif.success('Added!', `${product.name} added to cart`);
        this.addingToCartId.set(null);
      },
      error: (err) => {
        this.notif.error('Failed', err?.error?.message || 'Something went wrong');
        this.addingToCartId.set(null);
      },
    });
  }
}
