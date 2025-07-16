import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarAccordionService {
    private openAccordionId = signal<string | null>(null);

    isOpen = (id: string) => computed(() => this.openAccordionId() === id);
  
    toggle(id: string) {
      this.openAccordionId.set(this.openAccordionId() === id ? null : id);
    }
  
}