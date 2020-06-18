import {
  Component,
  OnInit,
  OnChanges,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
  TemplateRef,
  ElementRef,
  NgZone
} from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VedantaService } from 'src/app/services/vedanta.service';
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDate,
  NgbDatepicker,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-procurement-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './procurement-dashboard.component.html',
  styleUrls: ['./procurement-dashboard.component.css']
})
export class ProcurementDashboardComponent implements OnInit, OnChanges {
  authForm: FormGroup;
  hoveredDate: NgbDate;
  modelDate: NgbDateStruct;
  fromDate: any = NgbDate;
  toDate: any = NgbDate;
  arrows = 'arrows';
  @ViewChild('dp') dp: NgbDatepicker;
  @ViewChild('content1') content1: ElementRef;

  public ports: any = JSON.parse(localStorage.getItem('Ports'));
  public plants: any = JSON.parse(localStorage.getItem('plants'));
  public today = new Date();
  public todayMonth = this.today.getMonth() + 1;
  public todayYear = this.today.getFullYear();
  public open = true;
  public startMonthYear: any = { year: 1789, month: 7 };
  public isMonthSelected: any = false;
  public currentMonth: any;
  public markDisabled: any = ['2019-07-06'];
  public yearDropDown: any = [this.today.getFullYear() - 1, this.today.getFullYear(), this.today.getFullYear() + 1, this.today.getFullYear() + 2]
  public calendarData: any = [];
  public checkData: any = [];
  public vessel_nameVal;
  public quantityVal;
  public ownerVal;
  public plantVal;
  public loadPortVal;
  public arrivalMonthVal;
  public currentMonthVal;
  public laycanSelected = '';
  public VesselPlacementSuggestion = '';
  public loadPortSelectedValue;
  public dischargePortSuggested;
  public potentialDemurrage;
  public tradeOffReason;
  public arrivalDate;
  public uiEnabledDisabled: any;
  public suggestedLaycan: any = '';
  public suggestedDropValue: any = [
    { source: 'JNPT' },
    { source: 'VIZAG' },
    { source: 'LONI' }
  ];
  public isonLoad: any = 0;
  // @Input() disableDate;
  constructor(
    private fb: FormBuilder,
    calendar: NgbCalendar,
    public vedentaService: VedantaService,
    private modalService: NgbModal,
    public ngZone: NgZone
  ) {
    this.authForm = this.fb.group({
      vessel_nameVal: [''],
      quantityVal: ['', Validators.required],
      ownerVal: ['', Validators.required],
      plantVal: ['', Validators.required],
      loadPortVal: ['', Validators.required],
      arrivalMonthVal: [this.currentMonth, Validators.required],
      dischargePortSuggested: ['', Validators.required],
      potentialDemurrage: [0, Validators.required],
      tradeOffReason: ['', Validators.required],
      userComment: [''],
      laycanSelected: [''],
      VesselPlacementSuggestion: [''],
      arrivalDate: ['']
    });
  }
  ngOnInit() {
    this.ports = [{ "Master_PortID": 1, "Source": "Kwinana", "Name": "Jebel Ali", "LP_Loading_Rate": "14", "Voyage_Time": "12", "Latitude": -32.20601, "Longitude": 115.72645, "Area": "WA", "Type": "Source", "AvgDelta": 0 },
    { "Master_PortID": 2,  "Source": "Bunbury", "Name": "Port Klang", "LP_Loading_Rate": "18", "Voyage_Time": "12", "Latitude": -33.30988, "Longitude": 115.65855, "Area": "WA", "Type": "Source", "AvgDelta": 0 },
    { "Master_PortID": 3,"Source": "Worsley", "Name": "Los Angeles", "LP_Loading_Rate": "20", "Voyage_Time": "12", "Latitude": -33.308, "Longitude": 116.006, "Area": "WA", "Type": "Source", "AvgDelta": 0 },
    { "Master_PortID": 4,"Source": "Gladstone", "Name": "Laem Chabang", "LP_Loading_Rate": "18", "Voyage_Time": "18", "Latitude": -23.84314, "Longitude": 151.26836, "Area": "EA", "Type": "Source", "AvgDelta": 0 },
    { "Master_PortID": 5, "Source": "Go Dau", "Name": "Algeciras", "LP_Loading_Rate": "4", "Voyage_Time": "8", "Latitude": 10.64939, "Longitude": 107.0136, "Area": "VIETNAM", "Type": "Source", "AvgDelta": 0 },
    { "Master_PortID": 6, "Source": "Kendawangan", "Name": "Jeddah", "LP_Loading_Rate": "6", "Voyage_Time": "9", "Latitude": -2.36902, "Longitude": 110.14405, "Area": "INDONESIA", "Type": "Source", "AvgDelta": 0 }]

    this.plants = [{ "Master_PlantID": 1, "Name": "Plant1" },
    { "Master_PlantID": 2, "Name": "Plant2" },
    { "Master_PlantID": 3, "Name": "Plant3" }]

    const d = new Date();
    this.currentMonth = d.getMonth() + 1;
    this.startMonthYear = {
      year: this.vedentaService.currentYear,
      month: Number(parseInt(this.vedentaService.currentMonth))
    };
    this.arrivalMonthVal = this.currentMonth;
    this.authForm.patchValue({ arrivalMonthVal: this.arrivalMonthVal });
    this.isMonthSelected = false;
  }
  ngOnChanges() { }

