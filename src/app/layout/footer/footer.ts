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

  socials = [
    {
      label: 'Twitter',
      url: 'https://twitter.com',
      icon: `<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18
        11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6
        4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>`,
    },
    {
      label: 'Instagram',
      url: 'https://instagram.com',
      icon: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
             <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
             <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`,
    },
    {
      label: 'Facebook',
      url: 'https://facebook.com',
      icon: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7
             a1 1 0 0 1 1-1h3z"/>`,
    },
  ];
}
