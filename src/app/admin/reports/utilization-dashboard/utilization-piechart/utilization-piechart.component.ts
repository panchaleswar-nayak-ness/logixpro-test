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
  @ViewChildren('chartContainer', { read: ElementRef }) chartContainers!: QueryList<ElementRef>;

  constructor() {}

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

  getUtilizationClass(utilizedPercentage: number): string {
    if (utilizedPercentage <= 50) {
      return 'very-low-utilization'; // or any class name you prefer
    } else if (utilizedPercentage > 50 && utilizedPercentage < 70) {
      return 'low-utilization'; // or any class name you prefer
    } else if (utilizedPercentage >= 70 && utilizedPercentage < 80) {
      return 'medium-utilization'; // or any class name you prefer
    } else if (utilizedPercentage >= 80 && utilizedPercentage < 90) {
      return 'high-utilization'; // or any class name you prefer
    } else if (utilizedPercentage >= 90) {
      return 'very-high-utilization'; // or any class name you prefer
    } else {
      return 'default-utilization'; // Fallback class name, if needed
    }
  }

  initCharts(): void {
    this.chartContainers.toArray().forEach((container: ElementRef, index: number) => {
      const chartElement = container.nativeElement.querySelector(`.chart-${index}`);
      if (chartElement && this.statusData[index]) {
        const chart = echarts.init(chartElement);
        const item = this.statusData[index]; // Get the corresponding item

        // Debugging: Log item and index
        console.log(`Rendering chart for index ${index}`, item);

      const option: echarts.EChartsOption = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            data: [
              'Utilized Locations',
              'Dedicated Location',
              'Dedicated with Zero Quantity',
              'Empty Locations',
            ],
            textStyle:{
              fontSize:14,
            },
            itemHeight:20
          },
          color:[ 
         "#653490",
         "#8E51C4",
         "#B277E6",
         "#E7D0FC",
        ],
          
          series: [
            {
              name: 'Carousel',
              type: 'pie',
              radius: ['35%', '70%'],
              labelLine: {
                length: 30
              },
              itemStyle: {
                borderRadius: 10,
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
                    lineHeight: 22,
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
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 33
                  },
                  per: {
                    color: '#fff',
                    backgroundColor: '#4C5058',
                    padding: [3, 4],
                    borderRadius: 4
                  }
                }
              },
              data: [
                { value: item.totalDedicatedWithEmptyItemQuantity, name: 'Dedicated with Zero Quantity' },
                { value: item.totalDedicated, name: 'Dedicated Location' },
                { value: item.emptyLocations, name: 'Empty Locations' },
                { value: item.utilizedLocations, name: 'Utilized Locations' }
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
