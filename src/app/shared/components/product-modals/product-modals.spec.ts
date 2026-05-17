import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModals } from './product-modals';

describe('ProductModals', () => {
  let component: ProductModals;
  let fixture: ComponentFixture<ProductModals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductModals],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductModals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
