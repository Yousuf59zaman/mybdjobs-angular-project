import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

interface tooltip{
  id:string,
  title:string,
  description:string
}
@Component({
  selector: 'app-tooltips',
  imports: [NgClass],
  templateUrl: './tooltips.component.html',
  styleUrl: './tooltips.component.scss'
})
export class TooltipsComponent {
  readonly tooltext = input<string>('tooltext')
  readonly iconClass = input<string>('')
  readonly imgUrl = input<string>('')
  
  readonly tooltipArray = input<tooltip[]>([])
}