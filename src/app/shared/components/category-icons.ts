import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cat-icon',
  standalone: true,
  template: `
    @switch (name) {
      @case ('electronics') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      }
      @case ('fashion') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path
            d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"
          />
        </svg>
      }
      @case ('home') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      }
      @case ('beauty') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path
            d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
          />
        </svg>
      }
      @case ('sports') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <path
            d="M4.93 4.93c4.08 4.08 10.05 5.27 15.07 3.07M4.93 19.07c4.08-4.08 5.27-10.05 3.07-15.07M19.07 19.07c-4.08-4.08-10.05-5.27-15.07-3.07"
          />
        </svg>
      }
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class CatIcon {
  @Input() name: string = '';
}
