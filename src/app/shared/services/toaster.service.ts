// toaster.service.ts
import { Injectable } from '@angular/core';
import { Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  message = signal<string | null>(null);
  isVisible = signal(false);
  iconClass = signal<string>('');
  imageUrl = signal<string | null>(null);
  borderColor = signal<'bg-[#D92D20]' | 'bg-[#079455]'>('bg-[#079455]');
  

  show(message: string, 
    options?: {
      iconClass?: string;
      imageUrl?: string | null;
      borderColor?: 'bg-[#D92D20]' | 'bg-[#079455]';
    },
    duration = 6000) {
    this.message.set(message);
    this.iconClass.set(options?.iconClass ?? '');
    this.imageUrl.set(options?.imageUrl ?? null);
    this.borderColor.set(options?.borderColor ?? 'bg-[#079455]');
    this.isVisible.set(true);
    setTimeout(() => this.hide(), duration);
  }

  hide() {
    this.isVisible.set(false);
    setTimeout(() => {
      this.message.set(null);
    }, 500);
  }
}
