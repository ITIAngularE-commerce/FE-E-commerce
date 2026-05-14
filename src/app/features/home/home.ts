import { Component } from '@angular/core';
import { Hero } from "./hero/hero";
import { CategoriesSection } from "./categories-section/categories-section";
import { FeaturedProducts } from "./featured-products/featured-products";
import { Trending } from "./trending/trending";

@Component({
  selector: 'app-home',
  imports: [Hero, CategoriesSection, FeaturedProducts, Trending],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
