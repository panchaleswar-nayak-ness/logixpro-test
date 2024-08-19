import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import * as echarts from 'echarts';
import { pieChartData } from 'src/app/common/Model/utilization-report';

@Component({
  selector: 'app-utilization-piechart',
  templateUrl: './utilization-piechart.component.html',
  styleUrls: ['./utilization-piechart.component.scss']
})
export class UtilizationPiechartComponent implements OnChanges {
  @Input() statusData: pieChartData[] = [];
   @Input() isCarousel: boolean; 
  @ViewChildren('chartContainer', { read: ElementRef }) chartContainers!: QueryList<ElementRef>;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusData']) {
      // Initialize charts only if statusData is updated
      if (this.statusData && this.statusData.length > 0) {
        // Ensure the view is updated before initializing charts
        setTimeout(() => this.initCharts(), 0);
      }
    }
  }

  ngAfterViewInit(): void {
    // Initialize charts once the view has been initialized
   
    if (this.statusData && this.statusData.length > 0) {
      this.initCharts();
    }
  }



  getUtilizationDetails(percentage: number): { class: string, color: any } {
    if (percentage < 50) {
        return { class: 'very-low-utilization', color: 'var(--clr-pure-black)' };
    } else if (percentage > 50 && percentage < 70) {
        return { class: 'low-utilization', color: 'var(--clr-pure-white)' };
    } else if (percentage >= 70 && percentage < 80) {
        return { class: 'medium-utilization', color: 'var(--clr-pure-white)' };
    } else if (percentage >= 80 && percentage < 90) {
        return { class: 'high-utilization', color: 'var(--clr-pure-white)' };
    } else if (percentage >= 90) {
        return { class: 'very-high-utilization', color: 'var(--clr-pure-white)' };
    } else {
        return { class: 'very-low-utilization', color: 'var(--clr-pure-white)' };
    }
}


  

  initCharts(): void {
    const secondary800 = getComputedStyle(document.documentElement).getPropertyValue('--clr-secondary-800').trim();
    const secondary600 = getComputedStyle(document.documentElement).getPropertyValue('--clr-secondary-600').trim();
    const secondary400 = getComputedStyle(document.documentElement).getPropertyValue('--clr-secondary-400').trim();
    const secondary100 = getComputedStyle(document.documentElement).getPropertyValue('--clr-secondary-100').trim();


    this.chartContainers.toArray().forEach((container: ElementRef, index: number) => {
      const chartElement = container.nativeElement.querySelector(`.chart-${index}`);
      if (chartElement && this.statusData[index]) {
        const chart = echarts.init(chartElement);
        const item = this.statusData[index]; // Get the corresponding item
        const label = this.isCarousel?'Carousel':'Bulk'

        const option: echarts.EChartsOption = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            data: [
              'Used Locations',
              'Dedicated Location',
              'Dedicated with Zero Quantity',
              'Empty Locations',
            ],
            textStyle: {
              fontSize: 9,
            },
            itemHeight: 10,
          },
          color: [
            secondary800,
            secondary600,
            secondary400,
            secondary100,
          ],

          series: [
            {
              name: `${label} ${item.carousel}`,
              type: 'pie',
              radius: ['15%', '40%'],
              labelLine: {
                length: 20
              },
              itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 2
              },

              label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#F6F8FC',
                borderColor: '#8C8D8E',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#6E7079',
                    lineHeight: 16,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#8C8D8E',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                  },
                  b: {
                    color: '#4C5058',
                    fontSize: 10,
                    fontWeight: 'bold',
                    lineHeight: 22
                  },
                  per: {
                    color: '#fff',
                    backgroundColor: '#4C5058',
                    padding: [3, 4],
                    borderRadius: 4,
                    fontSize:10,
                  }
                }
              },
              data: [
                { value: item.usedLocation, name: 'Used Locations' },
                { value: item.totalDedicated, name: 'Dedicated Location' },
                { value: item.totalDedicatedWithEmptyItemQuantity, name: 'Dedicated with Zero Quantity' },
                { value: item.emptyLocations, name: 'Empty Locations' },
              ]
            }
          ]
        };
        chart.setOption(option);
      } else {
        console.error(`Chart element .chart-${index} or data item not found.`);
      }
    });
  }
}
