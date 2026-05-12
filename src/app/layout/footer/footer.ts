import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  links = {
    company: [
      { label: 'About us', route: '/about' },
      { label: 'Careers', route: '/careers' },
      { label: 'Press', route: '/press' },
      { label: 'Blog', route: '/blog' },
    ],
    support: [
      { label: 'Help center', route: '/help' },
      { label: 'Contact us', route: '/contact' },
      { label: 'Returns', route: '/returns' },
      { label: 'Order tracking', route: '/track' },
    ],
    legal: [
      { label: 'Privacy policy', route: '/privacy' },
      { label: 'Terms of service', route: '/terms' },
      { label: 'Cookie policy', route: '/cookies' },
    ],
  };
}
