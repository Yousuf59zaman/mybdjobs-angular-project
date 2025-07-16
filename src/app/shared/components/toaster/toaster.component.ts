import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, inject, Input, input, signal } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';


@Component({
  selector: 'app-toaster',
  imports: [NgClass,CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss'
})
export class ToasterComponent {
    @Input() message = signal<string| null>(null);
    isVisible = signal(true);
    iconClass = computed(() => this.toaster.iconClass());
    imageUrl = computed(() => this.toaster.imageUrl());
    borderColor = computed(() => this.toaster.borderColor());
    toaster  = inject(ToasterService);

  tMessage = computed(() => this.toaster.message());
  tIsVisible = computed(() => this.toaster.isVisible());

  closeToast() {
    this.toaster.hide();
  }
 

}