  onDateSelection(date: NgbDate) {
    //console.log(date);
  }

  toggleSidenav() {
    this.open = !this.open;
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }
  isAvailable(date: NgbDate) {
    const newd =
      date.year +
      '-' +
      (date.month <= 9 ? '0' + date.month : date.month) +
      '-' +
      (date.day <= 9 ? '0' + date.day : date.day);
    const startdate =
      this.fromDate.year +
      '-' +
      (this.fromDate.month <= 9
        ? '0' + this.fromDate.month
        : this.fromDate.month) +
      '-' +
      (this.fromDate.day <= 9 ? '0' + this.fromDate.day : this.fromDate.day);
    let enddate = '';
    if (this.toDate != undefined) {
      enddate =
        this.toDate.year +
        '-' +
        (this.toDate.month <= 9 ? '0' + this.toDate.month : this.toDate.month) +
        '-' +
        (this.toDate.day <= 9 ? '0' + this.toDate.day : this.toDate.day);
    }
    const dateforcompare = date.year + "" + (date.month <= 9 ? '0' + date.month : date.month) + "" + (date.day <= 9 ? '0' + date.day : date.day);
    if (this.calendarData.length > 0) {
      let matchdate;
      let matchClassDate;

      this.calendarData.forEach(element => {
        if (element.Date === newd) {
          matchdate = element.Status;
          matchClassDate = element.Date;
        }
      });
      let cm: any = this.today.getMonth() + 1;
      if (cm <= 9) {
        cm = "0" + cm;
      }
      let cd: any = this.today.getDate();
      if (cd <= 9) {
        cd = "0" + cd;
      }
      let cdate = this.today.getFullYear() + "" + cm + "" + cd;
      if (dateforcompare < cdate) {
        return 'custom-day  disabled faded';
      }
      if (matchdate == 'Suggested') {
        if (startdate == matchClassDate) {
          return 'custom-day Suggested faded';
        }
        if (enddate == matchClassDate) {
          return 'custom-day Suggested faded';
        }
        return 'custom-day Suggested';
      } else if (matchdate == 'Available') {
        if (startdate == matchClassDate) {
          return 'custom-day Available faded';
        }
        if (enddate == matchClassDate) {
          return 'custom-day Available faded';
        }
        return 'custom-day Available';
      } else if (matchdate == 'Not Suggested') {
        if (startdate == matchClassDate) {
          return 'custom-day notsuggested faded';
        }
        if (enddate == matchClassDate) {
          return 'custom-day notsuggested faded';
        }
        return 'custom-day notsuggested';
      } else {
        if (startdate == matchClassDate) {
          return 'custom-day  disabled faded';
        }
        if (enddate == matchClassDate) {
          return 'custom-day  disabled faded';
        }
        //   let m:any= this.modelDate.month;
        // if(m<9){
        //   m = "0"+ m;
        // }
        // let d:any= this.modelDate.day;
        // if(d<9){
        //   d= "0"+ d;
        // }


        return 'custom-day';
      }
    } else {
      return 'custom-day  disabled faded';
    }
  }
  isRange(date: NgbDate) { }

