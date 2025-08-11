import { AfterViewInit, Component, computed, ElementRef, input, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'half-donut-chart',
  imports: [],
  templateUrl: './half-donut-chart.component.html',
  styleUrl: './half-donut-chart.component.scss'
})
export class HalfDonutChartComponent implements AfterViewInit {

  readonly total = input.required<number>()
  readonly used = input.required<number>()
  readonly title = input('Title')
  readonly subtitle = input('Sub Title')

  @ViewChildren('myCanvas') canvasRef!: QueryList<ElementRef<HTMLCanvasElement>>;

  readonly progress = computed(() => (this.used() / (this.total() ? this.total() : 1)))

  private ctx!: CanvasRenderingContext2D;
  private readonly centerX = 130;
  private readonly centerY = 130;
  private readonly radius = 47;
  private readonly baseLineWidth = 9;
  private readonly highlightColor = '#C63C92';
  private readonly baseColor = '#DCE1E4';
  private currentAngle = 0;


  ngAfterViewInit(): void {
    queueMicrotask(() => {
      requestAnimationFrame(() => {
        this.canvasRef.forEach(canvasRef => {
          const canvas = canvasRef.nativeElement;
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const ctx = canvas.getContext('2d')!;
          this.animate(ctx, canvas);
        });
      });
    });
  }

  private drawBaseArc(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/1.15);
    ctx.rotate(Math.PI); // rotate 180°
    ctx.beginPath();
    ctx.lineWidth = this.baseLineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.baseColor;
    ctx.arc(0, 0, this.radius, 0.01, Math.PI - 0.01, false);
    ctx.stroke();
    ctx.restore();
  }

  private drawHighlightArc(ctx: CanvasRenderingContext2D, angle: number, canvas: HTMLCanvasElement) {
    if (angle <= 0) return;

    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/1.15);
    ctx.rotate(Math.PI);
    ctx.beginPath();
    ctx.lineWidth = this.baseLineWidth;
    ctx.strokeStyle = this.highlightColor;

    // draw as a line with visible start and end
    ctx.lineCap = 'round';
    ctx.arc(0, 0, this.radius, 0.01, angle - 0.01, false);
    ctx.stroke();
    ctx.restore();
  }

  private animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    let currentAngle = 0;
    const progress = Math.max(0, Math.min(1, this.progress()))
    const maxAngle = Math.PI * progress; // ✅ move here

    const animateStep = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBaseArc(ctx, canvas);

      if (maxAngle <= 0) return;

      if (currentAngle < maxAngle) {
        currentAngle += 0.01;
        if (currentAngle > maxAngle) currentAngle = maxAngle;
        this.drawHighlightArc(ctx, currentAngle, canvas);
        requestAnimationFrame(animateStep);
      } else {
        this.drawHighlightArc(ctx, currentAngle, canvas); // final frame
      }
    };
    animateStep();
  }
}
