import { AfterViewInit, Component, computed, effect, ElementRef, inject, Injector, input, OnChanges, runInInjectionContext, SimpleChanges, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'line-chart',
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnChanges, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  readonly chartName = input('Appplication')
  readonly labels = input<string[]>();
  readonly dataPoints = input<number[]>();
  chart: any = [];
  private injector = inject(Injector);

  staticLabels = [
    '01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb',
    '06 Feb', '07 Feb', '08 Feb', '09 Feb'
  ];

  staticDataPoints = [62, 22, 36, 48, 15, 60, 15, 30, 55, 80];

  tickMaxRange = computed(
    () => Math.max(...this.dataPoints() as number[])
  )

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      this.initGraph();

      effect(() => {
        this.setGraphPoints();
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['labels'] && changes['labels'].currentValue && changes['labels'].currentValue.length &&
      changes['dataPoints'] && changes['dataPoints'].currentValue && changes['dataPoints'].currentValue.length
    ) {
      const labels = this.labels();
      const data = this.dataPoints();
      this.setGraphPoints();
    }
  }

  setGraphPoints() {
    this.chart.data = {
      ...this.chart.data,
      labels: this.labels(),
      datasets: [
        {
          fill: true,
          backgroundColor: this.getBgColor(),
          borderColor: "#C63C92",
          tension: 0.4,
          label: 'Application',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          data: this.dataPoints()?.length ? this.dataPoints() : this.staticDataPoints,
        },
      ],
    }
    this.chart.options.scales = {
      y: {
        ...this.chart.options.scales.y,
        max: this.tickMaxRange() > 0 ? Math.ceil(this.tickMaxRange()/10)*10 : 100,
        ticks: { stepSize: this.tickMaxRange() > 0 ? Math.ceil(this.tickMaxRange()/10) : 20 }
      },
      x: {
        grid: { display: false }
      }
    }
    this.chart.update();
  }

  getBgColor() {
    const ctx = this.canvasRef.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(198, 60, 146, 0.3)');
    gradient.addColorStop(1, 'rgba(198, 60, 146, 0)');

    return gradient;
  }

  initGraph() {
    const canvas = this.canvasRef.nativeElement;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.labels()?.length ? this.labels() : this.staticLabels,
        datasets: [
          {
            fill: true,
            backgroundColor: this.getBgColor(),
            borderColor: "#C63C92",
            tension: 0.4,
            label: 'Application',
            data: this.dataPoints()?.length ? this.dataPoints() : this.staticDataPoints,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,

          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false
          },

        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: false },
            min: 0,
            max: 100,
            ticks: { stepSize: 20 }
          },
          x: {
            grid: { display: false }
          }
        },
        onHover: (event) => {
          const points = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, false);
          if (points.length) {
            const firstPoint = points[0];
            const datasetIndex = firstPoint.datasetIndex;
            const index = firstPoint.index;

            const dataset = this.chart.data.datasets[datasetIndex];

            dataset.pointRadius = dataset.data.map(() => 0);
            dataset.pointBackgroundColor = dataset.data.map(() => 'transparent');
            dataset.pointBorderColor = dataset.data.map(() => 'transparent');

            dataset.pointRadius[index] = 4;
            dataset.pointBackgroundColor[index] = '#C63C92';
            dataset.pointBorderColor[index] = '#C63C92';
            dataset.pointBorderWidth = 1;

            // Trigger the tooltip manually
            this.chart.setActiveElements([
              { datasetIndex, index }
            ]);
            this.chart.tooltip.setActiveElements(
              [{ datasetIndex, index }],
              { x: event.x, y: event.y }
            );

            this.chart.update();
          } else {
            // Clear active elements if no point is near
            this.chart.setActiveElements([]);
            this.chart.tooltip.setActiveElements([], { x: 0, y: 0 });
            this.chart.update();
          }
        }

      },
    });
  }

}
