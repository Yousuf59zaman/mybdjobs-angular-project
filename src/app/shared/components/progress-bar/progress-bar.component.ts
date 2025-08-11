import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  imports: [
    NgClass
  ],
  template: `
    <div class="flex flex-col justify-center gap-1.5">
      <div class="flex items-center justify-between">
        <label class="text-primary-700 text-xs">{{label().length ? label() : ''}}</label>
        <span
          class=" font-semibold text-xs"
          [style.color]="progressBarColor()"
          [ngClass]="{'hidden': !isShowAchievedProgress()}"
        >{{(totalProgressValue() ? totalProgressValue() : achievedProgress())}}</span>
      </div>
      <div class="flex w-full h-1.5 bg-[{{backgroundColor()}}] rounded-full overflow-hidden" role="progressbar"
          [style.background]="backgroundColor()"
      >
        <div class="h-1.5 flex flex-col justify-center rounded-full overflow-hidden bg-[{{progressBarColor()}}] text-xs
          text-white text-center whitespace-nowrap transition duration-500"
          [style.width]="width()"
          [style.background]="progressBarColor()"
          ></div>
      </div>
    </div>
  `,
})
export class ProgressBarComponent {
  label = input('');
  achievedProgress = input(0);
  totalProgressValue = input(0);
  minValue = input(0);
  maxValue = input(100);
  backgroundColor = input('#F0F0F0')
  progressBarColor = input('#C63C92')
  isShowAchievedProgress = input(true);

  // range
  width = computed(()=>{
    return `${(this.achievedProgress() - this.minValue())/ (this.maxValue() - this.minValue())*100}%`
  })
}