  disableDate = (date: NgbDateStruct) => {
    const newd =
      date.year +
      '-' +
      (date.month <= 9 ? '0' + date.month : date.month) +
      '-' +
      (date.day <= 9 ? '0' + date.day : date.day);
    const dateforcompare =
      date.year + "" + (date.month <= 9 ? '0' + date.month : date.month) + "" + (date.day <= 9 ? '0' + date.day : date.day);
    // let m:any= this.modelDate.month;
    // if(m<9){
    //   m = "0"+ m;
    // }
    // let d:any= this.modelDate.day;
    // if(d<9){
    //   d= "0"+ d;
    // }

    let cm: any = this.today.getMonth() + 1;
    if (cm <= 9) {
      cm = "0" + cm;
    }
    let cd: any = this.today.getDate();
    if (cd <= 9) {
      cd = "0" + cd;
    }
    let cdate = this.today.getFullYear() + "" + cm + "" + cd;
    // //console.log('date',dateforcompare);
    // //console.log('cdate',cdate);
    if (dateforcompare < cdate) {
      return true;
    }
    if (this.calendarData.length > 0) {
      let matchdate = 0;
      this.calendarData.forEach(element => {
        if (element.Date === newd && element.Status !== 'Locked') {
          matchdate = 1;
        }
      });
      if (matchdate === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  callMonth(e) {
    this.vedentaService.currentMonth = Number(parseInt(e));
    this.startMonthYear = {
      year: this.vedentaService.currentYear,
      month: Number(parseInt(e))
    };

    if (this.loadPortSelectedValue && this.quantityVal != '') {
      $('#loader').css('display', 'block');
      this.getProcurementData().then((s: any) => {
        this.calendarData = s.success;
        this.isMonthSelected = true;
        $('#loader').css('display', 'none');
        setTimeout(() => {
          this.dp.navigateTo(this.startMonthYear);
        }, 1000);
      });
    } else {
      setTimeout(() => {
        this.dp.navigateTo(this.startMonthYear);
      }, 1000);
    }
  }
  selectYear(e) {
    console.log(e.target.value);
    this.vedentaService.currentYear = Number(parseInt(e.target.value))
    this.startMonthYear = {
      year: this.vedentaService.currentYear,
      month: Number(parseInt(this.vedentaService.currentMonth))
    };
  }
  changePort(e) {
    this.loadPortSelectedValue = e;

    if (
      !Number.isNaN(this.startMonthYear.month) &&
      this.authForm.value.quantityVal != '' &&
      this.authForm.value.quantityVal != undefined
    ) {
      $('#loader').css('display', 'block');
      this.getProcurementData().then((s: any) => {
        this.calendarData = s.success;
        this.isMonthSelected = true;
        if (this.isonLoad == 0) {
          const a = { year: 2019, month: 1 };

          this.dp.navigateTo(a);
          this.isonLoad = 1;
        }
        setTimeout(() => {
          this.dp.navigateTo(this.startMonthYear);
          $('#loader').css('display', 'none');
        }, 500);
      });
    }
  }

  getsuggestion() {
    if (
      !Number.isNaN(this.startMonthYear.month) &&
      this.authForm.value.quantityVal != '' &&
      this.authForm.value.quantityVal != undefined
    ) {
      $('#loader').css('display', 'block');
      // this.getProcurementData().then((s: any) => {
        this.calendarData = [{"Date":"2020-05-19","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":40000},{"Date":"2020-05-20","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":30000},{"Date":"2020-05-21","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":50000},{"Date":"2020-05-22","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":40000},{"Date":"2020-05-23","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":30000},{"Date":"2020-05-24","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":50000},{"Date":"2020-05-25","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":90000},{"Date":"2020-05-26","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":120000},{"Date":"2020-05-27","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":110000},{"Date":"2020-05-28","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":100000},{"Date":"2020-05-29","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":90000},{"Date":"2020-05-30","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":80000},{"Date":"2020-05-31","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":70000},{"Date":"2020-06-01","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":60000},{"Date":"2020-06-02","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":50000},{"Date":"2020-06-03","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":40000},{"Date":"2020-06-04","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":30000},{"Date":"2020-06-05","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":20000},{"Date":"2020-06-06","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":10000},{"Date":"2020-06-07","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-08","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-09","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-10","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-11","Status":"Not Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-12","Status":"Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-13","Status":"Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-14","Status":"Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-15","Status":"Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-16","Status":"Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0},{"Date":"2020-06-17","Status":"Suggested","ArrivalMonth":"6","LoadPort":"Kwinana","Demurrage":0}]
        this.isMonthSelected = true;
        if (this.isonLoad == 0) {
          const a = { year: 2019, month: 1 };

          this.dp.navigateTo(a);
          this.isonLoad = 1;
        }
        setTimeout(() => {
          this.dp.navigateTo(this.startMonthYear);
          $('#loader').css('display', 'none');
        }, 500);
      // });
    }
  }
  changeQuantity(e) {
    this.quantityVal = e.target.value;
    if (
      !Number.isNaN(this.startMonthYear.month) &&
      this.loadPortVal != undefined &&
      this.loadPortVal != '' &&
      this.quantityVal != '' &&
      this.quantityVal != undefined
    ) {
      $('#loader').css('display', 'block');
      this.getProcurementData().then((s: any) => {
        this.calendarData = s.success;
        this.isMonthSelected = true;
        if (this.isonLoad == 0) {
          const a = { year: 2019, month: 1 };
          this.dp.navigateTo(a);
          this.isonLoad = 1;
        }
        setTimeout(() => {
          this.dp.navigateTo(this.startMonthYear);
          $('#loader').css('display', 'none');
        }, 500);
      });
    }
  }

  getProcurementData() {
    return new Promise((resolve, reject) => {
      const payload = {
        loadPort: this.authForm.value.loadPortVal,
        month: this.startMonthYear.month,
        year: this.startMonthYear.year,
        quantity: this.authForm.value.quantityVal
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

  submitmodal(content) {
    //console.log(this.authForm);
    if (this.authForm.valid) {
      this.modalService.open(content, {
        size: 'lg',
        windowClass: 'customsubmit_modal',
        centered: true
      });
    }
  }
  closeModal() {
    this.modalService.dismissAll();
    window.location.reload();
  }

  submitConfirm() {
    if (this.authForm.valid) {
      // $('#loader').css('display', 'block');
      return new Promise((resolve, reject) => {
        const payload = {
          vessel_nameVal: this.authForm.value.vessel_nameVal,
          quantityVal: this.authForm.value.quantityVal,
          ownerVal: this.authForm.value.ownerVal,
          plantVal: this.authForm.value.plantVal,
          loadPortVal: this.authForm.value.loadPortVal,
          arrivalMonthVal: parseInt(this.authForm.value.arrivalMonthVal),
          layanSelected: this.authForm.value.laycanSelected,
          VesselPlacementSuggestion: this.authForm.value
            .VesselPlacementSuggestion,
          dischargePortSuggested: this.authForm.value.dischargePortSuggested,
          potentialDemurrage: this.authForm.value.potentialDemurrage,
          tradeOffReason: this.authForm.value.tradeOffReason,
          userComment: this.authForm.value.userComment,
          selectedDate: this.modelDate,
          arrivalDate: this.arrivalDate
        };
        //console.log(payload);
        this.vedentaService.submitData(payload).then((s: any) => {
          $('#loader').css('display', 'none');
          if (s.success) {
            this.modalService.dismissAll();
            this.authForm.reset();
            this.vedentaService.apiCall();
            this.modalService.open(this.content1, {
              windowClass: 'customsubmit_modal',
              centered: true
            });
          }
        });
      });
    } else {
    }
  }
  updateVal(name, value) {

    this.authForm.patchValue({ [name]: value });
    switch (name) {
      case 'arrivalMonthVal':
        this.callMonth(value);
        break;
      case 'loadPortVal':
        this.changePort(value);
        break;
      default:
        break;
    }
  }
  checkSubmit() {
    if (this.modelDate) {


      const payload = {
        loadPort: this.authForm.value.loadPortVal,
        month: this.startMonthYear.month,
        selectedDate: this.modelDate
      };

      let m: any = this.modelDate.month;
      if (m <= 9) {
        m = "0" + m;
      }
      let d: any = this.modelDate.day;
      if (d <= 9) {
        d = "0" + d;
      }

      let cm: any = this.today.getMonth() + 1;
      if (cm <= 9) {
        cm = "0" + cm;
      }
      let cd: any = this.today.getDate();
      if (cd <= 9) {
        cd = "0" + cd;
      }

      let selDate = this.modelDate.year + "" + m + "" + d;
      let cdate = this.today.getFullYear() + "" + cm + "" + cd;
      //console.log(selDate, cdate)
      if (selDate < cdate) {
        alert("please select later date");
        return false;
      }
      $('#loader').css('display', 'block');
      this.vedentaService.getCheckData(payload).then((s: any) => {
        this.checkData = [{"VesselPlacementSuggestion":"Second Half 2020-04-17 to 2020-04-19","LaycanSelected":"13 April - 19 April","Status":"Not Suggested","ArrivalMonth":"4","LoadPort":"Bunbury","Demurrage":20000,"TradeOff_comments":"Demurrage at Second Half is 20000.0 with arrival date 2020-04-29 and ships unloading time may clash!.\nTradeoff for this vessel:\nJNPT ---- 20000.0 USD ---- Demurrage\nVIZAG ---- 6075.0 USD ---- Delta\nLONI ---- 8100.0 USD ---- Delta","Dispatch_Port_Suggested":"VIZAG","Suggested_Laycan":"Second Half 2020-04-17 to 2020-04-19","Date":"2020-04-13","ArrivalDate":"2020-04-29"}];
        this.laycanSelected = this.checkData[0].LaycanSelected;
        this.suggestedLaycan = this.checkData[0].Suggested_Laycan;
        this.VesselPlacementSuggestion =
        this.checkData[0].VesselPlacementSuggestion;
        const aa = this.checkData[0].suggestedPort;
        // this.suggestedDropValue = aa;
        //console.log(this.suggestedDropValue);
        this.arrivalDate = this.checkData[0].ArrivalDate;
        this.authForm.patchValue({
          arrivalDate: this.checkData[0].ArrivalDate,
          dischargePortSuggested: this.checkData[0].Dispatch_Port_Suggested,
          potentialDemurrage: this.checkData[0].Demurrage,
          tradeOffReason: this.checkData[0].TradeOff_comments,
          laycanSelected: this.checkData[0].LaycanSelected,
          VesselPlacementSuggestion: this.checkData[0].VesselPlacementSuggestion
        });
        $('#loader').css('display', 'none');
      });
    }
  }
}
