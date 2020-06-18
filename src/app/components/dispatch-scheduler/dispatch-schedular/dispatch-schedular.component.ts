import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VedantaService } from 'src/app/services/vedanta.service';
import { Dispatchschedular } from 'src/app/models/dispatchschedular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  NgbDateAdapter,
  NgbTimeAdapter,
  NgbDateNativeAdapter
} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-dispatch-schedular',
  templateUrl: './dispatch-schedular.component.html',
  styleUrls: ['./dispatch-schedular.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class DispatchSchedularComponent implements OnInit {
  constructor(
    public router: Router,
    public nlgnlqService: VedantaService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  get today() {
    return new Date();
  }

  get twelveam() {
    const today = new Date();
    return {
      hour: 0,
      minute: 0,
      second: 0
    };
  }

  get now() {
    const today = new Date();
    return {
      hour: today.getHours(),
      minute: today.getMinutes(),
      second: today.getSeconds()
    };
  }
  @ViewChild('preDispatchFirstTimeDataEntryWarning')
  preDispatchFirstTimeDataEntryWarning: ElementRef;
  @ViewChild('manualDelayPopup') manualDelayPopup: ElementRef;
  @ViewChild('preDispatchFirstTimeDataEntry')
  preDispatchFirstTimeDataEntry: ElementRef;
  @ViewChild('changeDelayInput') changeDelayInput: ElementRef;
  @ViewChild('successfulSubmit') successfulSubmit: ElementRef;
  @ViewChild('customSuccessfulModal') customSuccessfulModal: ElementRef;
  @ViewChild('ErrorModal') ErrorModal: ElementRef;
  @ViewChild('detailsModal') detailsModal: ElementRef;
  public loading: false;
  delayLoad: any = [
    { name: 'Early', value: 'E' },
    { name: 'Late', value: 'L' }
  ];
  delayLoaded: any = [
    { name: 'Empty', value: 'E' },
    { name: 'Loaded', value: 'L' }
  ];

  delayChoice: any = [
    { name: 'Yes', value: 'y' },
    { name: 'Break', value: 'b' }
  ];
  runDelayChoice: any = [
    { name: 'Yes', value: 'y' },
    { name: 'No', value: 'n' }
  ];
  plantNames: any = [
    {
      name: 'Jharsuguda',
      code: 'JSG'
    },
    {
      name: 'Bharat Aluminium Company',
      code: 'BALCO'
    }
  ];
  public popupValue = [];
  public holdStatus: any = [];
  public holdObject: any = {};
  destinationArray: any = [
    { name: 'KANDLA', code: 'KSLK' },
    {
      name: 'KANDLA for Maintenance',
      code: 'KSLK-TXR'
    },
    {
      name: 'JNPT',
      code: 'JNPT'
    },
    {
      name: 'Lanjigarh',
      code: 'LNJ'
    },
    {
      name: 'Bharat Aluminium Company',
      code: 'BALCO'
    },
    {
      name: 'Maintance',
      code: 'TXR'
    },
    {
      name: 'ROH/POH',
      code: 'ROH/POH'
    },
    {
      name: 'Out of Circuit',
      code: 'Out of Circuit'
    }
  ];
  delayReasons: any[];
  delayArray: any = [];
  public viewShown: any = 'JSG';
  public model: any = {
    username: '',
    password: ''
  };
  public dbfinaldata = [];
  public Month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private JSObject: Object = Object;
  public cDate: any = new Date();
  public cMonth = this.cDate.getMonth();
  public currentquarter = Math.floor((this.cMonth + 3) / 3);
  public dbdata: any;
  public firstTimeInMonth: any;
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
  public cKey = [];
  public btap_sup = [];
  public cKey_balko = [];
  public cYear: any;
  public nYear: any;
  public planningResults: any = [];
  public balkoResult: any = [];
  public open = false;
  public now_time: any;
  public now_today: any;
  public btapNames: any = [];
  public includeRunDelayJSON = false;
  public includedelayUIJSON = false;
  public presubmitdata: any = [];
  public errorForModal: any = '';
  public dispatchIndividualData: any = [];
  public currentDateOnManualSubmission: any;
  public currentDateOnManualSubmission1: any;
  public landingPlanningResults: any = [];
  public landing_cKey: any = [];
  public landing_btap_sup: any = [];
  public plantStatusData: any = [];
  public plantSupplyData: any = [];
  public btapSupplyData: any = [];
  public bulkerData: any = [
    {
      plantsupply: 0,
      supply: 0
    }
  ];
  public originBtap: any;
  public addDelayShown: Boolean = false;
  public chartsData: any = {
    avgpreberthing: {},
    plantbtapsupply: {}
  };
  public loadingData: any = {
    startLoadingData: false,
    startLoadingPlantStatus: false,
    startLoadingPlantSupply: false,
    startLoadingBTAPSupply: false,
    holdStatus: false
  };
  public delayForm: any = {
    s_date: {
      date: null,
      time: '00:00:00'
    },
    lnj_jsg: null,
    kslk_jsg: null,
    lnj_balco: null,
    kslk_balco: null,
    delay_choice: null,
    run_delay_choice: null,
    delay_ui_json: {
      plant_name: null,
      c_date: {
        date: this.today,
        time: this.now
      },
      u_btap_name: null,
      u_load_s: null,
      u_dealy_hour: null
    },
    run_delay_json: {
      btap_to_correct: null,
      btap_info: []
    }
  };
  public firstPreFilledData: any = [];
  public currenMonthName: any = '';

  ngOnInit() {
    this.currenMonthName = 'MAY';
    this.getDispatcherFirstEdit(this.viewShown);
    this.getCurrentFiscalYear();
  }

  reloadPage() {
    window.location.reload();
  }

  toggleSidenav() {
    this.open = !this.open;
  }

  formatDate(dat) {
    const date = dat;
    let mon, da;
    if (date.month <= 9) {
      mon = '0' + date.month;
    } else {
      mon = date.month;
    }
    if (date.day <= 9) {
      da = '0' + date.day;
    } else {
      da = date.day;
    }
    const new_date = da + '-' + mon + '-' + date.year;
    return new_date;
  }

  getCurrentMonth() {
    const date = new Date(),
      month = ('0' + (date.getMonth() + 1)).slice(-2);
    return month;
  }

  getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  converRawDate(raw_date) {
    const date = new Date(raw_date),
      month = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, month, date.getFullYear()].join('-');
  }

  converRawDateReverse(raw_date) {
    const date = new Date(raw_date),
      month = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join('-');
  }

  converRawTime(raw_time) {
    const time = new Date(raw_time),
      hour = ('0' + time.getHours()).slice(-2),
      min = ('0' + time.getMinutes()).slice(-2),
      sec = ('0' + time.getSeconds()).slice(-2);
    return [hour, min, sec].join(':');
  }

  formatTime(tim) {
    const time = tim;
    let hrs, min, sec;
    if (time.hour <= 9) {
      hrs = '0' + time.hour;
    } else {
      hrs = time.hour;
    }
    if (time.minute <= 9) {
      min = '0' + time.minute;
    } else {
      min = time.minute;
    }
    if (time.second <= 9) {
      sec = '0' + time.second;
    } else {
      sec = time.second;
    }
    const new_time = hrs + ':' + min + ':' + sec;
    return new_time;
  }

  convertToDatePickerFormat(timestmp) {
    return new Date(timestmp);
  }

  generateDoughnutChartData(chartname, data) {
    let value_count = 0;
    const value = [];
    const lab = [];
    data.forEach(element => {
      value_count = 1;
      value.push(element.btap_supply);
      lab.push(element.btap_name);
    });
    this.chartsData[chartname] = {
      data: [{ data: value, label: 'Series A' }],
      labels: lab,
      chartType: 'bar',
      chartLegend: true
    };
  }

  generateLineChartData(chartname, data) {
    const dummyArray: any = [];
    const dummyArray1: any = [];
    const lab: any = [];
    const map = new Map();
    for (const item of data) {
      if (!map.has(item.btap_name)) {
        map.set(item.btap_name, true);
        dummyArray.push(item.btap_name);
      }
    }
    for (const item of data) {
      if (!map.has(item.plant_entry_date)) {
        map.set(item.plant_entry_date, true);
        dummyArray1.push(this.converRawDate(item.plant_entry_date));
      }
    }
    for (const item of dummyArray1) {
      if (!map.has(item)) {
        map.set(item, true);
        lab.push(item);
      }
    }
    const value = [];
    const context = [];
    dummyArray.forEach(btap => {
      const aa = [];
      data.forEach(element => {
        if (element.btap_name === btap) {
          aa.push({
            entry: element.plant_entry_date,
            exit: element.plant_exit_date,
            entry_date: this.converRawDate(element.plant_entry_date),
            entry_time: this.converRawTime(element.plant_entry_date),
            exit_date: this.converRawDate(element.plant_exit_date),
            exit_time: this.converRawTime(element.plant_exit_date),
            plant: element.plant_name
          });
        }
      });
      context.push({ btap: btap, points: aa });
    });
    // //console.log(context);
    context.forEach(el => {
      const d = [];
      lab.forEach((elp, index) => {
        let match = false;
        let ds: any = 0;
        for (let index: any = 0; index < el.points.length; index++) {
          if (el.points[index].entry_date === elp) {
            match = true;
            ds = el.points[index].entry;
            break;
          }
        }
        if (match) {
          d.push(new Date(ds).getDate());
        } else {
          d.push(0);
        }
      });
      value.push({
        data: d,
        label: el.btap
      });
    });
    this.chartsData[chartname] = {
      data: value,
      labels: lab,
      chartType: 'line',
      chartLegend: true
    };
    // //console.log(this.chartsData);
  }

  getDispatcherFirstEdit(plant_name) {
    this.nlgnlqService.showLoader();
    this.loadingData.startLoadingData = true;
    this.loadingData.startLoadingPlantStatus = true;
    this.loadingData.startLoadingPlantSupply = true;
    this.loadingData.startLoadingBTAPSupply = true;
    this.nlgnlqService.getDispatcherFirstEdit({ plant_name: plant_name }).then(
      response => {
        response = response['Output'];
        this.firstTimeInMonth = response['status'];
        if (this.firstTimeInMonth === 'yes') {
          this.modalService.open(this.preDispatchFirstTimeDataEntryWarning, {
            centered: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-basic-title',
            size: 'sm'
          });
          this.nlgnlqService.hideLoader();
        } else {
          this.getData(plant_name);
          // this.getPlanningResult();
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  openPreDispatchFirstTimeData() {
    this.nlgnlqService.showLoader();
    const formdata = {
      plant_name: this.viewShown
    };
    this.nlgnlqService.getLastMonthLastDay(formdata).then(d => {
      this.firstPreFilledData = d['success'];
      this.originBtap = this.firstPreFilledData.length;
      console.log(this.originBtap);
      this.delayForm.lnj_jsg =
        parseInt(this.firstPreFilledData[0].lnj_quant, 10) * 1000;
      this.delayForm.kslk_jsg =
        parseInt(this.firstPreFilledData[0].kslk_quant, 10) * 1000;
      this.delayForm.lnj_balco =
        parseInt(this.firstPreFilledData[0].balco_quant, 10) * 1000;
      this.delayForm.kslk_balco =
        parseInt(this.firstPreFilledData[0].kslkbalco_quant, 10) * 1000;
      this.delayForm.run_delay_json.no_of_btap = this.firstPreFilledData.length;
      this.delayForm.run_delay_json.btap_info = [];
      for (let index = 0; index < this.firstPreFilledData.length; index++) {
        // console.log(this.convertToDatePickerFormat(this.firstPreFilledData[index].txr));
        this.delayForm.run_delay_json.btap_info.push({
          btap_name: this.firstPreFilledData[index].btap_name,
          destination: this.firstPreFilledData[index].destination,
          load_status: this.firstPreFilledData[index].load_status,
          tat: this.firstPreFilledData[index].tat,
          btap_category: this.firstPreFilledData[index].btap_category,
          txr: this.convertToDatePickerFormat(
            this.firstPreFilledData[index].txr
          )
        });
      }
      // console.log(d);
      this.modalService.open(this.preDispatchFirstTimeDataEntry, {
        centered: true,
        backdrop: 'static',
        windowClass: 'xl-modal',
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl' as 'lg'
      });
      this.nlgnlqService.hideLoader();
    });
  }

  openPreDispatchFirstTimeDataWarning() {
    this.modalService.open(this.preDispatchFirstTimeDataEntryWarning, {
      centered: true,
      backdrop: 'static',
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm'
    });
  }

  submitPreDisplayData() {
    const formdata = {
      // s_date:
      //   this.converRawDate(this.delayForm.s_date.date) +
      //   ' ' +
      //   this.delayForm.s_date.time,
      lnj_jsg: this.delayForm.lnj_jsg,
      kslk_jsg: this.delayForm.kslk_jsg,
      lnj_balco: this.delayForm.lnj_balco,
      kslk_balco: this.delayForm.kslk_balco,
      delay_choice: 'n',
      run_delay_choice: null,
      delay_ui_json: null,
      run_delay_json: null,
      no_of_btap: this.delayForm.run_delay_json.no_of_btap,
      btap_info: this.delayForm.run_delay_json.btap_info,
      btap_category: this.delayForm.run_delay_json.btap_category
    };

    if (!(formdata.no_of_btap === formdata.btap_info.length)) {
      this.errorForModal =
        'Please check the Number of BTAPs and added BTAPs in the list.';
      this.modalService.open(this.ErrorModal, {
        backdrop: 'static',
        size: 'lg',
        centered: true
      });
      return;
    } else {
      this.nlgnlqService.showLoader();
      this.nlgnlqService.submitDispatcher(formdata).then(
        (s: any) => {
          this.modalService.open(this.successfulSubmit, {
            size: 'lg',
            backdrop: 'static',
            centered: true
          });
          this.nlgnlqService.hideLoader();
        },
        error => {
          // this.modalService.open(this.ErrorModal, {
          //   backdrop: 'static',
          //   size: 'lg',
          //   centered: true
          // });
          // console.log('Received some error');
          this.nlgnlqService.hideLoader();
        }
      );
    }
  }

  delayOnChange(event) {
    const formdata = {
      plant_name: this.delayForm.delay_ui_json.plant_name.code,
      btap_name: this.delayForm.delay_ui_json.u_btap_name,
      arrival_type: this.delayForm.delay_ui_json.u_load_s
    };
    this.nlgnlqService.getIndividualDispatchData(formdata).then(
      response => {
        const data: any = response['success'];
        this.dispatchIndividualData = JSON.parse(data);
      },
      error => {
        this.errorForModal = 'Please check your inputs';
        this.modalService.open(this.ErrorModal, {
          backdrop: 'static',
          size: 'lg',
          centered: true
        });
        return;
      }
    );
  }

  emptyDelayForm() {
    this.delayForm = {
      s_date: {
        date: null,
        time: '00:00:00'
      },
      lnj_jsg: null,
      kslk_jsg: null,
      lnj_balco: null,
      kslk_balco: null,
      delay_choice: null,
      run_delay_choice: null,
      delay_ui_json: {
        plant_name: null,
        c_date: {
          date: this.today,
          time: this.now
        },
        u_btap_name: null,
        u_load_s: null,
        u_dealy_hour: null
      },
      run_delay_json: {
        btap_to_correct: null,
        btap_info: []
      }
    };
  }

  submitDelayForm() {
    this.currentDateOnManualSubmission = {
      date: this.delayForm.delay_ui_json.c_date.date,
      time: this.delayForm.delay_ui_json.c_date.time
    };

    const enddate = this.delayForm.delay_ui_json.c_date.date.split(' ');
    const ed = enddate[0].split('-');
    const fed = ed[2] + '-' + ed[1] + '-' + ed[0];
    this.currentDateOnManualSubmission1 =
      fed + ' ' + this.delayForm.delay_ui_json.c_date.time;
    // console.log(fed);
    const formdata = {
      // s_date:
      //   this.converRawDate(this.delayForm.s_date.date) +
      //   ' ' +
      //   this.delayForm.s_date.time,
      delay_choice: 'y',
      run_delay_choice: 'n',
      delay_ui_json: {
        u_date:
          this.converRawDate(
            this.delayForm.delay_ui_json.delay_destination[0]
          ) +
          ' ' +
          this.converRawTime(this.delayForm.delay_ui_json.delay_destination[0]),
        enddate1: fed + ' ' + this.delayForm.delay_ui_json.c_date.time,
        u_btap_name: this.delayForm.delay_ui_json.u_btap_name,
        u_load_s: this.delayForm.delay_ui_json.u_load_s,
        u_dealy_hour: this.delayForm.delay_ui_json.u_dealy_hour
      },
      run_delay_json: null,
      reason_for_delay: this.delayForm.reason_for_delay
    };
    this.nlgnlqService.showLoader();
    this.nlgnlqService.submitDispatcher(formdata).then(
      (s: any) => {
        this.presubmitdata = JSON.parse(s.success);
        if (this.presubmitdata.status === 'OK') {
          this.getLandingData(this.viewShown);
          this.modalService.open(this.customSuccessfulModal, {
            backdrop: 'static',
            size: 'xl' as 'lg',
            centered: true,
            windowClass: 'newheight'
          });
          this.nlgnlqService.hideLoader();
        } else {
          this.emptyDelayForm();
          this.nlgnlqService.hideLoader();
          // console.log('received some error');
        }
      },
      error => {
        // this.modalService.open(this.ErrorModal, {
        //   backdrop: 'static',
        //   size: 'lg',
        //   centered: true
        // });
        this.emptyDelayForm();
        this.nlgnlqService.hideLoader();
        // console.log('received some error');
      }
    );
  }

  submitConfirmDelay(val) {
    if (val === 'yes') {
      const formdata = {
        s_date: this.currentDateOnManualSubmission1,
        delay_choice: 'b',
        run_delay_choice: 'y',
        delay_ui_json: null,
        run_delay_json: null
      };

      this.nlgnlqService.showLoader();
      this.nlgnlqService.submitDispatcher(formdata).then(
        (s: any) => {
          window.location.reload();
          this.nlgnlqService.hideLoader();
        },
        error => {
          // this.modalService.open(this.ErrorModal, {
          //   backdrop: 'static',
          //   size: 'lg',
          //   centered: true
          // });
          // console.log('Received some error');
          this.nlgnlqService.hideLoader();
        }
      );
    } else if (val === 'no') {
      this.delayForm.s_date = this.currentDateOnManualSubmission;
      if(this.popupValue.length > 1)
     this.popupValue =  this.popupValue.splice(0,1);
     console.log( this.popupValue.length)
    //  this.delayForm.run_delay_json.no_of_btap = this.popupValue.length;
      this.delayForm.run_delay_json = {
        btap_to_correct: null,
        btap_info: [],
        no_of_btap: this.popupValue.length
      };
      this.modalService.open(this.changeDelayInput, {
        windowClass: 'xl-modal',
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        size: 'xl' as 'lg',
        centered: true
      });
    } else {
      console.error('Some unknown error occurred.');
    }
  }

  submitChangeDelayForm() {
    const sendData = [];
    this.popupValue.forEach(element => {
      sendData.push({
        btap_name: element.BTAP_Name,
        destination: element.next_destination_fullname,
        load_status: element.status,
        tat: element.remainingTimeofTrip,
        txr: null
      });
    });
    // const formdata = {
    //   s_date: this.currentDateOnManualSubmission1,
    //   delay_choice: 'b',
    //   run_delay_choice: 'n',
    //   delay_ui_json: null,
    //   run_delay_json: {
    //     btap_to_correct: this.delayForm.run_delay_json.no_of_btap,
    //     btap_info: this.delayForm.run_delay_json.btap_info
    //   }
    // };
    const formdata = {
      s_date: this.currentDateOnManualSubmission1,
      delay_choice: 'b',
      run_delay_choice: 'n',
      delay_ui_json: null,
      run_delay_json: {
        btap_to_correct: this.popupValue.length,
        btap_info: sendData
      }
    };

    this.nlgnlqService.showLoader();
    this.nlgnlqService.submitDispatcher(formdata).then(
      (s: any) => {
        this.modalService.open(this.successfulSubmit, {
          backdrop: 'static',
          size: 'lg',
          centered: true
        });
        this.nlgnlqService.hideLoader();
      },
      error => {
        // this.modalService.open(this.ErrorModal, {
        //   backdrop: 'static',
        //   size: 'lg',
        //   centered: true
        // });
        // console.log('Received some error');
        this.nlgnlqService.hideLoader();
      }
    );
  }

  getCurrentFiscalYear() {
    const today = new Date();
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

  getData(plant_name) {
    const formdata = {
      plant_name: plant_name
    };
   let  mainresult =  [
    {
      "datetime": "2019-10-01T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 46.02,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-02T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 22.02,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 1.963333333,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":91.75},\"2\":{\"depot\":\"pre_load\",\"part\":8.180555555555555},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-03T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 64.26,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 10.02,
      "plant_time": 12,
      "post_time": 1.963333333,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":41.75},\"2\":{\"depot\":\"plant_load\",\"part\":50},\"3\":{\"depot\":\"post_load\",\"part\":8.180555555555555},\"4\":{\"depot\":\"tavel\",\"part\":0.0694444444444405},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-04T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 40.26,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 10.02,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":0},\"3\":{\"depot\":\"post_load\",\"part\":41.75},\"4\":{\"depot\":\"tavel\",\"part\":58.25},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-05T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 16.26,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 6,
      "plant_time": 1.723333333,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":67.75000000000001},\"2\":{\"depot\":\"pre_load\",\"part\":25},\"3\":{\"depot\":\"plant_load\",\"part\":7.180555555555555},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-06T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 54.65,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 7.61,
      "post_time": 16.37333333,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":31.708333333333332},\"3\":{\"depot\":\"post_load\",\"part\":68.22222222222223},\"4\":{\"depot\":\"tavel\",\"part\":0.0694444444444405},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-07T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 30.65,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 6.9,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":0},\"3\":{\"depot\":\"post_load\",\"part\":28.750000000000004},\"4\":{\"depot\":\"tavel\",\"part\":71.25},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-08T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 6.65,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 12,
      "plant_time": 5.333333333,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":27.708333333333336},\"2\":{\"depot\":\"pre_load\",\"part\":50},\"3\":{\"depot\":\"plant_load\",\"part\":22.22222222222222},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-09T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 48.89,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 6.65,
      "post_time": 12,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":27.708333333333336},\"3\":{\"depot\":\"post_load\",\"part\":50},\"4\":{\"depot\":\"tavel\",\"part\":22.291666666666675},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-10T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 24.89,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-11T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 0.89,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 4.45,
      "plant_time": 9.35,
      "post_time": 9.293333333,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":3.7083333333333335},\"2\":{\"depot\":\"pre_load\",\"part\":18.541666666666668},\"3\":{\"depot\":\"plant_load\",\"part\":38.958333333333336},\"4\":{\"depot\":\"post_load\",\"part\":38.72222222222222},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-12T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "KSLK-TXR",
      "remainingTimeofTrip": 91.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 13.85,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":0},\"3\":{\"depot\":\"post_load\",\"part\":57.70833333333333},\"4\":{\"depot\":\"tavel\",\"part\":42.291666666666664},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-13T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "KSLK-TXR",
      "remainingTimeofTrip": 67.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-14T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "KSLK-TXR",
      "remainingTimeofTrip": 43.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-15T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "KSLK-TXR",
      "remainingTimeofTrip": 19.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":81.66666666666667},\"2\":{\"depot\":\"txr\",\"part\":18.333333333333325},\"3\":{\"depot\":\"pre_load\",\"part\":0},\"4\":{\"depot\":\"plant_load\",\"part\":0},\"5\":{\"depot\":\"post_load\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-16T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "TXR",
      "remainingTimeofTrip": 43.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"txr\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"travel\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-17T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "TXR",
      "remainingTimeofTrip": 19.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 4.383333333,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"txr\",\"part\":81.66666666666667},\"2\":{\"depot\":\"pre_load\",\"part\":18.26388888888889},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"tavel\",\"part\":0},\"plant_name\":\"KSLK\"}"
    },
    {
      "datetime": "2019-10-18T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 139.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 7.6,
      "plant_time": 12,
      "post_time": 4.383333333,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":31.666666666666664},\"2\":{\"depot\":\"plant_load\",\"part\":50},\"3\":{\"depot\":\"post_load\",\"part\":18.26388888888889},\"4\":{\"depot\":\"tavel\",\"part\":0.0694444444444405},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"KSLK\"}"
    },
    {
      "datetime": "2019-10-19T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 115.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 7.6,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":0},\"3\":{\"depot\":\"post_load\",\"part\":31.666666666666664},\"4\":{\"depot\":\"tavel\",\"part\":68.33333333333333},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"KSLK\"}"
    },
    {
      "datetime": "2019-10-20T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 91.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-21T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 67.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-22T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 43.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    },
    {
      "datetime": "2019-10-23T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 22.6,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 1.383333333,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":94.16666666666667},\"2\":{\"depot\":\"pre_load\",\"part\":5.763888888888888},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-24T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 61,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 4.6,
      "plant_time": 9.35,
      "post_time": 10.03333333,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":19.166666666666664},\"2\":{\"depot\":\"plant_load\",\"part\":38.958333333333336},\"3\":{\"depot\":\"post_load\",\"part\":41.80555555555556},\"4\":{\"depot\":\"tavel\",\"part\":0.0694444444444405},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-25T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 37,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 13.24,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":0},\"3\":{\"depot\":\"post_load\",\"part\":55.166666666666664},\"4\":{\"depot\":\"tavel\",\"part\":44.83333333333333},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-26T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "LNJ",
      "remainingTimeofTrip": 13,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 10.98333333,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":54.166666666666664},\"2\":{\"depot\":\"pre_load\",\"part\":45.763888888888886},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-27T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 55.24,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 1,
      "plant_time": 12,
      "post_time": 10.98333333,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":4.166666666666666},\"2\":{\"depot\":\"plant_load\",\"part\":50},\"3\":{\"depot\":\"post_load\",\"part\":45.763888888888886},\"4\":{\"depot\":\"tavel\",\"part\":0.0694444444444405},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-28T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 31.24,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 1,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":0},\"3\":{\"depot\":\"post_load\",\"part\":4.166666666666666},\"4\":{\"depot\":\"tavel\",\"part\":95.83333333333334},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"LNJ\"}"
    },
    {
      "datetime": "2019-10-29T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "L",
      "next_destination": "JSG",
      "remainingTimeofTrip": 7.24,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 6,
      "plant_time": 9.35,
      "post_time": 1.393333333,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":30.166666666666668},\"2\":{\"depot\":\"pre_load\",\"part\":25},\"3\":{\"depot\":\"plant_load\",\"part\":38.958333333333336},\"4\":{\"depot\":\"post_load\",\"part\":5.805555555555555},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-30T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "KSLK",
      "remainingTimeofTrip": 97.95,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 21.88,
      "summary": "{\"1\":{\"depot\":\"pre_load\",\"part\":0},\"2\":{\"depot\":\"plant_load\",\"part\":0},\"3\":{\"depot\":\"post_load\",\"part\":91.16666666666666},\"4\":{\"depot\":\"tavel\",\"part\":8.833333333333337},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"JSG\"}"
    },
    {
      "datetime": "2019-10-31T00:00:00",
      "BTAP_Name": "VED-1",
      "BTAP_status": "E",
      "next_destination": "KSLK",
      "remainingTimeofTrip": 73.95,
      "Plant_name": "JSG",
      "BTAP_ID": 1,
      "pre_time": 0,
      "plant_time": 0,
      "post_time": 0,
      "summary": "{\"1\":{\"depot\":\"tavel\",\"part\":100},\"2\":{\"depot\":\"pre_load\",\"part\":0},\"3\":{\"depot\":\"plant_load\",\"part\":0},\"4\":{\"depot\":\"post_load\",\"part\":0},\"5\":{\"depot\":\"txr\",\"part\":0},\"plant_name\":\"\"}"
    }
  ]
       
         
     
    // let planningData: any = Dispatchschedular.getDataValues(
    //    mainresult,
    //   this.cMonth,
    //   this.currentquarter,
    //   this.cDate,
    //   plant_name
    // );
    // this.cKey = planningData.keys;
    // this.btap_sup = planningData.supply;
    // this.btapNames = this.cKey;
    // planningData = planningData.data;
    // console.log(planningData)
    // this.planningResults = Object.keys(planningData).map(function (
    //   personNamedIndex
    // ) {
    //   const person = planningData[personNamedIndex];
    //   return person;
    // }); 
    // // this.plantStatusData = response.success.plantsupplystatus;
    // // this.bulkerData = response.success.bulker;
    // // this.btapSupplyData = response.success.btapsupply;
    // // this.plantSupplyData = response.success.plantupdatestatus;
    // // this.generateDoughnutChartData('avgpreberthing', this.plantStatusData);
    // this.loadingData.startLoadingPlantSupply = false;
    // this.loadingData.startLoadingBTAPSupply = false;
    // this.loadingData.startLoadingPlantStatus = false;
    // this.loadingData.startLoadingData = false;
    // this.nlgnlqService.hideLoader();
     
    this.nlgnlqService
      .getDispatchSchedularResults(formdata)
      .then((response: any) => {
        response.success = JSON.parse(JSON.stringify(response.success).replace(/VED/g , 'TRN'))
        response.success = JSON.parse(JSON.stringify(response.success).replace(/KSLK/g , 'KANDLA'))
        response.success = JSON.parse(JSON.stringify(response.success).replace(/KSPL/g , 'KANDLA'))
        response.success = JSON.parse(JSON.stringify(response.success).replace(/GPL/g , 'VIZAG'))
        response.success = JSON.parse(JSON.stringify(response.success).replace(/LNJ/g , 'LONI'))
        response.success = JSON.parse(JSON.stringify(response.success).replace(/JSG/g , 'JNPT'))
        response.success = JSON.parse(JSON.stringify(response.success).replace(/BALCO/g , 'MSPL'))
        // response.success = JSON.parse(JSON.stringify(response.success).replace(/BTAP/g , 'BOBSN'))
        console.log(response.success)
        let planningData: any = Dispatchschedular.getDataValues(
          response.success.mainresult,
          this.cMonth,
          this.currentquarter,
          this.cDate,
          plant_name
        );
        this.cKey = planningData.keys;
        this.btap_sup = planningData.supply;
        this.btapNames = this.cKey;
        planningData = planningData.data;
        console.log(planningData)
        this.planningResults = Object.keys(planningData).map(function (
          personNamedIndex
        ) {
          const person = planningData[personNamedIndex];
          return person;
        });
        this.plantStatusData = response.success.plantsupplystatus;
        this.bulkerData = response.success.bulker;
        this.btapSupplyData = response.success.btapsupply;
        this.plantSupplyData = response.success.plantupdatestatus;
        this.generateDoughnutChartData('avgpreberthing', this.plantStatusData);
        this.loadingData.startLoadingPlantSupply = false;
        this.loadingData.startLoadingBTAPSupply = false;
        this.loadingData.startLoadingPlantStatus = false;
        this.loadingData.startLoadingData = false;
        this.nlgnlqService.hideLoader();
      }); 
  }

  getPlantStatus(plant_name) {
    const formdata = {
      plant_name: plant_name
    };
    this.nlgnlqService
      .getPlantSupplyStatus(formdata)
      .then(response => {
        this.plantStatusData = response['success'];
        this.generateDoughnutChartData('avgpreberthing', this.plantStatusData);
        this.loadingData.startLoadingPlantStatus = false;
      })
      .then(d => {
        this.getBTAPSupply(plant_name);
      });
  }

  getBTAPSupply(plant_name) {
    const formdata = {
      plant_name: plant_name
    };
    this.nlgnlqService
      .getBtapSupply()
      .then(response => {
        this.btapSupplyData = response['success'];
        this.generateDoughnutChartData('btapsupply', this.btapSupplyData);
        this.loadingData.startLoadingBTAPSupply = false;
      })
      .then(d => {
        this.getPlantBTAPSupply(plant_name);
      });
  }

  getPlantBTAPSupply(plant_name) {
    const formdata = {
      plant_name: plant_name
    };
    this.nlgnlqService.getPlantUpdateStatus(formdata).then(response => {
      this.plantSupplyData = response['success'];
      this.generateLineChartData('plantbtapsupply', this.plantSupplyData);
      this.loadingData.startLoadingPlantSupply = false;
      this.nlgnlqService.hideLoader();
    });
  }

  getLandingData(plant_name) {
    const formdata = {
      plant_name: plant_name
    };
    // this.nlgnlqService.showLoader();
    this.nlgnlqService
      .getDispatchSchedularResultsLanding(formdata)
      .then((response: any) => {
        const arr = [];
        console.log(this.currentDateOnManualSubmission1);
        response.success.forEach(element => {
          console.log(this.converRawDate(element.datetime));
          if (
            this.converRawDate(element.datetime) ===
            this.currentDateOnManualSubmission1.split(' ')[0]
          ) {
            arr.push(element);
          }
        });
        console.log(arr);
        arr.sort(function(a, b) {
          console.log(a.BTAP_Name, b.BTAP_Name);
          return a.BTAP_ID - b.BTAP_ID;
        });
        console.log(arr);
        this.landingPlanningResults = arr;

        // let landingPlanningData: any = Dispatchschedular.getDataValues(
        //   response.success,
        //   this.cMonth,
        //   this.currentquarter,
        //   this.cDate,
        //   plant_name
        // );
        // this.landing_cKey = landingPlanningData.keys;
        // this.landing_btap_sup = landingPlanningData.supply;
        // // this.btapNames = this.cKey;
        // landingPlanningData = landingPlanningData.data;
        // this.landingPlanningResults = Object.keys(landingPlanningData).map(
        //   function(personNamedIndex) {
        //     const person = landingPlanningData[personNamedIndex];
        //     return person;
        //   }
        // );
        this.nlgnlqService.hideLoader();
      });
  }

  changeView(newview) {
    this.viewShown = newview;
    if (newview === 'JSG') {
      this.btapNames = this.cKey;
    } else {
      this.btapNames = this.cKey_balko;
    }
    this.getDispatcherFirstEdit(newview);
  }

  openPopup(index, btap, item, dayIndex, it, next, previous) {
    if (dayIndex === 0) {
      return;
    }
    this.nlgnlqService.showLoader();
    this.loadingData.holdStatus = true;
    this.holdObject['title'] = it;
    this.holdObject['next'] = next;
    this.holdObject['current'] = it;
    this.holdObject['previous'] = previous;

    console.log(it, next);
    const title = it.destination + '-' + it.next_destination;
    const i = 0;
    this.popupValue.push(it);
    if (next != undefined && it.destination != undefined) {
      if (next.destination !== it.destination) {
        this.popupValue.push(next);
      }
    }
      console.log(this.popupValue);
    // this.getHoldStatus(it);
    const payload = {
      btapname: it.BTAP_Name,
      startdate: it.Datetime
    };
    this.nlgnlqService
      .getHoldStatus(payload)
      .then((s: any) => {
        this.holdStatus = s.success;
        this.loadingData.holdStatus = false;
      })
      .then(d => {
        this.manualDelay(btap);
      });
  }

  toggleAddDelay() {
    if (this.addDelayShown) {
      this.addDelayShown = false;
    } else {
      this.addDelayShown = true;
    }
  }

  updateModelData() {
    this.popupValue = [];
  }

  manualDelay(btap) {
    this.delayForm.delay_ui_json.plant_name = this.plantNames[
      this.plantNames.findIndex(x => x.code === this.viewShown)
    ];
    this.delayForm.delay_ui_json.c_date.time = this.converRawTime(
      new Date().getTime()
    );

    this.delayForm.delay_ui_json.c_date.date = this.converRawDateReverse(
      new Date().getTime()
    );

    this.delayForm.delay_ui_json.u_btap_name = btap[0];

    this.nlgnlqService.getDelayReasons().then(
      response => {
        this.delayReasons = response['success'];
        this.modalService.open(this.detailsModal, {
          backdrop: 'static',
          centered: true,
          size: 'xl' as 'lg'
        });
        this.nlgnlqService.hideLoader();
      },
      error => {
        // console.log('Received some error');
        this.nlgnlqService.hideLoader();
      }
    );
  }

  addBtap() {
    const form = {
      btap_name: null,
      destination: null,
      load_status: null,
      tat: null,
      txr: null,
      btap_category: this.viewShown
    };

    this.delayForm.run_delay_json.no_of_btap += 1;
    this.delayForm.run_delay_json.btap_info.push(form);
    this.popupValue.push()
    // if (
    //   this.delayForm.run_delay_json.btap_info.length <
    //   this.delayForm.run_delay_json.no_of_btap
    // ) {
    //   this.delayForm.run_delay_json.btap_info.push(form);
    // } else {
    //   alert(
    //     'Cannot add extra BTAPS than ' +
    //     this.delayForm.run_delay_json.no_of_btap
    //   );
    // }
  }

  removeBtap(index) {
    this.delayForm.run_delay_json.no_of_btap -= 1;
    this.delayForm.run_delay_json.btap_info.splice(index, 1);
  }

  getMonthName(name) {
    if (name === 1) {
      return 'Jan';
    }
    if (name === 2) {
      return 'Feb';
    }
    if (name === 3) {
      return 'Mar';
    }
    if (name === 4) {
      return 'Apr';
    }
    if (name === 5) {
      return 'May';
    }
    if (name === 6) {
      return 'Jun';
    }
    if (name === 7) {
      return 'Jul';
    }
    if (name === 8) {
      return 'Aug';
    }
    if (name === 9) {
      return 'Sep';
    }
    if (name === 10) {
      return 'Oct';
    }
    if (name === 11) {
      return 'Nov';
    }
    if (name === 12) {
      return 'Dec';
    }
  }

  getFullMonthName(n: any) {
    const name = parseInt(n, 10);
    console.log(name);
    if (name === 1) {
      return 'January';
    }
    if (name === 2) {
      return 'February';
    }
    if (name === 3) {
      return 'March';
    }
    if (name === 4) {
      return 'April';
    }
    if (name === 5) {
      return 'May';
    }
    if (name === 6) {
      return 'June';
    }
    if (name === 7) {
      return 'July';
    }
    if (name === 8) {
      return 'August';
    }
    if (name === 9) {
      return 'September';
    }
    if (name === 10) {
      return 'October';
    }
    if (name === 11) {
      return 'November';
    }
    if (name === 12) {
      return 'December';
    }
  }

  getMonthIndex(key: any) {
    if (key === 'Jan') {
      return 0;
    }
    if (key === 'Feb') {
      return 1;
    }
    if (key === 'Mar') {
      return 2;
    }
    if (key === 'Apr') {
      return 3;
    }
    if (key === 'May') {
      return 4;
    }
    if (key === 'Jun') {
      return 5;
    }
    if (key === 'Jul') {
      return 6;
    }
    if (key === 'Aug') {
      return 7;
    }
    if (key === 'Sep') {
      return 8;
    }
    if (key === 'Oct') {
      return 9;
    }
    if (key === 'Nov') {
      return 10;
    }
    if (key === 'Dec') {
      return 11;
    }
  }
}
