import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { AccordionChild, AccordionItem, MainMenuItems } from '../../../shared/models/sidebar';
import { SidebarAccordionService } from '../../../shared/services/sidebar-accordion.service';



@Component({
  selector: 'app-sidebar',
  imports: [NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
 private accordionService = inject(SidebarAccordionService);
 private router = inject(Router);

  userName = input('Kamrul Hosen Lizon');
  profileCompleteScore = input(80);
  // isSidebarOpen = input(false);
  @Output() sideBarToggleEmitter = new EventEmitter<boolean>();

  sideBarItems = MainMenuItems;
  
  toggleAccordion(item: AccordionItem): void {
    item.isActive = !item.isActive;
  }

  onClickMenuItem(item: AccordionItem) {
    this.sideBarItems = this.sideBarItems.map(
      singleItem => {
        if(singleItem.id !== item.id && singleItem.items.length && this.isOpen(singleItem.id) ) {
          this.toggle(singleItem.id);
          singleItem.items = singleItem.items.map(
            child => {
              return {...child, isSelected: false};
            }
          )
        }
        return {
          ...singleItem,
          isActive: item.id === singleItem.id ? singleItem.items.length ? !singleItem.isActive : true : false //!singleItem.isActive
        }
      }
    )
    if(item.items.length) {
      this.toggle(item.id);
    } else {
      this.sideBarToggleEmitter.emit(false);
      this.navigateToUrl(item.routeLink as string);
    }
  }

  onClickChildItem(itemId: string, child: AccordionChild) {
    this.sideBarItems = this.sideBarItems.map(
      singleItem => {
        return {
          ...singleItem,
          items: itemId === singleItem.id
            ? singleItem.items.map(
              singleChild => {
                return {
                  ...singleChild,
                  isSelected: singleChild.title === child.title ? true : false,
                }
              })
            : singleItem.items.map(
              singleChild => {
                return {
                  ...singleChild,
                  isSelected: false,
                }
              }
            )
        }
      }
    )
    this.sideBarToggleEmitter.emit(false);
    this.navigateToUrl(child.link);
  }

  navigateToUrl(path: string) {
    this.router.navigate([path]);
  }

  onClickGetPro() {}

  isOpen(id: string) {
    return this.accordionService.isOpen(id)();
  }

  toggle(id: string) {
    this.accordionService.toggle(id);
  }

}
