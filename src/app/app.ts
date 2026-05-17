import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from "./shared/components/notification/notification";
import { ProductModals } from './shared/components/product-modals/product-modals';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent, ProductModals],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}