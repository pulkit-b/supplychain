import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VedantaService } from 'src/app/services/vedanta.service';
import { environment } from '../../../../environments/environment';
import { Planningresult } from '../../../models/planningresult';
import { Planningdata } from '../../../models/planningdata';
import * as $ from 'jquery';
@Component({
  selector: 'app-planning-results',
  templateUrl: './planning-results.component.html',
  styleUrls: ['./planning-results.component.css']
})
export class PlanningResultsComponent implements OnInit {
  public loading: false;
  public model: any = {
    username: '',
    password: ''
  };
  public dbfinaldata = [];
  public Month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public JSONbject: Object = Object;
  public cDate: any = new Date();
  public cMonth = this.cDate.getMonth();
  public currentquarter = Math.floor((this.cMonth + 3) / 3);
  public dbdata: any;
  selectedItems = [];
  dropdownSettings = {};
  public mdata = [
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar'
  ];
  public keysData = [
    'Total Alumina Requirement',
    'P1',
    'P2',
    'Lanjigarh Alumina Supply',
    'P1',
    'P2'
  ];
  public cKey = [];
  public childKey = [
    'total_alumina_req',
    'alumina_req_P1',
    'alumina_req_P2',
    'total_lanjigarh_supply',
    'alumina_lanjigarh_supply_p1',
    'alumina_lanjigarh_supply_p2',
    'year'
  ];
  public loginType: any;

  public formControlList = [{ fc: 'p1' }, { fc: 'p2' }, { fc: 'p3' }, { fc: 'q1' }, { fc: 'p4' }, { fc: 'p5' }, { fc: 'p6' }, { fc: 'q2' }, { fc: 'p7' }, { fc: 'p8' }, { fc: 'p9' }, { fc: 'q3' }, { fc: 'p10' }, { fc: 'p11' }, { fc: 'p12' }, { fc: 'q4' }];
  public cYear: any;
  public nYear: any;
  public planningResults = [];
  public open = true;
  public displayedListObj = [];

  public yearObject = [{ 'value': this.cDate.getFullYear() - 1, 'key': this.cDate.getFullYear() - 1 + "-" + (this.cDate.getFullYear()).toString().substr(-2) }, { 'value': this.cDate.getFullYear(), 'key': this.cDate.getFullYear() + "-" + (this.cDate.getFullYear() + 1).toString().substr(-2) }, { 'value': this.cDate.getFullYear() + 1, 'key': this.cDate.getFullYear() + 1 + "-" + (this.cDate.getFullYear() + 2).toString().substr(-2) }]

  public selectedYear: any = this.cDate.getFullYear() + "-" + (Number(this.cDate.getFullYear()) + 1).toString().substr(-2);
  public selectedMonth: any = [];
  constructor(public router: Router, public nlgnlqService: VedantaService) {
    let userInfo = JSON.parse(localStorage.getItem('userDetails'))
    this.loginType = userInfo[0]['UserLocation'].toLowerCase()
    this.getPlanningResult(this.selectedYear);
  }

  // employees = employees;
  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      // selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };

