import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { NavbarComponent } from "../navbar/navbar";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Footer, NavbarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
