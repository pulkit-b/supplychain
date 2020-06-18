import { Component, OnInit } from '@angular/core';
import { VedantaService } from 'src/app/services/vedanta.service';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { NgxPowerBiService } from "ngx-powerbi";
@Component({
  selector: 'app-chartering-dashboard',
  templateUrl: './chartering-dashboard.component.html',
  styleUrls: ['./chartering-dashboard.component.scss']
})
export class CharteringDashboardComponent implements OnInit {
  private pbiContainerElement: HTMLElement;
  public windowHeight:any;
  public open = true;
  public currentMonth: any;
  public startMonthYear: any = { year: 1789, month: 7 };
  public isMonthSelected: any = false;
  public calendarData: any = [];
  public loadPortSelectedValue;
  public arrivalMonthVal;
  public quantityVal;
  public chartsData: any = {};
  public startdisplay:any=0
  public currentMonthVal;
  public barChartLabels: any = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012'
  ];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public maindata: any;
  public barChartData: any = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public doughnutChartLabels = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales'
  ];
  public doughnutChartData: any = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  public doughnutChartType = 'doughnut';

  public lineChartData: any = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ];
  public lineChartLabels: any = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ];

  public lineChartType = 'line';

  constructor(private powerBiService: NgxPowerBiService ,public vedentaService: VedantaService) {}

  ngOnInit() {
    // const d = new Date();
    // this.currentMonth = d.getMonth() + 1;
    // this.startMonthYear = {
    //   year: 2019,
    //   month: Number(parseInt(this.currentMonth))
    // };
    // this.arrivalMonthVal = this.currentMonth;
    // // this.authForm.patchValue({
    // //   arrivalMonthVal: this.arrivalMonthVal
    // // });
    // this.isMonthSelected = false;
    // setTimeout(() => {}, 1000);
    // const formdata = {
    //   month: this.vedentaService.currentMonth,
    //   year: this.vedentaService.currentYear
    // };
    // this.callChange(formdata);
    let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
    var sendpayload
    if (userlocation.UserLocation.toLowerCase() == 'balco') {
      sendpayload = {
        "reportId": environment.balco_chartering_reportId
      }
    }
    else{
      sendpayload = {
        "reportId": environment.jsg_chartering_reportId
      }
    }
    this.vedentaService.getAzureToken(sendpayload).then((s: any) => {
      // const d = JSON.parse(s.token);
      // localStorage.setItem('tokenAD', d.access_token);
      // // window.location.reload();
      // this.getEmbedReport();
       // const d = JSON.parse(s);
       localStorage.setItem('tokenAD', s.accessToken);
       // window.location.reload();
       this.getEmbedReport();
    });
  }
  getEmbedReport(){
    setTimeout(() => {
      this.powerBiService = new NgxPowerBiService();
      this.pbiContainerElement = <HTMLElement>(
        document.getElementById("reportContainer")
      );
      let config:any;
      let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
      var client = window['powerbi-client'];
     
      //console.log(userlocation.UserLocation)
      if (userlocation.UserLocation.toLowerCase() == 'balco') {
          config  = {
            type: "report",
            id: environment.balco_chartering_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.balco_chartering_reportId+"" +
            "&groupId="+environment.balco_chartering_groupId+"",
            accessToken: localStorage.getItem("tokenAD") ,
            tokenType: client.models.TokenType.Embed,
            permissions: client.models.Permissions.All,
            settings: {
              filterPaneEnabled: false,
              navContentPaneEnabled: false
            }
          }; 

      } else {
          config  = {
            type: "report",
            id: environment.jsg_chartering_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.jsg_chartering_reportId+"" +
            "&groupId="+environment.jsg_chartering_groupId+"",
            accessToken: localStorage.getItem("tokenAD") ,
            tokenType: client.models.TokenType.Embed,
            permissions: client.models.Permissions.All,
            settings: {
              filterPaneEnabled: false,
              navContentPaneEnabled: false
            }
          }; 
      }
      this.powerBiService.embed(this.pbiContainerElement, config);
      this.windowHeight = ($(window).height() - 112)+'px';
    }, 1000);
  }
  generateBarChartData(chartname, data) {
    let value_count = 0;
    const value = [];
    const value1 = [];
    // let ar = [];
    const lab = [];
    data.forEach(element => {
      value_count = 1;
      value.push(element.value);
      lab.push(element.name);
      if (element.value1 !== null || element.value1 !== undefined) {
        value_count = 2;
        value1.push(element.value1);
      }
    });
    if (value_count === 2) {
      this.chartsData[chartname] = {
        data: [
          { data: value, label: 'Target' },
          { data: value1, label: 'Trend' }
        ],
        labels: lab
      };
    } else {
      this.chartsData[chartname] = {
        data: [{ data: value, label: 'Series A' }],
        labels: lab
      };
    }
    // ////console.log(this.chartsData);
  }

  generateDoughnutChartData(chartname, data) {
    const value = [];
    const lab = [];
    data.forEach(element => {
      if (element.value === null || element.value === undefined) {
        value.push(0);
      } else {
        value.push(element.value);
      }
      lab.push(element.name);
    });
    this.chartsData[chartname] = {
      data: [{ data: value, label: 'Series A' }],
      labels: lab,
      colors: [
        {
          // grey
          backgroundColor: ['#006699', '#66CC33'],
          borderColor: ['#006699', '#66CC33']
          // pointBackgroundColor: 'rgba(148,159,177,1)',
          // pointBorderColor: '#fff',
          // pointHoverBackgroundColor: '#fff',
          // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
      ]
    };
    ////console.log(this.chartsData);
  }

  updateVal(name, value) {
    // this.authForm.patchValue({ [name]: value });
    switch (name) {
      case 'arrivalMonthVal':
        this.currentMonth = value;
        this.callMonth(value);
        this.callChange({
          month: value,
          year: this.vedentaService.currentYear
        });
        break;
      default:
        break;
    }
  }
  toggleSidenav() {
    this.open = !this.open;
    ////console.log(this.open);
  }
  callChange(formdata) {
    this.vedentaService.showLoader();
    this.vedentaService.getChartsData(formdata).then(data => {
      data = data['success'];
      this.maindata = data;
      ////console.log(this.maindata);
      // this.chartsData = data;
      // this.chartsData["preberthing"] = data['pre'];
      this.generateBarChartData('preberthing', data['pre']);
      // this.chartsData["preberthingdischarge"] = data['PreBerthingDischarge']
      this.generateBarChartData(
        'preberthingdischarge',
        data['PreBerthingDischarge']
      );
      this.generateDoughnutChartData('avgpreberthing', data['avgPreBerthing']);
      this.generateBarChartData('linelp', data['lineLp']);
      this.generateBarChartData('linedp', data['lineDp']);
      this.generateDoughnutChartData(
        'adherancetolaycan',
        data['adherancetolaycan']
      );
      this.generateBarChartData('voyage', data['voyage']);
      this.startdisplay = 1;
      let winscreen = screen.width
      if(winscreen>1900){
        $(".moadlbox1").css('left','19%')
        $(".moadlbox2").css('left','25%')
        $(".moadlbox5").css('right','19%')
      }
    
      this.vedentaService.hideLoader();
    });
  }
  callMonth(e) {
    this.startMonthYear = { year: 2019, month: Number(parseInt(e)) };

    if (this.loadPortSelectedValue && this.quantityVal != '') {
      $('#loader').css('display', 'block');
      this.getProcurementData().then((s: any) => {
        this.calendarData = s.success;
        this.isMonthSelected = true;
        $('#loader').css('display', 'none');
        setTimeout(() => {
          // this.dp.navigateTo(this.startMonthYear);
        }, 1000);
      });
    }
  }

  getProcurementData() {
    return new Promise((resolve, reject) => {
      const payload = {
        // loadPort: this.authForm.value.loadPortVal,
        month: this.startMonthYear.month,
        year: this.startMonthYear.year
        // quantity: this.authForm.value.quantityVal
      };
      this.vedentaService
        .getCalendarData(payload)
        .then(s => {
          // resolve(s)
        })
        .then(s => {
          this.vedentaService.getCalendarDataValues(payload).then(s => {
            resolve(s);
          });
        });
    });
  }
}
