import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})

export class ProgressBarComponent {
  @Input() set TotalPoint(value: number) {
    this.points.set(value || 0);
  }
  @Input() maxPoints = 2000;
  points = signal(0);

  get progressWidth() {
    return Math.min((this.points() / this.maxPoints) * 100, 100);
  }
}
