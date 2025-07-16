import { Component, ElementRef, input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'line-chart',
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  readonly chartName = input('Appplication')
  readonly labels = input<string[]>();
  chart: any = [];

  constructor() { }

  ngOnInit() {
    const canvas: any = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(198, 60, 146, 0.3)');
    gradient.addColorStop(1, 'rgba(198, 60, 146, 0)');

    // const labels = [
    //   '01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb',
    //   '06 Feb', '07 Feb', '08 Feb', '09 Feb', '10 Feb'
    // ];

    const dataPoints = [62, 22, 36, 48, 15, 60, 15, 60, 55, 80];




    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.labels(),
        datasets: [
          {
            fill: true,
            backgroundColor: gradient,
            borderColor: "#C63C92",
            tension: 0.4,
            label: '# of Votes',
            data: dataPoints,
            borderWidth: 2,
            pointRadius: 0, // start with no visible points
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

  ngOnChanges(changes: SimpleChanges): void {

  }

}
