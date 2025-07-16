import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [NgClass],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
   currentSlide = signal(0);
  constructor() {
    setInterval(() => {
      const next = (this.currentSlide() + 1) % this.slides.length;
      this.currentSlide.set(next);
    }, 5000);
  }
  slides = [
    {
      bg: 'url("images/login-signup-bg.svg")',
      overlayImg: 'images/carousel-1.svg',
      title: 'Value Proposition #1',
      subtitle: 'Lorem ipsum dolor sit amet consectetur. Viverra leo amet dictum etiam sed.. Pretium scelerisque turpis at morbi.'
    },
    {
      bg: 'url("images/login-signup-bg.svg")',
      overlayImg: 'images/carousel-2.svg',
      title: 'Value Proposition #1',
      subtitle: 'Lorem ipsum dolor sit amet consectetur. Viverra leo amet dictum etiam sed.. Pretium scelerisque turpis at morbi.'
    },
    {
      bg: 'url("images/login-signup-bg.svg")',
      overlayImg: 'images/carousel-3.svg',
      title: 'Value Proposition #1',
      subtitle: 'Lorem ipsum dolor sit amet consectetur. Viverra leo amet dictum etiam sed.. Pretium scelerisque turpis at morbi.'
    },
    {
      bg: 'url("images/login-signup-bg.svg")',
      overlayImg: 'images/carousel-4.svg',
      title: 'Value Proposition #1',
      subtitle: 'Lorem ipsum dolor sit amet consectetur. Viverra leo amet dictum etiam sed.. Pretium scelerisque turpis at morbi.'
    }
  ];
}
