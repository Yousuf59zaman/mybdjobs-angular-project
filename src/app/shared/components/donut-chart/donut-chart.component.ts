import { Component, ViewChild, ElementRef, AfterViewInit, input, effect, computed, inject, Injector, OnChanges, runInInjectionContext, SimpleChanges } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends keyof ChartTypeRegistry> {
    centerText?: {
      text?: string;
    };
  }
}

Chart.register({
  id: 'centerText',
  beforeDraw(chart) {
    const text = chart.options.plugins?.centerText?.text;
    if (!text) return;

    const { width, height, ctx } = chart;
    ctx.save();
    ctx.font = '600 24px sans-serif';
    ctx.fillStyle = '#101828';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();
  }
});

@Component({
  selector: 'donut-chart',
  standalone: true,
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss'
})
export class DonutChartComponent implements AfterViewInit, OnChanges {
  readonly data = input<number[]>([]);
  readonly labels = input<string[]>([])
  @ViewChild('chartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  private injector = inject(Injector);

  readonly backgroundColor = computed(() => {
    const len = this.data().length;
    if (len === 0) return ['#DCE1E4'];
    if (len === 2) return ['#0E6596', '#F79009'];
    if (len === 3) return ['#0E6596', '#1D9DDA', '#F79009'];
    if (len >= 4) return ['#0E6596', '#1D9DDA', '#F79009', '#079455'];
    return ['#DCE1E4'];
  });
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] && changes['data'].currentValue && changes['data'].currentValue.length) {
      this.setChartData();
    }
  }

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      this.initChart();

      effect(() => {
        this.setChartData();
      });
    });
  }

  setChartData() {
    if (this.chart) {
      const newData = this.data().length > 0 ? this.data() : [100];
      this.chart.data.datasets[0].data = newData;
      this.chart.data.datasets[0].backgroundColor = this.backgroundColor();
      this.chart.data.datasets[0].borderWidth = this.data().length > 0 ? 1 : 0;
      this.chart.data.labels = this.labels();
  
      const centerValue = this.getCenterValue();
      (this.chart.options.plugins as any).centerText.text = centerValue;
  
      this.chart.update();
    }
  }

  private getCenterValue(): string {
    const sum = this.data().reduce((total, val) => total + val, 0);
    return sum > 0 ? sum.toString() : '0';
  }
  
  private initChart() {
    const canvas = this.canvasRef.nativeElement;
    const centerValue = this.getCenterValue();
    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.labels(), 
        datasets: [{
          label: '',
          data: this.data().length > 0 ? this.data() : [100],
          backgroundColor: this.backgroundColor(),
          borderWidth: this.data().length > 0 ? 1 : 0
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          centerText: {
            text: centerValue
          },
          tooltip:{
            callbacks:{
              label:(context) => {
                const originData = this.data();
                if(originData.length === 0){
                  return `Count: 0`;
                }

                const value = context.parsed;
                return `Count: ${value}`;
              }
            }
          }
        },
        
      }
    });
  }
}
