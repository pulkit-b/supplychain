import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, OnChanges {
  @Input() import;
  @Input() domastic;

  public doughnutChartLabels = ['Import', 'Domestic'];
  public doughnutChartData = [this.import, this.domastic];
  public doughnutChartType = 'doughnut';
  @Input() chartColors: Color[] = [
    {
      // grey
      backgroundColor: '#A9A9AA',
      borderColor: '#A9A9AA'
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // dark grey
      backgroundColor: '#CA3F01',
      borderColor: '#CA3F01'
    }
  ];
  constructor() {}

  ngOnInit() {}
  ngOnChanges() {
    //console.log('----');
    //console.log(this.import);
    //console.log(this.domastic);
    this.doughnutChartData = [this.import, this.domastic];
  }
}
