import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart-chartering',
  templateUrl: './chart-chartering.component.html',
  styleUrls: ['./chart-chartering.component.css']
})
export class ChartCharteringComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true
  };
  @Input() chartData;
  @Input() chartLabels;
  @Input() chartType;
  @Input() legend;
  @Input() chartOptions: ChartOptions = {
    responsive: true
  };
  @Input() chartColors: Color[] = [
    {
      // grey
      backgroundColor: '#1A73E8',
      borderColor: '#1A73E8'
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // dark grey
      backgroundColor: '#A9A9AA',
      borderColor: '#A9A9AA'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
