import { Component, Input, OnChanges, SimpleChanges, ElementRef, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-gauge-meter',
  standalone: true,
  template: `<div #chartContainer class="chart"></div>`,
  styles: [
    `.chart { width: 160px; height: 180px; }
    @media (max-width: 992px) {
    .chart {
      height: 170px; 
      width:135px/* Adjust height for smaller screens */
    }
  }

  @media (max-width: 480px) {
    .chart {
      height: 170px; 
      width:105px/* Adjust height for smaller screens */
    }
  }
`
  ]
})
export class GaugeMeterComponent implements AfterViewInit, OnChanges {
  @Input() value: number = 0;
  private chart!: echarts.ECharts;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.initChart();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
   
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private initChart() {
    const dom = this.el.nativeElement.querySelector('.chart');
    this.chart = echarts.init(dom);
    this.updateChart();
  }

  private updateChart() {
    const windowWidth = window.innerWidth;
  let axisLineWidth = 16; 

  if (windowWidth < 480) {
    axisLineWidth = 11;
  } else if (windowWidth < 992) {
    axisLineWidth = 14.3; 
  }
    const option = {
      // title: { text: 'EChart Gauge', left: 'center' },
      animationDuration:3000,
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        progress: { show: false, width: 10 },
        axisLine: {
          roundCap: false,
          lineStyle: {
            width: axisLineWidth,
            color: [
              [0.33, '#D1FACF'],
              [0.67, '#23C21E'],
              [1, '#00801F']
            ]
          }
        },
        
        axisTick: { show: false }, 
        splitLine: { length: 15, lineStyle: { width: 0, color: 'black' } },
        axisLabel: { show: false, distance: 5, color: 'black', fontSize: 14 },
        pointer: { length: '98%', width: 8, itemStyle: { color: 'black',  
         },icon: 'path://M10,90 L50,90 L30,10 Z', },
        anchor: { show: true, size: 8, offsetCenter: [0, '0%'], itemStyle: { color:'#000',borderWidth: 2, borderColor:'black' } },
        detail: { show: false },
        data: [{ value: this.value }]
      }]
    };
    this.chart.setOption(option);
  }
  private onResize() {
    this.updateChart();
    if (this.chart) {
      this.chart.resize(); // Resize the chart when the window resizes
    }
  }
}
