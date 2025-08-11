import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, input, OnChanges, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ring-chart',
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './ring-chart.component.html',
  styleUrl: './ring-chart.component.scss'
})
export class RingChartComponent implements OnChanges {
  backgroundColor = input('#F2F4F7')
  progressColor = input('#0DB14B')
  achievedProgress = input(0)
  progressText = input('')
  progressValue = signal(0)
  language = input('en')

  progress = computed(() => this.progressValue())

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['achievedProgress'] && changes['achievedProgress'].currentValue) {
      this.animateProgress(this.achievedProgress() > 0 ? this.achievedProgress() : 0);
    }
  }

  animateProgress(target: number) {
    const duration = 1200;
    const frameRate = 60;
    const totalFrame = (duration / 1000) * frameRate;
    let currentFrame = 0;

    const interval = setInterval(() => {
      currentFrame++;
      const progressRatio = currentFrame / totalFrame
      const easedProgress = this.easeOutQuad(progressRatio)
      this.progressValue.set(Math.min(
        target,
        Math.round((currentFrame / totalFrame) * target)
      ));

      if (currentFrame >= totalFrame) {
        clearInterval
      }
    }, 1000 / frameRate)
  }

  easeOutQuad(t: number): number {
    return t * (2 - t);
  }
}
