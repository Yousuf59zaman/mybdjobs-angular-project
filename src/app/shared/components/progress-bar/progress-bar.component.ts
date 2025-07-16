import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  label = input('Total Points');
  achievedProgress = input(50);
  minValue = input(0);
  maxValue = input(100);
  backgroundColor = input('#F0F0F0')
  progressBarColor = input('#C63C92')

  // range
  width = computed(()=>{
    return `${(this.achievedProgress() - this.minValue())/ (this.maxValue() - this.minValue())*100}%`
  })
}
