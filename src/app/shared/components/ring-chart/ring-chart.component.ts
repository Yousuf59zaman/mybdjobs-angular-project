import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-ring-chart',
  imports: [NgStyle],
  templateUrl: './ring-chart.component.html',
  styleUrl: './ring-chart.component.scss'
})
export class RingChartComponent implements OnInit {
  backgroundColor = input('#F2F4F7')
  progressColor = input('#0DB14B')
  achievedProgress = input(50)
  progressValue = signal(0)

  progress = computed(() => this.progressValue())

  ngOnInit(): void {
    this.animateProgress(this.achievedProgress() > 0 ? this.achievedProgress() : 0)
  }

  animateProgress(target: number) {
    const duration = 1500;
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