    this.getCurrentFiscalYear();

  }
  onItemSelect(item: any) {
    this.changeMonth(this.getMonthIndex(item))


  }

  onItemDeSelect(item) {
    // console.log(item)
    let m = this.selectedMonth.indexOf(this.getMonthIndex(item))
    this.selectedMonth.splice(m, 1)
    this.showData();
  }
  onSelectAll(items: any) {
    // console.log(items);

  }
  changeYear(year) {
    this.selectedYear = year;
    this.getPlanningResult(year);
    this.changeMonth('none');
    this.selectedMonth = [];
  }

  changeMonth(month) {
    if (month === 'none') {
      this.selectedMonth = [];
      this.showData();
    } else {
      this.selectedMonth.push(month);
      this.showData();
    }

  }
  showData() {
    let d: any;
    let list: any

    if (this.selectedMonth.length == 0) {
      list = this.displayedListObj.filter(x => x.fiscalyear === this.selectedYear);
      d = Planningresult.getRequestData(
        list,
        this.cMonth,
        this.currentquarter,
        this.cDate,
        this.selectedYear.split("-")[0],
        this.loginType
      );
    } else {
      
      list = this.displayedListObj.filter(x => this.selectedMonth.indexOf(Number(x.month)) >= 0 && x.fiscalyear === this.selectedYear);

      d = Planningresult.getRequestData(
        list,
        this.cMonth,
        this.currentquarter,
        this.cDate,
        this.selectedYear.split("-")[0],
        this.loginType
      );
    }
    // console.log(d.data, this.selectedMonth)
    let finaldatavalue = [];
   if(this.selectedMonth.length>0){
    d.data.forEach((element,index) => {
      let a = {}
      for (const [index, [key, value]] of Object.entries(Object.entries(element))) {

        for (const [index1, [key1, value1]] of Object.entries(Object.entries(value))) {
         let k = key1.split(" ")
          let mon = this.getMonthIndex(k[0]);
          
          if(this.selectedMonth.indexOf(mon)>=0){
           let objlen = Object.keys(a).length;
           if(objlen == 0)
             a[key] = {[key1]:value1}
            else{
              Object.assign(a[key],{[key1]:value1})
            }
           
          }
          
          if(key1=='Quarter1' && (this.selectedMonth.indexOf(4)>=0 || this.selectedMonth.indexOf(5)>=0 || this.selectedMonth.indexOf(6)>=0)){
            Object.assign(a[key],{[key1]:value1})
            
          }else if(key1=='Quarter2' && (this.selectedMonth.indexOf(7)>=0 || this.selectedMonth.indexOf(8)>=0 || this.selectedMonth.indexOf(9)>=0)){
            Object.assign(a[key],{[key1]:value1})
            
          }else if(key1=='Quarter3' && (this.selectedMonth.indexOf(10)>=0 || this.selectedMonth.indexOf(11)>=0 || this.selectedMonth.indexOf(12)>=0)){
            Object.assign(a[key],{[key1]:value1})
            
          }else if(key1=='Quarter4' && (this.selectedMonth.indexOf(1)>=0 || this.selectedMonth.indexOf(2)>=0 || this.selectedMonth.indexOf(3)>=0)){
            Object.assign(a[key],{[key1]:value1})
            
          }

       }
      }
      finaldatavalue.push(a)
    }); 
  } else {
    finaldatavalue = d.data;
  }
    // this.planningResults = d.data;
    this.planningResults = finaldatavalue;
    this.cKey = d.keys;
  }

  toggleSidenav() {
    this.open = !this.open;
  }
  getCurrentFiscalYear() {
    const today = new Date();
    // get current month
    const curMonth = today.getMonth();
    const fiscalYr = '';
    if (curMonth > 3) {
      //
      const nextYr1 = (today.getFullYear() + 1).toString();
      this.cYear = today.getFullYear().toString();
      this.nYear = nextYr1;
    } else {
      const nextYr2 = today.getFullYear().toString();
      this.cYear = today.getFullYear().toString();
      this.nYear = nextYr2;
    }
    const q = [4, 1, 2, 3];
    this.currentquarter = q[Math.floor(curMonth / 3)];
  }


  getPlanningResult(year) {
    this.nlgnlqService.showLoader();
    let payload = { 'type': this.loginType }
    this.nlgnlqService.getPlanningResult(payload).then((s: any) => {
      this.displayedListObj = s.success;
      const list = s.success.filter(x => x.fiscalyear === year);
      // console.log(list)
      const d = Planningresult.getRequestData(
        list,
        this.cMonth,
        this.currentquarter,
        this.cDate,
        year.split("-")[0],
        this.loginType
      );
      this.nlgnlqService.hideLoader();
      this.planningResults = d.data;
      this.cKey = d.keys;

    });
  }

  updatevalue(event, key, col, row) {
    let useQueryKey = '';
    const querysum = 0;
    const monthKey = key.split(' ');

    const q = [4, 1, 2, 3];
    const quarter = q[Math.floor(this.getMonthIndex(monthKey[0]) / 3)];
    if (quarter == 1) {
      useQueryKey = 'Quarter1_3';
    }
    if (quarter == 2) {
      useQueryKey = 'Quarter2_7';
    }
    if (quarter == 3) {
      useQueryKey = 'Quarter3_11';
    }
    if (quarter == 4) {
      useQueryKey = 'Quarter4_15';
    }

    const currentValue = event.target.value;
    let total = 0;
    let startCol = 0;
    if (col >= 4 && col <= 6) { startCol = 4; }
    if (col >= 8 && col <= 10) { startCol = 8; }
    if (col >= 12 && col <= 14) { startCol = 12; }
    const startColEnd = startCol + 2;
    for (let i = startCol; i <= startColEnd; i++) {
      total = total + parseFloat($('#row_' + i + '_' + row).val());
    }
    $('#' + useQueryKey + '_' + row).val(total);
  }

  createId(key, row, col) {
    let a = '';
    switch (key) {
      case 'Quarter1':
      case 'Quarter2':
      case 'Quarter3':
      case 'Quarter4':
        a = key + '_' + col + '_' + row;

        switch (this.childKey[row]) {
          case 'total_alumina_req':
          case 'total_lanjigarh_supply':
            a = 'readonly_' + col + '_' + row;
            break;
          default:
            break;
        }

        break;
      default:
        a = 'row_' + col + '_' + row;
        switch (this.childKey[row]) {
          case 'total_alumina_req':
          case 'total_lanjigarh_supply':
            a = 'readonly_' + col + '_' + row;
            break;
          default:
            break;
        }
        break;
    }

    return a;
  }

  getMonthName(name) {
    if (name == 0) { return 'Jan'; }
    if (name == 1) { return 'Feb'; }
    if (name == 2) { return 'Mar'; }
    if (name == 3) { return 'Apr'; }
    if (name == 4) { return 'May'; }
    if (name == 5) { return 'Jun'; }
    if (name == 6) { return 'Jul'; }
    if (name == 7) { return 'Aug'; }
    if (name == 8) { return 'Sep'; }
    if (name == 9) { return 'Oct'; }
    if (name == 10) { return 'Nov'; }
    if (name == 11) { return 'Dec'; }
  }

  getMonthIndex(key: any) {
    if (key == 'Jan') { return 1; }
    if (key == 'Feb') { return 2; }
    if (key == 'Mar') { return 3; }
    if (key == 'Apr') { return 4; }
    if (key == 'May') { return 5; }
    if (key == 'Jun') { return 6; }
    if (key == 'Jul') { return 7; }
    if (key == 'Aug') { return 8; }
    if (key == 'Sep') { return 9; }
    if (key == 'Oct') { return 10; }
    if (key == 'Nov') { return 11; }
    if (key == 'Dec') { return 12; }
  }

  capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }


  onSubmitData() {
    let finaldata = []
    let pushdata = {}
    let th = this;

    $(':input[type=number]:not([readonly="readonly"])').each(function (e, v) {
      let vals = $(this).attr('name').split(":");
      switch (vals[0]) {
        case "alumina_req_P1":
          if (pushdata[vals[2]] === undefined)
            pushdata[vals[2]] = {}
          pushdata[vals[2]]['p1'] = $(this).val();
          pushdata[vals[2]]['year'] = vals[2].split(" ")[1];
          pushdata[vals[2]]['month'] = th.getMonthIndex(vals[2].split(" ")[0]);
          pushdata[vals[2]]['username'] = localStorage.getItem('userEmail');
          pushdata[vals[2]]['type'] = th.loginType;
          break;
        case "alumina_req_P2":

          if (pushdata[vals[2]] === undefined)
            pushdata[vals[2]] = {}
          pushdata[vals[2]]['p2'] = $(this).val();
          pushdata[vals[2]]['year'] = vals[2].split(" ")[1];
          pushdata[vals[2]]['month'] = th.getMonthIndex(vals[2].split(" ")[0]);
          pushdata[vals[2]]['username'] = localStorage.getItem('userEmail');
          pushdata[vals[2]]['type'] = th.loginType;
          break;
        case "alumina_lanjigarh_supply_p1":
          if (pushdata[vals[2]] === undefined)
            pushdata[vals[2]] = {}
          pushdata[vals[2]]['lp1'] = $(this).val();
          pushdata[vals[2]]['year'] = vals[2].split(" ")[1];
          pushdata[vals[2]]['month'] = th.getMonthIndex(vals[2].split(" ")[0]);
          pushdata[vals[2]]['username'] = localStorage.getItem('userEmail');
          pushdata[vals[2]]['type'] = th.loginType;

          break;
        case "alumina_lanjigarh_supply_p2":
          if (pushdata[vals[2]] === undefined)
            pushdata[vals[2]] = {}
          pushdata[vals[2]]['lp2'] = $(this).val();
          pushdata[vals[2]]['year'] = vals[2].split(" ")[1];
          pushdata[vals[2]]['month'] = th.getMonthIndex(vals[2].split(" ")[0]);
          pushdata[vals[2]]['username'] = localStorage.getItem('userEmail');
          pushdata[vals[2]]['type'] = th.loginType;
          break;
        case "total_alumina_req_balco":
          if (pushdata[vals[2]] === undefined)
            pushdata[vals[2]] = {}
          pushdata[vals[2]]['total_alumina_req_balco'] = $(this).val();
          pushdata[vals[2]]['year'] = vals[2].split(" ")[1];
          pushdata[vals[2]]['month'] = th.getMonthIndex(vals[2].split(" ")[0]);
          pushdata[vals[2]]['username'] = localStorage.getItem('userEmail');
          pushdata[vals[2]]['type'] = th.loginType;
          break;
        case "total_lanjigarh_supply_balco":
          if (pushdata[vals[2]] === undefined)
            pushdata[vals[2]] = {}
          pushdata[vals[2]]['total_lanjigarh_supply_balco'] = $(this).val();
          pushdata[vals[2]]['year'] = vals[2].split(" ")[1];
          pushdata[vals[2]]['month'] = th.getMonthIndex(vals[2].split(" ")[0]);
          pushdata[vals[2]]['username'] = localStorage.getItem('userEmail');
          pushdata[vals[2]]['type'] = th.loginType;
          break;
      }
    })
    let a = Object.keys(pushdata).length;
    if (a > 0)
      finaldata.push({ 'data': pushdata })
    this.nlgnlqService.showLoader();
    // console.log(pushdata)
    this.nlgnlqService.updatePlanningResult(pushdata).then((s: any) => {
      this.nlgnlqService.hideLoader();
      // this.getPlanningResult(this.selectedYear);
      window.location.reload()
    });


  }
  readonlyField(i, j, val: string, fieldValue) {
    // console.log(i, j, val)
    if ( (val.startsWith('Quarter')) || i == 2 || i == 5 || i == 6 || i == 7 || i == 8) {
      return true;
    }
    if (!val.startsWith('Quarter')) {
      var month = this.getMonthIndex(val.split(' ')[0]);
      var year = parseInt(val.split(' ')[1]);

      var createdTime = new Date(`${month}-01-${year}`).valueOf();
      var currentMonthYear = new Date(`${this.getMonthName(new Date().getMonth())}-01-${new Date().getFullYear()}`).valueOf();
      if (createdTime < currentMonthYear) {
        return true;
      }
    }

    if (fieldValue === 0) return true;


  }
}

