import {
  Component, OnInit, ChangeDetectionStrategy,
  ViewChild,
  Input,
  TemplateRef,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, RoutesRecognized } from '@angular/router';
import * as $ from 'jquery';
import { VedantaService } from 'src/app/services/vedanta.service';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { filter, pairwise } from 'rxjs/operators';
import { Location } from '@angular/common';
import { RouterExtService } from 'src/app/services/routerext.service';

@Component({
  selector: 'app-chartering',
  templateUrl: './chartering.component.html',
  styleUrls: ['./chartering.component.css'],
  providers: [DatePipe]
})
export class CharteringComponent implements OnInit {
  authForm: FormGroup;
  authFormStep2: FormGroup;
  DelayDataForm: FormGroup;
  paymentCompletionDate: NgbDateStruct;
  paymentComplete: NgbDateStruct;
  documentToTreasury: NgbDateStruct;
  paymentProcessedOn: NgbDateStruct;
  arrivalDate_NorDate: NgbDateStruct;
  berthingDate: NgbDateStruct;
  vesselCompletionDate: NgbDateStruct;
  DelayDate: NgbDateStruct;
  dischargecommencedDate: NgbDateStruct;
  VesselCompletionDate_DP: NgbDateStruct;
  public Eta: NgbDateStruct;
  public Laytime_date: NgbDateStruct;
  public datedischarge: NgbDateStruct;
  public arrivalDateDischarge: NgbDateStruct;
  public berthingDateDischarge: NgbDateStruct;
  public vessel_completion_dp: NgbDateStruct
  public Form1localstoragedata: any
  public Form2localstoragedata: any
  public firstformlocalstorage: any
  public placement = 'top';
  public placementBottom = 'bottom';
  public formSubmit: boolean = false;
  public id;
  public step1: boolean = true;
  public step2: boolean = false;
  public cTypeArray = ['COA', 'Spot'];
  public pTypeArray = ['Annual', 'Spot', 'Term'];
  public vesselDetails: any = '';
  public delaydatainput: any = []
  public date: any;
  public datestoshow: any = [];
  public differencetime: any;
  public dischargedata: any;
  public minDatearrival: any;
  public minDatelaytime: any;
  public minDateberthing: any;
  public minDatedischarge: any;
  public minonDatedischarge: any;
  public minonDatedischarge_vessel: any;
  public maxonDatedischarge: any;
  public minimumetadate: any;
  public maxmimarrival_lpdate: any;
  public maxmimberthing_lpdate: any;
  public minimumcompletion_lpdate: any;
  public delayinput: any = {}

  public history: any;
  public Demurrage_dP: number

  @ViewChild('content1') content1: ElementRef;
  @ViewChild('content2') content2: ElementRef;
  @ViewChild('content3') content3: ElementRef;
  constructor(private routerExtService: RouterExtService, private location: Location, private datePipe: DatePipe, private fb: FormBuilder, calendar: NgbCalendar, public vedentaService: VedantaService, private modalService: NgbModal, public router: Router, public route: ActivatedRoute) {

    // use FormBuilder to create a form group

    this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      ).subscribe((e: any) => {
        this.history = true
        localStorage.setItem('previousurl', e[0].urlAfterRedirects)
        //console.log(e[0].urlAfterRedirects);
        //console.log(this.id)
        //console.log(e) // previous url
      });


    //console.log(localStorage.getItem('previousurl'))
    //console.log(this.routerExtService.getPreviousUrl())
    //console.log(this.location.back, this.history)
    //console.log(document.referrer, window.location.href)


    this.authForm = this.fb.group({
      'Vessel_name': ['', Validators.required],
      'Imo_vessel': ['', Validators.required],
      'Eta': ['', Validators.required],
      'Vessel_type': ['', Validators.required],
      'Gross_tonnage': ['', Validators.required],
      'Demurrage_lP': ['', Validators.required],
      'Demurrage_dP': ['', Validators.required],
      'Ocean_freight': ['', Validators.required],
      'COA_spot': ['', Validators.required],
      'pType': ['', Validators.required],
      'BL_quantity': ['', Validators.required],
      'Type_of_payment': [''],
      'Payment_processed_on': [''],
      'Document_to_treasury': [''],
      'Payment_completed': [''],
      'Payment_completion_date': [''],
      'FOB_cost': ['', Validators.required],

    });


    this.authFormStep2 = this.fb.group({
      arrival_date_NorDate: ["", Validators.required],
      Berthing_date: ["", Validators.required],
      Pre_berthing_delay: ["", Validators.required],
      vessel_completion_date: ["", Validators.required],
      Reason_for_Delay: [""],
      Arrival_time: ["", Validators.required],
      Laytime_date: ["", Validators.required],
      Lay_time_commencement: ["", Validators.required],
      Vessel_Berthed_time: ["", Validators.required],
      Dischrge_commenced_date: ["", Validators.required],
      Discharge_time: ["", Validators.required],
      Discharge_rate: ["", Validators.required],
      Demurrage_rate: ["", Validators.required],
      on_date_discharge: ["", Validators.required],
      ondatedischargevalue: ["", Validators.required],
      arrival_date_Discharge: ["", Validators.required],
      Berthing_date_Discharge: ["", Validators.required],
      vessel_completion_dp: [""]
    });

    this.DelayDataForm = this.fb.group({
      Delay_date: ["", Validators.required],
      From_time: ["", Validators.required],
      To_time: ["", Validators.required],
      Difference_time: ["", Validators.required]
    });


  }
  public open = true;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
    });

    //console.log(this.history)
    this.getVesselDetails();
    // this.chartingdata();

  }

  updateVesselName() {
    console.log(this.authForm.value.Vessel_name);


    var payload = {
      'id': this.id,
      Vessel_name: this.authForm.value.Vessel_name
    }
    this.vedentaService.showLoader()
    this.vedentaService.updateVessName(payload).then((s: any) => {
      this.vedentaService.hideLoader()
      //console.log(s)
    })
  }

  convertdate(date) {
    var datearray = date.split("/");

    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    //console.log(newdate)
    return newdate
  }


  deletedtimedifference(date, index, id) {
    //console.log(date, index, id)
    //console.log(this.datestoshow, this.delaydatainput[date])

    this.delaydatainput[date]['Difference'].splice(index, 1)
    this.delaydatainput[date]['To'].splice(index, 1)
    this.delaydatainput[date]['From'].splice(index, 1)
    if (id != undefined) {
      this.delaydatainput[date]['id'].splice(index, 1)
    }

    if (this.delaydatainput[date]['Difference'].length == 0 && this.delaydatainput[date]['From'].length == 0 && this.delaydatainput[date]['To'].length == 0) {
      var indexdate = this.datestoshow.indexOf(date);
      if (indexdate > -1) {
        this.datestoshow.splice(indexdate, 1);
      }
      delete this.delaydatainput[date]


    }

    // delete this.delaydatainput[date][]
    //console.log(this.delaydatainput, this.datestoshow)

    if (id != undefined) {
      var payload = {
        'id': id
      }
      this.vedentaService.showLoader()
      this.vedentaService.deletedatacharting(payload).then((s: any) => {
        this.vedentaService.hideLoader()
        //console.log(s)
      })
    }

  }



  getVesselDetails() {
    this.vedentaService.showLoader();
    var th = this
    var dataget: boolean

    //console.log(localStorage.getItem('Form1'))
    //console.log(this.router.url, this.router, dataget)


    this.firstformlocalstorage = JSON.parse(localStorage.getItem('Formwithid' + this.id))
    //console.log(this.Form1localstoragedata, this.Form2localstoragedata, this.history)



    let payload = { 'id': this.id }
    this.vedentaService.getVesselInformationById(payload).then((s: any) => {
      this.vesselDetails = s.success.data[0];

      this.dischargedata = s.success.dischargePort[0];
      if (this.vesselDetails != null) {
        console.log(this.vesselDetails.LaycanSelected)
        var lycanmindate = new Date(this.vesselDetails.LaycanSelected.split('-')[1] + "," + this.vesselDetails.ArrivalDate.split('-')[0])
        //console.log(this.vesselDetails.LaycanSelected.split('-')[1], new Date(lycanmindate))
        console.log(lycanmindate)
        this.minimumetadate = {
          year: Number(lycanmindate.getFullYear()),
          month: Number(lycanmindate.getMonth() + 1),
          day: Number(lycanmindate.getDate())
        }
        // var lycanmindate = new Date(this.vesselDetails.LaycanSelected.split('-')[0] + "," + this.vesselDetails.ArrivalDate.split('-')[0])
        // //console.log(this.vesselDetails.LaycanSelected.split('-')[0], new Date(lycanmindate))
        // this.maxmimarrival_lpdate = {
        //   year: Number(lycanmindate.getFullYear()),
        //   month: Number(lycanmindate.getMonth() + 1),
        //   day: Number(lycanmindate.getDate())
        // }
        // this.maxmimberthing_lpdate = this.maxmimarrival_lpdate
      }


      //console.log(this.minimumetadate)

      if (localStorage.getItem('previousurl') == '/chartering-details/' + this.id) {
        this.Form1localstoragedata = JSON.parse(localStorage.getItem('Form1'))
        this.Form2localstoragedata = JSON.parse(localStorage.getItem('Form2'))

        if (this.vesselDetails != undefined) {

          this.vesselDetails.ActualArrivalDate_LP = null
          this.vesselDetails.BL_Quantity = null
          this.vesselDetails.BerthingDate_LP = null
          this.vesselDetails.C_Type = null
          this.vesselDetails.Demurrage_DP = null
          this.vesselDetails.Demurrage_LP = null
          this.vesselDetails.Document_to_treasury = null
          this.vesselDetails.ETA = null
          this.vesselDetails.FOB_Cost = null
          this.vesselDetails.Gross_Tonnage = null
          this.vesselDetails.IMO_Vessel = null
          this.vesselDetails.Ocean_Frieght = null
          this.vesselDetails.P_Type = null
          this.vesselDetails.Payment_Completed = null
          this.vesselDetails.Payment_completion_Date = null
          this.vesselDetails.Payment_processed_on = null
          this.vesselDetails.PreBerthing_Delay_LP = null
          this.vesselDetails.ReasonForDelay_LP = null
          this.vesselDetails.Type_of_Payment = null
          this.vesselDetails.VesselCompletionDate_DP = null
          this.vesselDetails.VesselCompletionDate_LP = null
          this.vesselDetails.VesselType = null
          this.vesselDetails.VesselName = null

        }

        if (this.dischargedata != undefined) {
          this.dischargedata.demurrage_rate_price = null
          this.dischargedata.discharge_commenced = null
          this.dischargedata.discharge_rate_price = null
          this.dischargedata.discharge_rate_value = null
          this.dischargedata.nor_tendered = null
          this.dischargedata.on_date_discharge = null
          this.dischargedata.on_datelaytime_commencement_discharge = null
          this.dischargedata.startdate = null
          this.dischargedata.vessel_berthed = null
        }


        //console.log(this.vesselDetails)
      } else {
        this.Form1localstoragedata = null;
        this.Form2localstoragedata = null;
        localStorage.removeItem('Form1');
        localStorage.removeItem('Form2');
      }
      this.vedentaService.hideLoader()

      //console.log(this.dischargedata)
      this.delaydatainput = JSON.parse(s.success['outtimedata']).data
      this.datestoshow = Object.keys(this.delaydatainput)



      // //console.log(this.Form2localstoragedata)
      // this.ondischargedatechange(this.dischargedata != undefined ? {
      //   year: this.dischargedata.startdate != null ? Number(this.datePipe.transform((this.dischargedata.startdate), 'yyyy')) : this.Form2localstoragedata.on_date_discharge.year,
      //   month: this.dischargedata.startdate != null ? Number(this.datePipe.transform((this.dischargedata.startdate), 'MM')) : this.Form2localstoragedata.on_date_discharge.month,
      //   day: this.dischargedata.startdate != null ? Number(this.datePipe.transform((this.dischargedata.startdate), 'dd')) : this.Form2localstoragedata.on_date_discharge.day
      // } : '')

      // : this.Form2localstoragedata != null && this.Form2localstoragedata!=undefined ? {
      //   year: this.Form2localstoragedata.on_date_discharge.year,
      //   month: this.Form2localstoragedata.on_date_discharge.month,
      //   day: this.Form2localstoragedata.on_date_discharge.day
      // } : 


      if (this.vesselDetails != undefined) {
        //console.log(this.firstformlocalstorage)
        this.authForm.patchValue({
          'Vessel_name': this.firstformlocalstorage != null ? this.firstformlocalstorage.Vessel_name : (this.vesselDetails.VesselName != null) ? this.vesselDetails.VesselName : this.Form1localstoragedata != null ? this.Form1localstoragedata.Vessel_name : '',
          'Imo_vessel': this.firstformlocalstorage != null ? this.firstformlocalstorage.Imo_vessel : (this.vesselDetails.IMO_Vessel != null) ? this.vesselDetails.IMO_Vessel : this.Form1localstoragedata != null ? this.Form1localstoragedata.Imo_vessel : '',
          'Eta': {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Eta.year : this.vesselDetails.ETA != null ? Number(this.datePipe.transform(this.vesselDetails.ETA, 'yyyy')) : this.Form1localstoragedata != null && this.Form1localstoragedata.Eta != null ? this.Form1localstoragedata.Eta.year : '',
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Eta.month : this.vesselDetails.ETA != null ? Number(this.datePipe.transform(this.vesselDetails.ETA, 'MM')) : this.Form1localstoragedata != null && this.Form1localstoragedata.Eta != null ? this.Form1localstoragedata.Eta.month : '',
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Eta.day : this.vesselDetails.ETA != null ? Number(this.datePipe.transform(this.vesselDetails.ETA, 'dd')) : this.Form1localstoragedata != null && this.Form1localstoragedata.Eta != null ? this.Form1localstoragedata.Eta.day : ''
          },
          'Vessel_type': this.firstformlocalstorage != null ? this.firstformlocalstorage.Vessel_type : (this.vesselDetails.VesselType != null) ? this.vesselDetails.VesselType : this.Form1localstoragedata != null ? this.Form1localstoragedata.Vessel_type : '',
          'Gross_tonnage': this.firstformlocalstorage != null ? this.firstformlocalstorage.Gross_tonnage : (this.vesselDetails.Gross_Tonnage != null) ? this.vesselDetails.Gross_Tonnage : this.Form1localstoragedata != null ? this.Form1localstoragedata.Gross_tonnage : '',
          'Demurrage_lP': this.firstformlocalstorage != null ? this.firstformlocalstorage.Demurrage_lP : (this.vesselDetails.Demurrage_LP != null) ? this.vesselDetails.Demurrage_LP : this.Form1localstoragedata != null ? this.Form1localstoragedata.Demurrage_lP : '',
          'Demurrage_dP': this.firstformlocalstorage != null ? this.firstformlocalstorage.Demurrage_dP : (this.vesselDetails.Demurrage_DP != null) ? this.vesselDetails.Demurrage_DP : this.Form1localstoragedata != null ? this.Form1localstoragedata.Demurrage_dP : '',
          'Ocean_freight': this.firstformlocalstorage != null ? this.firstformlocalstorage.Ocean_freight : (this.vesselDetails.Ocean_Frieght != null) ? this.vesselDetails.Ocean_Frieght : this.Form1localstoragedata != null ? this.Form1localstoragedata.Ocean_freight : '',
          'COA_spot': this.firstformlocalstorage != null ? this.firstformlocalstorage.COA_spot : (this.vesselDetails.C_Type != null) ? this.vesselDetails.C_Type : this.Form1localstoragedata != null ? this.Form1localstoragedata.COA_spot : '',
          'pType': this.firstformlocalstorage != null ? this.firstformlocalstorage.pType : (this.vesselDetails.P_Type != null) ? this.vesselDetails.P_Type : this.Form1localstoragedata != null ? this.Form1localstoragedata.pType : '',
          'BL_quantity': this.firstformlocalstorage != null ? this.firstformlocalstorage.BL_quantity : (this.vesselDetails.BL_Quantity != null) ? this.vesselDetails.BL_Quantity : this.Form1localstoragedata != null ? this.Form1localstoragedata.BL_quantity : '',
          'Type_of_payment': this.firstformlocalstorage != null ? this.firstformlocalstorage.Type_of_payment : (this.vesselDetails.Type_of_Payment != null) ? this.vesselDetails.Type_of_Payment : this.Form1localstoragedata != null ? this.Form1localstoragedata.Type_of_payment : '',
          'FOB_cost': this.firstformlocalstorage != null ? this.firstformlocalstorage.FOB_cost : (this.vesselDetails.FOB_Cost != null) ? this.vesselDetails.FOB_Cost : this.Form1localstoragedata != null ? this.Form1localstoragedata.FOB_cost : '',
        })


        if (this.vesselDetails.Payment_processed_on != '1900-01-01T00:00:00.000Z' && this.vesselDetails.Payment_processed_on != '1900-01-01' && this.vesselDetails.Payment_processed_on != '' && this.vesselDetails.Payment_processed_on != undefined) {
          this.paymentProcessedOn = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_processed_on.year : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_processed_on, 'yyyy')) : this.Form1localstoragedata.Payment_processed_on.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_processed_on.month : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_processed_on, 'MM')) : this.Form1localstoragedata.Payment_processed_on.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_processed_on.day : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_processed_on, 'dd')) : this.Form1localstoragedata.Payment_processed_on.day)
          }
        }
        else if (this.firstformlocalstorage != null && this.firstformlocalstorage.Payment_processed_on != undefined && this.firstformlocalstorage.Payment_processed_on != '' && this.firstformlocalstorage.Payment_processed_on.year != '1900' && this.firstformlocalstorage.Payment_processed_on.year != '' && this.firstformlocalstorage.Payment_processed_on.year != undefined) {
          this.paymentProcessedOn = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_processed_on.year : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_processed_on, 'yyyy')) : this.Form1localstoragedata.Payment_processed_on.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_processed_on.month : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_processed_on, 'MM')) : this.Form1localstoragedata.Payment_processed_on.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_processed_on.day : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_processed_on, 'dd')) : this.Form1localstoragedata.Payment_processed_on.day)
          }

        }

        if (this.vesselDetails.Document_to_treasury != '1900-01-01T00:00:00.000Z' && this.vesselDetails.Document_to_treasury != '1900-01-01' && this.vesselDetails.Document_to_treasury != '' && this.vesselDetails.Document_to_treasury != undefined) {
          this.documentToTreasury = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Document_to_treasury.year : Number(this.vesselDetails.Document_to_treasury != null ? Number(this.datePipe.transform(this.vesselDetails.Document_to_treasury, 'yyyy')) : this.Form1localstoragedata.Document_to_treasury.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Document_to_treasury.month : Number(this.vesselDetails.Document_to_treasury != null ? Number(this.datePipe.transform(this.vesselDetails.Document_to_treasury, 'MM')) : this.Form1localstoragedata.Document_to_treasury.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Document_to_treasury.day : Number(this.vesselDetails.Document_to_treasury != null ? Number(this.datePipe.transform(this.vesselDetails.Document_to_treasury, 'dd')) : this.Form1localstoragedata.Document_to_treasury.day)
          }
        }
        else if (this.firstformlocalstorage != null && this.firstformlocalstorage.Document_to_treasury != undefined && this.firstformlocalstorage.Document_to_treasury != '' && this.firstformlocalstorage.Document_to_treasury.year != '1900' && this.firstformlocalstorage.Document_to_treasury.year != '' && this.firstformlocalstorage.Document_to_treasury.year != undefined) {
          this.documentToTreasury = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Document_to_treasury.year : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Document_to_treasury, 'yyyy')) : this.Form1localstoragedata.Document_to_treasury.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Document_to_treasury.month : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Document_to_treasury, 'MM')) : this.Form1localstoragedata.Document_to_treasury.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Document_to_treasury.day : Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.Document_to_treasury, 'dd')) : this.Form1localstoragedata.Document_to_treasury.day)
          }

        }


        if (this.vesselDetails.Payment_Completed != '1900-01-01T00:00:00.000Z' && this.vesselDetails.Payment_Completed != '1900-01-01' && this.vesselDetails.Payment_Completed != '' && this.vesselDetails.Payment_Completed != undefined) {
          this.paymentComplete = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completed.year : Number(this.vesselDetails.Payment_Completed != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_Completed, 'yyyy')) : this.Form1localstoragedata.Payment_completed.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completed.month : Number(this.vesselDetails.Payment_Completed != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_Completed, 'MM')) : this.Form1localstoragedata.Payment_completed.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completed.day : Number(this.vesselDetails.Payment_Completed != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_Completed, 'dd')) : this.Form1localstoragedata.Payment_completed.day)
          }
        }
        else if (this.firstformlocalstorage != null && this.firstformlocalstorage.Payment_completed != undefined && this.firstformlocalstorage.Payment_completed != '' && this.firstformlocalstorage.Payment_completed.year != '1900' && this.firstformlocalstorage.Payment_completed.year != '' && this.firstformlocalstorage.Payment_completed.year != undefined) {
          this.paymentComplete = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completed.year : Number(this.vesselDetails.Payment_Completed != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_Completed, 'yyyy')) : this.Form1localstoragedata.Payment_completed.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completed.month : Number(this.vesselDetails.Payment_Completed != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_Completed, 'MM')) : this.Form1localstoragedata.Payment_completed.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completed.day : Number(this.vesselDetails.Payment_Completed != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_Completed, 'dd')) : this.Form1localstoragedata.Payment_completed.day)
          }

        }

        if (this.vesselDetails.Payment_completion_Date != '1900-01-01T00:00:00.000Z' && this.vesselDetails.Payment_completion_Date != '1900-01-01' && this.vesselDetails.Payment_completion_Date != '' && this.vesselDetails.Payment_completion_Date != undefined) {
          this.paymentCompletionDate = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completion_date.year : Number(this.vesselDetails.Payment_completion_Date != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_completion_Date, 'yyyy')) : this.Form1localstoragedata.Payment_completion_date.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completion_date.month : Number(this.vesselDetails.Payment_completion_Date != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_completion_Date, 'MM')) : this.Form1localstoragedata.Payment_completion_date.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completion_date.day : Number(this.vesselDetails.Payment_completion_Date != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_completion_Date, 'dd')) : this.Form1localstoragedata.Payment_completion_date.day)
          }
        }
        else if (this.firstformlocalstorage != null && this.firstformlocalstorage.Payment_completion_date != undefined && this.firstformlocalstorage.Payment_completion_Date.year != '1900' && this.firstformlocalstorage.Payment_completion_Date.year != '' && this.firstformlocalstorage.Payment_completion_date.year != '' && this.firstformlocalstorage.Payment_completion_date.year != undefined) {
          this.paymentCompletionDate = {
            year: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completion_date.year : Number(this.vesselDetails.Payment_completion_Date != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_completion_Date, 'yyyy')) : this.Form1localstoragedata.Payment_completion_date.year),
            month: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completion_date.month : Number(this.vesselDetails.Payment_completion_Date != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_completion_Date, 'MM')) : this.Form1localstoragedata.Payment_completion_date.month),
            day: this.firstformlocalstorage != null ? this.firstformlocalstorage.Payment_completion_date.day : Number(this.vesselDetails.Payment_completion_Date != null ? Number(this.datePipe.transform(this.vesselDetails.Payment_completion_Date, 'dd')) : this.Form1localstoragedata.Payment_completion_date.day)
          }
        }
        console.log(this.Form2localstoragedata, this.vesselDetails.VesselCompletionDate_DP, this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'yyyy'))
        if (this.vesselDetails.VesselCompletionDate_DP != '1900-01-01T00:00:00.000Z' && this.vesselDetails.VesselCompletionDate_DP != '1900-01-01' && this.vesselDetails.VesselCompletionDate_DP != '' && this.vesselDetails.VesselCompletionDate_DP != undefined) {
          console.log('isode if')
          this.vessel_completion_dp = {
            year: Number(this.vesselDetails.VesselCompletionDate_DP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'yyyy')) : (this.Form2localstoragedata != null && this.Form2localstoragedata.vessel_completion_dp != null) ? this.Form2localstoragedata.vessel_completion_dp.year : ''),
            month: Number(this.vesselDetails.VesselCompletionDate_DP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'MM')) : (this.Form2localstoragedata != null && this.Form2localstoragedata.vessel_completion_dp != null) ? this.Form2localstoragedata.vessel_completion_dp.month : ''),
            day: Number(this.vesselDetails.VesselCompletionDate_DP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'dd')) : (this.Form2localstoragedata != null && this.Form2localstoragedata.vessel_completion_dp != null) ? this.Form2localstoragedata.vessel_completion_dp.day : '')
          }
        }
      } else {
        this.router.navigate(['/vessel-portal'])
      }

      // else  if(this.firstformlocalstorage.vessel_completion_dp.year != '1900'&&this.firstformlocalstorage.vessel_completion_dp.year  != '' &&this.firstformlocalstorage.vessel_completion_dp.year  != undefined){
      //   this.paymentProcessedOn = {
      //     year:this.firstformlocalstorage!=null?this.firstformlocalstorage.vessel_completion_dp.year: Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'yyyy')) : this.Form1localstoragedata.vessel_completion_dp.year),
      //     month:this.firstformlocalstorage!=null?this.firstformlocalstorage.vessel_completion_dp.month: Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'MM')) : this.Form1localstoragedata.vessel_completion_dp.month),
      //     day:this.firstformlocalstorage!=null?this.firstformlocalstorage.vessel_completion_dp.day: Number(this.vesselDetails.Payment_processed_on != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'dd')) : this.Form1localstoragedata.vessel_completion_dp.day)
      //   }

      // }


      //console.log("qwert" + this.dischargedata)
      this.authFormStep2.patchValue({
        'arrival_date_NorDate': this.vesselDetails != undefined ? {
          year: this.vesselDetails.ActualArrivalDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.ActualArrivalDate_LP, 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.arrival_date_NorDate != null ? this.Form2localstoragedata.arrival_date_NorDate.year : '',
          month: this.vesselDetails.ActualArrivalDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.ActualArrivalDate_LP, 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.arrival_date_NorDate != null ? this.Form2localstoragedata.arrival_date_NorDate.month : '',
          day: this.vesselDetails.ActualArrivalDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.ActualArrivalDate_LP, 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.arrival_date_NorDate != null ? this.Form2localstoragedata.arrival_date_NorDate.day : ''
        } : '',
        // 'vessel_completion_dp': this.vesselDetails != undefined ? {
        //   year: this.vesselDetails.VesselCompletionDate_DP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'yyyy')) : this.Form2localstoragedata==null?'': this.Form2localstoragedata.vessel_completion_dp.year,
        //   month: this.vesselDetails.VesselCompletionDate_DP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'MM')) : this.Form2localstoragedata==null?'':this.Form2localstoragedata.vessel_completion_dp.month,
        //   day: this.vesselDetails.VesselCompletionDate_DP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_DP, 'dd')) :this.Form2localstoragedata==null?'': this.Form2localstoragedata.vessel_completion_dp.day
        // } : '',
        'Berthing_date': this.vesselDetails != undefined ? {
          year: this.vesselDetails.BerthingDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.BerthingDate_LP, 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Berthing_date != null ? this.Form2localstoragedata.Berthing_date.year : '',
          month: this.vesselDetails.BerthingDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.BerthingDate_LP, 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Berthing_date != null ? this.Form2localstoragedata.Berthing_date.month : '',
          day: this.vesselDetails.BerthingDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.BerthingDate_LP, 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Berthing_date != null ? this.Form2localstoragedata.Berthing_date.day : ''
        } : '',
        'Pre_berthing_delay': this.vesselDetails != undefined && this.vesselDetails.PreBerthing_Delay_LP != null ? this.vesselDetails.PreBerthing_Delay_LP : this.Form2localstoragedata != null ? this.Form2localstoragedata.Pre_berthing_delay : '',
        'vessel_completion_date': this.vesselDetails != undefined ? {
          year: this.vesselDetails.VesselCompletionDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_LP, 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.vessel_completion_date != null ? this.Form2localstoragedata.vessel_completion_date.year : '',
          month: this.vesselDetails.VesselCompletionDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_LP, 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.vessel_completion_date != null ? this.Form2localstoragedata.vessel_completion_date.month : '',
          day: this.vesselDetails.VesselCompletionDate_LP != null ? Number(this.datePipe.transform(this.vesselDetails.VesselCompletionDate_LP, 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.vessel_completion_date != null ? this.Form2localstoragedata.vessel_completion_date.day : ''
        } : '',
        'arrival_date_Discharge': this.dischargedata != undefined ? {
          year: (this.dischargedata != undefined && this.dischargedata.vessel_arrived != null) ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.arrival_date_Discharge != null ? this.Form2localstoragedata.arrival_date_Discharge.year : '',
          month: (this.dischargedata != undefined && this.dischargedata.vessel_arrived != null) ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.arrival_date_Discharge != null ? this.Form2localstoragedata.arrival_date_Discharge.month : '',
          day: (this.dischargedata != undefined && this.dischargedata.vessel_arrived != null) ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.arrival_date_Discharge != null ? this.Form2localstoragedata.arrival_date_Discharge.day : ''
        } : this.Form2localstoragedata != null && this.Form2localstoragedata.arrival_date_Discharge ? {
          year: this.Form2localstoragedata.arrival_date_Discharge.year,
          month: this.Form2localstoragedata.arrival_date_Discharge.month,
          day: this.Form2localstoragedata.arrival_date_Discharge.day
        } : '',
        'Arrival_time': this.dischargedata != undefined && this.dischargedata.vessel_arrived != null ? (this.dischargedata.vessel_arrived).split(" ")[1] : this.Form2localstoragedata != null ? this.Form2localstoragedata.Arrival_time : '',
        'Laytime_date': this.dischargedata != undefined ? {
          year: this.dischargedata.on_datelaytime_commencement_discharge != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.on_datelaytime_commencement_discharge), 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Laytime_date != null ? this.Form2localstoragedata.Laytime_date.year : '',
          month: this.dischargedata.on_datelaytime_commencement_discharge != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.on_datelaytime_commencement_discharge), 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Laytime_date != null ? this.Form2localstoragedata.Laytime_date.month : '',
          day: this.dischargedata.on_datelaytime_commencement_discharge != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.on_datelaytime_commencement_discharge), 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Laytime_date != null ? this.Form2localstoragedata.Laytime_date.day : ''
        } : this.Form2localstoragedata != null && this.Form2localstoragedata.Laytime_date != null ? {
          year: this.Form2localstoragedata.Laytime_date.year,
          month: this.Form2localstoragedata.Laytime_date.month,
          day: this.Form2localstoragedata.Laytime_date.day
        } : '',
        'Lay_time_commencement': this.dischargedata != undefined && this.dischargedata.on_datelaytime_commencement_discharge != null ? (this.dischargedata.on_datelaytime_commencement_discharge).split(" ")[1] : this.Form2localstoragedata != null ? this.Form2localstoragedata.Lay_time_commencement : '',
        'Berthing_date_Discharge': this.dischargedata != undefined ? {
          year: this.dischargedata.vessel_berthed != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_berthed), 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Berthing_date_Discharge != null ? this.Form2localstoragedata.Berthing_date_Discharge.year : '',
          month: this.dischargedata.vessel_berthed != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_berthed), 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Berthing_date_Discharge != null ? this.Form2localstoragedata.Berthing_date_Discharge.month : '',
          day: this.dischargedata.vessel_berthed != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_berthed), 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Berthing_date_Discharge != null ? this.Form2localstoragedata.Berthing_date_Discharge.day : ''
        } : this.Form2localstoragedata != null && this.Form2localstoragedata.Berthing_date_Discharge != null ? {
          year: this.Form2localstoragedata != null ? this.Form2localstoragedata.Berthing_date_Discharge.year : '',
          month: this.Form2localstoragedata != null ? this.Form2localstoragedata.Berthing_date_Discharge.month : '',
          day: this.Form2localstoragedata != null ? this.Form2localstoragedata.Berthing_date_Discharge.day : ''
        } : '',
        'Vessel_Berthed_time': this.dischargedata != undefined && this.dischargedata.vessel_berthed != null ? (this.dischargedata.vessel_berthed).split(" ")[1] : this.Form2localstoragedata != null ? this.Form2localstoragedata.Vessel_Berthed_time : '',
        'Dischrge_commenced_date': this.dischargedata != undefined ? {
          year: this.dischargedata.discharge_commenced != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.discharge_commenced), 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Dischrge_commenced_date != null ? this.Form2localstoragedata.Dischrge_commenced_date.year : '',
          month: this.dischargedata.discharge_commenced != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.discharge_commenced), 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Dischrge_commenced_date != null ? this.Form2localstoragedata.Dischrge_commenced_date.month : '',
          day: this.dischargedata.discharge_commenced != null ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.discharge_commenced), 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.Dischrge_commenced_date != null ? this.Form2localstoragedata.Dischrge_commenced_date.day : ''
        } : this.Form2localstoragedata != null && this.Form2localstoragedata.Dischrge_commenced_date != null ? {
          year: this.Form2localstoragedata != null ? this.Form2localstoragedata.Dischrge_commenced_date.year : '',
          month: this.Form2localstoragedata != null ? this.Form2localstoragedata.Dischrge_commenced_date.month : '',
          day: this.Form2localstoragedata != null ? this.Form2localstoragedata.Dischrge_commenced_date.day : ''
        } : '',
        'on_date_discharge': this.dischargedata != undefined ? {
          year: this.dischargedata.startdate != null ? Number(this.datePipe.transform((this.dischargedata.startdate), 'yyyy')) : this.Form2localstoragedata != null && this.Form2localstoragedata.on_date_discharge != null ? this.Form2localstoragedata.on_date_discharge.year : '',
          month: this.dischargedata.startdate != null ? Number(this.datePipe.transform((this.dischargedata.startdate), 'MM')) : this.Form2localstoragedata != null && this.Form2localstoragedata.on_date_discharge != null ? this.Form2localstoragedata.on_date_discharge.month : '',
          day: this.dischargedata.startdate != null ? Number(this.datePipe.transform((this.dischargedata.startdate), 'dd')) : this.Form2localstoragedata != null && this.Form2localstoragedata.on_date_discharge != null ? this.Form2localstoragedata.on_date_discharge.day : ''
        } : this.Form2localstoragedata != null && this.Form2localstoragedata.on_date_discharge != null ? {
          year: this.Form2localstoragedata != null ? this.Form2localstoragedata.on_date_discharge.year : '',
          month: this.Form2localstoragedata != null ? this.Form2localstoragedata.on_date_discharge.month : '',
          day: this.Form2localstoragedata != null ? this.Form2localstoragedata.on_date_discharge.day : ''
        } : '',
        'ondatedischargevalue': this.dischargedata != undefined && this.dischargedata.on_date_discharge != null ? this.dischargedata.on_date_discharge : this.Form2localstoragedata != null ? this.Form2localstoragedata.ondatedischargevalue : '',
        'Discharge_time': this.dischargedata != undefined && this.dischargedata.discharge_commenced != null ? (this.dischargedata.discharge_commenced).split(" ")[1] : this.Form2localstoragedata != null ? this.Form2localstoragedata.Discharge_time : '',
        'Reason_for_Delay': this.vesselDetails != undefined && (this.vesselDetails.ReasonForDelay_LP != null) ? this.vesselDetails.ReasonForDelay_LP : this.Form2localstoragedata != null ? this.Form2localstoragedata.Reason_for_Delay : '',
        'Discharge_rate': this.vesselDetails != undefined ? this.vesselDetails.DischargePortSuggested == 'KSPL' ? '7500' : '3500' : '',
        'Demurrage_rate': this.Demurrage_dP,
      })


      //console.log(this.authFormStep2.value)
      this.arrivaldatechange_lp(this.authFormStep2.value.arrival_date_NorDate)
      this.berthingdatechange_lp(this.authFormStep2.value.Berthing_date)
      this.completiondatechange_lp(this.authFormStep2.value.vessel_completion_date);
      this.arrivaldatechange(this.authFormStep2.value.arrival_date_Discharge);
      this.laytimedatechange(this.authFormStep2.value.Laytime_date);
      this.berthingdatechange(this.authFormStep2.value.Berthing_date_Discharge);
      this.ondischargedatechange(this.authFormStep2.value.on_date_discharge);



      // //console.log('by id vessel Data', this.vesselDetails)
    })


  }


  toggleSidenav() {
    this.open = !this.open;
  }

  demurragedpchange() {
    //console.log("wesfgh")
    this.Demurrage_dP = this.authForm.value.Demurrage_dP
    this.authFormStep2.patchValue({
      'Demurrage_rate': this.Demurrage_dP
    })

  }


  arrivaldatechange_lp(date) {
    //console.log(date)
    if (date == '') return;
    //console.log(this.authFormStep2.value)
    this.maxmimberthing_lpdate = {
      year: date.year,
      month: date.month,
      day: date.day
    }
  }



  berthingdatechange_lp(date) {
    //console.log(date)

    this.minimumcompletion_lpdate = {
      year: date.year,
      month: date.month,
      day: date.day
    }
  }


  completiondatechange_lp(date) {
    //console.log(date)

    this.minDatearrival = {
      year: date.year,
      month: date.month,
      day: date.day
    }
  }



  arrivaldatechange(date) {
    if (date == '') return;
    // var databasearrived = new Date(Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'yyyy')), Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'MM')), Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'DD')))
    // //console.log(databasearrived)
    // year: (this.dischargedata.vessel_arrived != null && this.dischargedata != undefined) ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'yyyy')) : this.Form2localstoragedata.arrival_date_Discharge.year,
    // month: (this.dischargedata.vessel_arrived != null && this.dischargedata != undefined) ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'MM')) : this.Form2localstoragedata.arrival_date_Discharge.month,
    // day: (this.dischargedata.vessel_arrived != null && this.dischargedata != undefined) ? Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'dd')) : this.Form2localstoragedata.arrival_date_Discharge.day
    //console.log("defrgthrkiryujgfd")
    if (this.dischargedata != undefined && this.dischargedata.vessel_arrived != null) {
      var vesselarriveddate = new Date(this.convertdate(this.dischargedata.vessel_arrived.split(" ")[0]))
      var datedata = new Date(date.year, date.month - 1, date.day)
      if (datedata.getTime() == vesselarriveddate.getTime()) {
        //console.log("done")


      } else {
        let confirmvalue = confirm("This Will delete all previous data.  Are You Sure?");
        //console.log(confirmvalue)
        if (confirmvalue == true) {

        } else {
          this.arrivalDateDischarge = {
            year: Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'yyyy')),
            month: Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'MM')),
            day: Number(this.datePipe.transform(this.convertdate(this.dischargedata.vessel_arrived), 'dd'))
          }
        }
      }
      //console.log("lkjh", vesselarriveddate, datedata)
    } else {


    }
    this.minDatelaytime = {
      year: date.year,
      month: date.month,
      day: date.day
    };
    // this.minDatelaytime = this.minDatearrival;
  }



  laytimedatechange(date) {
    //console.log(date)
    if (date == '') return
    this.minDateberthing = {
      year: date.year,
      month: date.month,
      day: date.day
    };
    if (this.authFormStep2.value.Lay_time_commencement < "06:00") {
      console.log("less")
      console.log(this.authFormStep2.value.Laytime_date)
      var previousday = new Date(date.year, date.month - 1, date.day)
      var nextday = new Date(date.year, date.month - 1, date.day)
      var d = new Date(date.year, date.month - 1, date.day);
      console.log(d, d.getDate() - 1, d.getDate() + 1)
      previousday.setDate(d.getDate() - 1);
      this.minonDatedischarge = {
        year: previousday.getFullYear(),
        month: previousday.getMonth() + 1,
        day: previousday.getDate()
      };
      this.maxonDatedischarge = {
        year: previousday.getFullYear(),
        month: previousday.getMonth() + 1,
        day: previousday.getDate()
      };
    } else {
      console.log("more")
      console.log(this.authFormStep2.value.Laytime_date)
      this.minonDatedischarge = {
        year: date.year,
        month: date.month,
        day: date.day
      };

      this.maxonDatedischarge = {
        year: date.year,
        month: date.month,
        day: date.day
      };
    }


  }

  laytimechange() {
    console.log(this.authFormStep2.value.Lay_time_commencement)
    if (this.authFormStep2.value.Lay_time_commencement < "06:00") {
      console.log("less")
      console.log(this.authFormStep2.value.Laytime_date)
      var previousday = new Date(this.authFormStep2.value.Laytime_date.year, this.authFormStep2.value.Laytime_date.month - 1, this.authFormStep2.value.Laytime_date.day)

      var d = new Date(this.authFormStep2.value.Laytime_date.year, this.authFormStep2.value.Laytime_date.month - 1, this.authFormStep2.value.Laytime_date.day);
      console.log(d, d.getDate() - 1, d.getDate() + 1)
      previousday.setDate(d.getDate() - 1);
      this.minonDatedischarge = {
        year: previousday.getFullYear(),
        month: previousday.getMonth() + 1,
        day: previousday.getDate()
      };
      this.maxonDatedischarge = {
        year: previousday.getFullYear(),
        month: previousday.getMonth() + 1,
        day: previousday.getDate()
      };
    } else {
      console.log("more")
      console.log(this.authFormStep2.value.Laytime_date)
      this.minonDatedischarge = {
        year: this.authFormStep2.value.Laytime_date.year,
        month: this.authFormStep2.value.Laytime_date.month,
        day: this.authFormStep2.value.Laytime_date.day
      };
      this.maxonDatedischarge = {
        year: this.authFormStep2.value.Laytime_date.year,
        month:this.authFormStep2.value.Laytime_date.month,
        day: this.authFormStep2.value.Laytime_date.day
      };
    }
  }

  berthingdatechange(date) {
    //console.log(date)
    if (date == '') return
    this.minDatedischarge = {
      year: date.year,
      month: date.month,
      day: date.day
    };
    // this.minDatedischarge = this.minDateberthing;

  }
  dischargecommenceddatechange(date) {
    //console.log(date)
    if (date == '') return
    // this.ondischargedatechange({
    //   year: date.year,
    //   month: date.month,
    //   day: date.day
    // })
  }
  ondischargedatechange(date) {
    //console.log(date)
    if (date == '') return
    this.minonDatedischarge_vessel = {
      year: date.year,
      month: date.month,
      day: date.day
    };
    this.minonDatedischarge = {
      year: date.year,
      month: date.month,
      day: date.day
    };
    var previousday = new Date(date.year, date.month - 1, date.day)
    var nextday = new Date(date.year, date.month - 1, date.day)
    var d = new Date(date.year, date.month - 1, date.day);
    console.log(d, d.getDate() - 1, d.getDate() + 1)
    previousday.setDate(d.getDate() - 1);
    nextday.setDate(d.getDate() + 1);
    console.log(previousday, nextday)
    // this.minonDatedischarge = {
    //   year: previousday.getFullYear(),
    //   month: previousday.getMonth() + 1,
    //   day: previousday.getDate()
    // };

    this.maxonDatedischarge = {
      year: nextday.getFullYear(),
      month: nextday.getMonth() + 1,
      day: nextday.getDate()
    };
  }

  // ondateclick(){
  //   console.log("dadad")
  //   console.log( this.authFormStep2.value.Lay_time_commencement)
  // }
  submitmodal() {

    this.formSubmit = true;
    //console.log(this.authForm.value, this.authFormStep2.value)
    //console.log(this.authFormStep2.value.arrival_date_Discharge.year + this.authFormStep2.value.arrival_date_Discharge.month + this.authFormStep2.value.arrival_date_Discharge.day)
    var arrivalcheck = new Date(this.authFormStep2.value.arrival_date_Discharge.year + " " + this.authFormStep2.value.arrival_date_Discharge.month + " " + this.authFormStep2.value.arrival_date_Discharge.day + " " + this.authFormStep2.value.Arrival_time)
    var laytimecheck = new Date(this.authFormStep2.value.Laytime_date.year + " " + this.authFormStep2.value.Laytime_date.month + " " + this.authFormStep2.value.Laytime_date.day + " " + this.authFormStep2.value.Lay_time_commencement)
    var berthcheck = new Date(this.authFormStep2.value.Berthing_date_Discharge.year + " " + this.authFormStep2.value.Berthing_date_Discharge.month + " " + this.authFormStep2.value.Berthing_date_Discharge.day + " " + this.authFormStep2.value.Vessel_Berthed_time)
    var dischargecheck = new Date(this.authFormStep2.value.Dischrge_commenced_date.year + " " + this.authFormStep2.value.Dischrge_commenced_date.month + " " + this.authFormStep2.value.Dischrge_commenced_date.day + " " + this.authFormStep2.value.Discharge_time)

    //console.log(arrivalcheck.getTime(), laytimecheck.getTime())
    if (arrivalcheck.getTime() > laytimecheck.getTime()) {
      document.getElementById("arrivaltime").classList.add("error");
      //console.log("1");
    } else if (laytimecheck.getTime() > berthcheck.getTime()) {
      document.getElementById("laytimecommencement").classList.add("error");
      document.getElementById("arrivaltime").classList.remove("error");
      // document.getElementById("arrivaltime").classList.add("has-success");
      // document.getElementById("Vessel_berthed_time").classList.add("has-success");
      //console.log("2");
    } else if (berthcheck.getTime() > dischargecheck.getTime()) {
      document.getElementById("Vessel_berthed_time").classList.add("error");
      document.getElementById("arrivaltime").classList.remove("error");
      document.getElementById("laytimecommencement").classList.remove("error");
      //console.log("3");
    } else {
      document.getElementById("arrivaltime").classList.remove("error");
      document.getElementById("laytimecommencement").classList.remove("error");
      document.getElementById("Vessel_berthed_time").classList.remove("error");
      if (this.authForm.valid && this.authFormStep2.valid) {
        //console.log(this.authForm.value)
        this.vedentaService.showLoader();
        let payload = { 'id': this.id, 'data': this.authForm.value, 'data2': this.authFormStep2.value }
        this.vedentaService.updateVesselInformation(payload).then((s: any) => {

          this.updatevesseldata();
          localStorage.removeItem('Form1');
          localStorage.removeItem('Form2');
          localStorage.removeItem('Formwithid' + this.id);
          this.vedentaService.hideLoader();

          this.modalService.open(this.content2, { windowClass: 'customsubmit_modal', centered: true });
          this.router.navigate(['/vessel-portal'])
        })

      }
    }
    //console.log(arrivalcheck, laytimecheck)

  }

  updatevesseldata() {
    //console.log(this.authForm.value, this.authFormStep2.value)
    var vessel_arrived = this.authFormStep2.value.arrival_date_Discharge.day + "/" + this.authFormStep2.value.arrival_date_Discharge.month + "/" + this.authFormStep2.value.arrival_date_Discharge.year + " " + this.authFormStep2.value.Arrival_time
    var laytime = this.authFormStep2.value.Laytime_date.day + "/" + this.authFormStep2.value.Laytime_date.month + "/" + this.authFormStep2.value.Laytime_date.year + " " + this.authFormStep2.value.Lay_time_commencement
    var vessel_berthed = this.authFormStep2.value.Berthing_date_Discharge.day + "/" + this.authFormStep2.value.Berthing_date_Discharge.month + "/" + this.authFormStep2.value.Berthing_date_Discharge.year + " " + this.authFormStep2.value.Vessel_Berthed_time
    var discharge = this.authFormStep2.value.Dischrge_commenced_date.day + "/" + this.authFormStep2.value.Dischrge_commenced_date.month + "/" + this.authFormStep2.value.Dischrge_commenced_date.year + " " + this.authFormStep2.value.Discharge_time
    var datetimeinput = this.authFormStep2.value.on_date_discharge.day + "/" + this.authFormStep2.value.on_date_discharge.month + "/" + this.authFormStep2.value.on_date_discharge.year
    var laycommencemntcheck = this.authFormStep2.value.Laytime_date.year + "-" + ('0' + this.authFormStep2.value.Laytime_date.month).slice(-2) + "-" + ('0' + this.authFormStep2.value.Laytime_date.day).slice(-2)
    var datetimeinputcheck = this.authFormStep2.value.on_date_discharge.year + "-" + ('0' + this.authFormStep2.value.on_date_discharge.month).slice(-2) + "-" + ('0' + this.authFormStep2.value.on_date_discharge.day).slice(-2)
    //console.log(this.delaydatainput, this.delaydatainput[datetimeinputcheck], datetimeinputcheck)
    var laytimeinput_obj = new Date(this.authFormStep2.value.Laytime_date.year, this.authFormStep2.value.Laytime_date.month - 1, this.authFormStep2.value.Laytime_date.day, this.authFormStep2.value.Lay_time_commencement.split(':')[0], this.authFormStep2.value.Lay_time_commencement.split(':')[1])
    var layinput_obj = new Date(this.authFormStep2.value.Laytime_date.year, this.authFormStep2.value.Laytime_date.month - 1, this.authFormStep2.value.Laytime_date.day)
    var datetimeinput_obj = new Date(this.authFormStep2.value.Dischrge_commenced_date.year, this.authFormStep2.value.Dischrge_commenced_date.month - 1, this.authFormStep2.value.Dischrge_commenced_date.day, this.authFormStep2.value.Discharge_time.split(':')[0], this.authFormStep2.value.Discharge_time.split(':')[1])
    var dateinput_obj = new Date(this.authFormStep2.value.Dischrge_commenced_date.year, this.authFormStep2.value.Dischrge_commenced_date.month - 1, this.authFormStep2.value.Dischrge_commenced_date.day)
    var discharge_obj = new Date(this.authFormStep2.value.on_date_discharge.year, this.authFormStep2.value.on_date_discharge.month - 1, this.authFormStep2.value.on_date_discharge.day)
    console.log(laytimeinput_obj, discharge_obj, datetimeinput_obj, dateinput_obj, this.authFormStep2.value.Lay_time_commencement)
    // if (dateinput_obj.getTime() == discharge_obj.getTime()) {
    //   var layinputcheck_obj = new Date(this.authFormStep2.value.Laytime_date.year, this.authFormStep2.value.Laytime_date.month - 1, this.authFormStep2.value.Laytime_date.day)
    //   if (laytimeinput_obj.getHours() < 6) {
    //     layinput_obj.setDate(layinput_obj.getDate() - 1)
    //   }
    //   for (var i = layinput_obj; i < dateinput_obj; i.setDate(i.getDate() + 1)) {
    //     console.log(i.getMonth(), i.getDate(), i.getFullYear())
    //     var months = i.getMonth() + 1
    //     var datesend = i.getFullYear() + "-" + ('0' + months).slice(-2) + "-" + ('0' + i.getDate()).slice(-2)

    //     console.log("ashish")
    //     this.gettimeutilized(datesend, this.authFormStep2.value.Lay_time_commencement, layinputcheck_obj, i)
    //   }

    // }
   
    var laydate = this.authFormStep2.value.Laytime_date.year + "-" + ('0' + this.authFormStep2.value.Laytime_date.month).slice(-2) + "-" + ('0' + this.authFormStep2.value.Laytime_date.date).slice(-2)
    // console.log(this.delayinput[0][laycommencemntcheck])
    console.log(this.delayinput)
    var day = 60 * 60 * 24 * 1000;
    var date_final = new Date(datetimeinputcheck + " 00:00:00")
    var previous_datetime = new Date(datetimeinputcheck + " 00:00:00");
    var nextDate = new Date(date_final.getTime() + day);
    let mm: any = nextDate.getMonth() + 1
    if (nextDate.getMonth() < 9) {
      mm = "0" + mm
    }
    let dd: any = nextDate.getDate()
    if (nextDate.getDate() < 9) {
      dd = "0" + nextDate.getDate()
    }
    var nextDate_str = nextDate.getFullYear() + "-" + mm + "-" + dd;
    var date1 = new Date(datetimeinputcheck + " 06:00:00")
    if (laytimeinput_obj.getHours()<6){
      layinput_obj.setDate(layinput_obj.getDate() - 1)
      if (layinput_obj.getTime() == discharge_obj.getTime()) {
        var seconds = Number(date1.getTime() - laytimeinput_obj.getTime())
            if (seconds < 0) {
              seconds = seconds * (-1)
            }
            date_final.setTime(date_final.getTime() + seconds)
      }     
    }
    else{
      if (layinput_obj.getTime() == discharge_obj.getTime()) {
        var seconds = Number(date1.getTime() - laytimeinput_obj.getTime())
            if (seconds < 0) {
              seconds = seconds * (-1)
            }
            date_final.setTime(date_final.getTime() + seconds)
      } 
    }


    if (this.delaydatainput[datetimeinputcheck] != undefined) {
      var num = '0:0:0'
      var date1 = new Date(datetimeinputcheck + " 06:00:00")
      for (let i = 0; i < this.delaydatainput[datetimeinputcheck]['Difference'].length; i++) {
        var from_date = new Date(datetimeinputcheck + " " + this.delaydatainput[datetimeinputcheck]['From'][i] + ":00")
        var to_date = new Date(datetimeinputcheck + " " + this.delaydatainput[datetimeinputcheck]['To'][i] + ":00")
        if (from_date > date1) {
          var a = this.delaydatainput[datetimeinputcheck]['Difference'][i].split(':');
          var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
          date_final.setTime(date_final.getTime() + seconds * 1000)
        }
        else if (to_date > date1) {
          var seconds = 0
          seconds = Number(date1.getTime() - to_date.getTime())
          if (seconds < 0) {
            seconds = seconds * (-1)
          }
          date_final.setTime(date_final.getTime() + seconds)
        }
      }
      var nextDate = new Date(date_final.getTime() + day);
      date1 = new Date(date1.getTime() + day);
      let mm: any = nextDate.getMonth() + 1
      if (nextDate.getMonth() < 9) {
        mm = "0" + mm
      }
      let dd: any = nextDate.getDate()
      if (nextDate.getDate() < 9) {
        dd = "0" + nextDate.getDate()
      }

      var nextDate_str = nextDate.getFullYear() + "-" + mm + "-" + dd
      if (this.delaydatainput[nextDate_str] != undefined) {
        for (let i = 0; i < this.delaydatainput[nextDate_str]['Difference'].length; i++) {
          var from_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['From'][i] + ":00")
          var to_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['To'][i] + ":00")
          if (to_date <= date1) {
            var a = this.delaydatainput[nextDate_str]['Difference'][i].split(':');
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
            seconds = seconds * 1000
            date_final.setTime(date_final.getTime() + seconds)
          }
          else if (from_date <= date1) {
            var seconds = Number(date1.getTime() - from_date.getTime())
            if (seconds < 0) {
              seconds = seconds * (-1)
            }
            date_final.setTime(date_final.getTime() + seconds)
          }
        }
      }

    }
    else if (this.delaydatainput[nextDate_str] != undefined) {
      date1 = new Date(date1.getTime() + day);
      if (this.delaydatainput[nextDate_str] != undefined) {
        for (let i = 0; i < this.delaydatainput[nextDate_str]['Difference'].length; i++) {
          var from_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['From'][i] + ":00")
          var to_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['To'][i] + ":00")
          if (to_date <= date1) {
            var a = this.delaydatainput[nextDate_str]['Difference'][i].split(':');
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
            seconds = seconds * 1000
            date_final.setTime(date_final.getTime() + seconds)
          }
          else if (from_date <= date1) {
            var seconds = Number(date1.getTime() - from_date.getTime())
            if (seconds < 0) {
              seconds = seconds * (-1)
            }
            date_final.setTime(date_final.getTime() + seconds)
          }
        }
      }
    }
    var timevalue = date_final.getSeconds() + date_final.getMinutes() * 60 + date_final.getHours() * 3600
    if(date_final.getDay() > previous_datetime.getDay()){
      timevalue = day/1000
    }
    else{
      timevalue = date_final.getSeconds() + date_final.getMinutes() * 60 + date_final.getHours() * 3600
    }    
    day = day / 1000
    let final_day = day - timevalue;
    var final_days = Math.floor(final_day / (3600 * 24));
    final_day -= final_days * 3600 * 24;
    var final_hrs = Math.floor(final_day / 3600);
    final_day -= final_hrs * 3600;
    var final_mnts = Math.floor(final_day / 60);
    final_day -= final_mnts * 60;
    var final_output = final_days + ":" + final_hrs + ":" + final_mnts
    var formdata
    // if (dateinput_obj.getTime() == discharge_obj.getTime()) {
    //   formdata = {
    //     "total_bi_qty": Number(this.authForm.value.BL_quantity),
    //     "discharge_rate_value": 3500,
    //     "vessel_arrived": vessel_arrived,
    //     "nor_tendered": vessel_arrived,
    //     "laytime_commencement_discharge": laytime,
    //     "vessel_berthed": vessel_berthed,
    //     "discharge_commenced": discharge,
    //     "discharge_rate_price": this.authFormStep2.value.Discharge_rate,
    //     "demurrage_rate_price": this.authFormStep2.value.Demurrage_rate,
    //     "on_date_discharge": this.authFormStep2.value.ondatedischargevalue,
    //     "time_utilized_for_discharging": final_output == undefined ? '01:00:00' : final_output,
    //     "time_note_to_count": false,
    //     "datetime_input": datetimeinput,
    //     "vessel_info": this.id,
    //     "port_name": this.vesselDetails.DischargePortSuggested,
    //     "delay_time": this.delayinput
    //   }
    // }
    // else {
    formdata = {
      "total_bi_qty": Number(this.authForm.value.BL_quantity),
      "discharge_rate_value": 3500,
      "vessel_arrived": vessel_arrived,
      "nor_tendered": vessel_arrived,
      "laytime_commencement_discharge": laytime,
      "vessel_berthed": vessel_berthed,
      "discharge_commenced": discharge,
      "discharge_rate_price": this.authFormStep2.value.Discharge_rate,
      "demurrage_rate_price": this.authFormStep2.value.Demurrage_rate,
      "on_date_discharge": this.authFormStep2.value.ondatedischargevalue,
      "time_utilized_for_discharging": final_output == undefined ? '01:00:00' : final_output,
      "time_note_to_count": false,
      "datetime_input": datetimeinput,
      "vessel_info": this.id,
      "port_name": this.vesselDetails.DischargePortSuggested
    }
    // }

    //console.log(formdata)

    this.vedentaService.updatingdatacharting(formdata).then(data => {
      //console.log(data);
    })
  }


  gettimeutilized(datetimeinput, laytime, laytimeobj, checklaytime) {

    var datetimeinputcheck = datetimeinput
    console.log(laytime, datetimeinputcheck, this.delaydatainput, laytimeobj)
    var day = 60 * 60 * 24 * 1000;
    var date_final = new Date(datetimeinputcheck + " 00:00:00")
    var nextDate = new Date(date_final.getTime() + day);
    let mm: any = nextDate.getMonth() + 1
    if (nextDate.getMonth() < 9) {
      mm = "0" + mm
    }
    let dd: any = nextDate.getDate()
    if (nextDate.getDate() < 9) {
      dd = "0" + nextDate.getDate()
    }
    var nextDate_str = nextDate.getFullYear() + "-" + mm + "-" + dd;
    if (laytimeobj.getTime() == checklaytime.getTime()) {
      var date_final = new Date(datetimeinputcheck + " " + laytime)
      var date1 = new Date(datetimeinputcheck + " " + laytime)
    } else {
      var date1 = new Date(datetimeinputcheck + " 06:00:00")
    }
    if (this.delaydatainput[datetimeinputcheck] != undefined) {
      var num = '0:0:0'
      var date1 = new Date(datetimeinputcheck + " 06:00:00")
      for (let i = 0; i < this.delaydatainput[datetimeinputcheck]['Difference'].length; i++) {
        var from_date = new Date(datetimeinputcheck + " " + this.delaydatainput[datetimeinputcheck]['From'][i] + ":00")
        var to_date = new Date(datetimeinputcheck + " " + this.delaydatainput[datetimeinputcheck]['To'][i] + ":00")
        if (from_date > date1) {
          var a = this.delaydatainput[datetimeinputcheck]['Difference'][i].split(':');
          var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
          date_final.setTime(date_final.getTime() + seconds * 1000)
        }
        else if (to_date > date1) {
          var seconds = 0
          seconds = Number(date1.getTime() - to_date.getTime())
          if (seconds < 0) {
            seconds = seconds * (-1)
          }
          date_final.setTime(date_final.getTime() + seconds)
        }
      }
      var nextDate = new Date(date_final.getTime() + day);
      date1 = new Date(date1.getTime() + day);
      let mm: any = nextDate.getMonth() + 1
      if (nextDate.getMonth() < 9) {
        mm = "0" + mm
      }
      let dd: any = nextDate.getDate()
      if (nextDate.getDate() < 9) {
        dd = "0" + nextDate.getDate()
      }

      var nextDate_str = nextDate.getFullYear() + "-" + mm + "-" + dd
      if (this.delaydatainput[nextDate_str] != undefined) {
        for (let i = 0; i < this.delaydatainput[nextDate_str]['Difference'].length; i++) {
          var from_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['From'][i] + ":00")
          var to_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['To'][i] + ":00")
          if (to_date < date1) {
            var a = this.delaydatainput[nextDate_str]['Difference'][i].split(':');
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
            seconds = seconds * 1000
            date_final.setTime(date_final.getTime() + seconds)
          }
          else if (from_date < date1) {
            var seconds = Number(date1.getTime() - from_date.getTime())
            if (seconds < 0) {
              seconds = seconds * (-1)
            }
            date_final.setTime(date_final.getTime() + seconds)
          }
        }
      }

    }
    else if (this.delaydatainput[nextDate_str] != undefined) {
      date1 = new Date(date1.getTime() + day);
      if (this.delaydatainput[nextDate_str] != undefined) {
        for (let i = 0; i < this.delaydatainput[nextDate_str]['Difference'].length; i++) {
          var from_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['From'][i] + ":00")
          var to_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['To'][i] + ":00")
          if (to_date < date1) {
            var a = this.delaydatainput[nextDate_str]['Difference'][i].split(':');
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
            seconds = seconds * 1000
            date_final.setTime(date_final.getTime() + seconds)
          }
          else if (from_date < date1) {
            var seconds = Number(date1.getTime() - from_date.getTime())
            if (seconds < 0) {
              seconds = seconds * (-1)
            }
            date_final.setTime(date_final.getTime() + seconds)
          }
        }
      }
    }
    let timevalue = date_final.getSeconds() + date_final.getMinutes() * 60 + date_final.getHours() * 3600
    day = day / 1000
    let final_day = day - timevalue;
    var final_days = Math.floor(final_day / (3600 * 24));
    final_day -= final_days * 3600 * 24;
    var final_hrs = Math.floor(final_day / 3600);
    final_day -= final_hrs * 3600;
    var final_mnts = Math.floor(final_day / 60);
    final_day -= final_mnts * 60;
    var final_output = final_days + ":" + final_hrs + ":" + final_mnts
    console.log(final_output);
    this.delayinput[datetimeinput] = final_output;










    // var day = 60 * 60 * 24 * 1000;
    // console.log(datetimeinputcheck + laytime.split(':')[0] + laytime.split(':')[1])
    // console.log(datetimeinputcheck + " "+laytime)
    // console.log((datetimeinputcheck + " 00:00:00"))
    // // if(laytimeobj.getTime()==checklaytime.getTime()){
    // //   var date_final = new Date(datetimeinputcheck + " "+laytime)
    // // }else{
    // //   var date_final = new Date(datetimeinputcheck + " 00:00:00")
    // // }

    // var date_final = new Date(datetimeinputcheck + " 00:00:00")


    // if (this.delaydatainput[datetimeinputcheck] != undefined) {
    //   var num = '0:0:0'
    //   if(laytimeobj.getTime()==checklaytime.getTime()){
    //     var date_final = new Date(datetimeinputcheck + " "+laytime)
    //     var date1 = new Date(datetimeinputcheck + " "+laytime)
    //   }else{
    //     var date1 = new Date(datetimeinputcheck + " 06:00:00")
    //   }
    //   // var date1 = new Date(datetimeinputcheck + " 06:00:00")
    //   for (let i = 0; i < this.delaydatainput[datetimeinputcheck]['Difference'].length; i++) {
    //     var from_date = new Date(datetimeinputcheck + " " + this.delaydatainput[datetimeinputcheck]['From'][i] + ":00")
    //     var to_date = new Date(datetimeinputcheck + " " + this.delaydatainput[datetimeinputcheck]['To'][i] + ":00")
    //     if (from_date > date1) {
    //       var a = this.delaydatainput[datetimeinputcheck]['Difference'][i].split(':');
    //       var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
    //       date_final.setTime(date_final.getTime() + seconds * 1000)
    //     }
    //     else if (to_date > date1) {
    //       var seconds = 0
    //       seconds = Number(date1.getTime() - to_date.getTime())
    //       if (seconds < 0) {
    //         seconds = seconds * (-1)
    //       }
    //       date_final.setTime(date_final.getTime() + seconds)
    //     }
    //   }
    //   if(laytimeobj.getTime()==checklaytime.getTime()){
    //     var date_final1 = new Date(datetimeinputcheck + " 00:00:00")
    //     var nextDate = new Date(date_final1.getTime() + day);
    //   }else{
    //     var nextDate = new Date(date_final.getTime() + day);
    //   }

    //   date1 = new Date(date1.getTime() + day);
    //   let mm: any = nextDate.getMonth() + 1
    //   if (nextDate.getMonth() < 9) {
    //     mm = "0" + mm
    //   }
    //   let dd: any = nextDate.getDate()
    //   if (nextDate.getDate() < 9) {
    //     dd = "0" + nextDate.getDate()
    //   }

    //   var nextDate_str = nextDate.getFullYear() + "-" + mm + "-" + dd
    //   if (this.delaydatainput[nextDate_str] != undefined) {
    //     for (let i = 0; i < this.delaydatainput[nextDate_str]['Difference'].length; i++) {
    //       var from_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['From'][i] + ":00")
    //       var to_date = new Date(nextDate_str + " " + this.delaydatainput[nextDate_str]['To'][i] + ":00")
    //       if (to_date < date1) {
    //         var a = this.delaydatainput[nextDate_str]['Difference'][i].split(':');
    //         var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60
    //         seconds = seconds * 1000
    //         date_final.setTime(date_final.getTime() + seconds)
    //       }
    //       else if (from_date < date1) {
    //         var seconds = Number(date1.getTime() - from_date.getTime())
    //         if (seconds < 0) {
    //           seconds = seconds * (-1)
    //         }
    //         date_final.setTime(date_final.getTime() + seconds)
    //       }
    //     }
    //   }
    // }
    // let timevalue = date_final.getSeconds() + date_final.getMinutes() * 60 + date_final.getHours() * 3600
    // day = day / 1000
    // let final_day = day - timevalue;
    // var final_days = Math.floor(final_day / (3600 * 24));
    // final_day -= final_days * 3600 * 24;
    // var final_hrs = Math.floor(final_day / 3600);
    // final_day -= final_hrs * 3600;
    // var final_mnts = Math.floor(final_day / 60);
    // final_day -= final_mnts * 60;
    // var final_output = final_days + ":" + final_hrs + ":" + final_mnts
    // console.log(final_output);
    // this.delayinput[datetimeinput] = final_output;
  }

  savelpdata() {
    this.vedentaService.showLoader();
    let payload = { 'id': this.id, 'data': this.authForm.value, 'data2': this.authFormStep2.value }
    this.vedentaService.updateVesselInformation(payload).then((s: any) => {
      //console.log(s);
      localStorage.removeItem('Form1');
      localStorage.removeItem('Form2');
      localStorage.removeItem('Formwithid' + this.id);
      this.vedentaService.hideLoader();
    })
  }

  next() {
    this.formSubmit = true;
    console.log(this.authForm)
    if (this.authForm.valid) {
      this.step1 = false;
      this.step2 = true;
    }
    localStorage.setItem('Form1', JSON.stringify(this.authForm.value));

  }
  save() {
    localStorage.setItem('Formwithid' + this.id, JSON.stringify(this.authForm.value));
    alert("Data Saved")

  }
  Back() {
    this.step1 = true;
    this.step2 = false;
    localStorage.setItem('Form2', JSON.stringify(this.authFormStep2.value));
  }
  hssUpdate() {
    this.router.navigate(['/hss-update', this.id])
  }
  showBasicDetails() {
    this.modalService.open(this.content1, { windowClass: 'customsubmit_modal', centered: true });
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  charteringdetails() {
    localStorage.setItem('Form1', JSON.stringify(this.authForm.value));
    localStorage.setItem('Form2', JSON.stringify(this.authFormStep2.value));
    this.router.navigate(['/chartering-details', this.id])
  }
  UpdateDate() {
    // this.modalService.open(this.content3, { windowClass: 'customsubmit_modal', centered: true ,  size: 'lg'});
    const modalRef = this.modalService.open(this.content3, { windowClass: 'customsubmit_modal', centered: true, size: 'lg' });
  }

  add_delay_data() {
    //console.log("qwe")
    //console.log(this.DelayDataForm.value.Difference_time)
    if (this.DelayDataForm.value.Difference_time != undefined && this.DelayDataForm.value.Difference_time != '00:00') {
      var from: boolean = false
      var to: boolean = false
      var senddelaydata: boolean = false;
      this.date = this.DelayDataForm.value.Delay_date.year + "-" + ('0' + this.DelayDataForm.value.Delay_date.month).slice(-2) + "-" + ('0' + this.DelayDataForm.value.Delay_date.day).slice(-2)
      if (this.delaydatainput[this.date] != undefined) {
        //console.log(this.delaydatainput[this.date]['From'].length)
        for (let i = 0; i < this.delaydatainput[this.date]['From'].length; i++) {
          if (this.delaydatainput[this.date]['From'][i] == this.DelayDataForm.value.From_time) {
            from = true;
            break;
          }
          //console.log(this.delaydatainput[this.date]['From'][i])
        }
        for (let j = 0; j < this.delaydatainput[this.date]['To'].length; j++) {
          if (this.delaydatainput[this.date]['To'][j] == this.DelayDataForm.value.To_time) {
            to = true;
            break;
          }
          //console.log(this.delaydatainput[this.date]['To'][j])
        }
      }
      //console.log(from, to)
      if (this.delaydatainput[this.date] == undefined) {
        //console.log(this.delaydatainput)
        this.delaydatainput[this.date] = []
        this.delaydatainput[this.date]["From"] = []
        this.delaydatainput[this.date]["To"] = []
        this.delaydatainput[this.date]["Difference"] = []
        this.delaydatainput[this.date]["id"] = []
        this.delaydatainput[this.date]["From"].push(this.DelayDataForm.value.From_time)
        this.delaydatainput[this.date]["To"].push(this.DelayDataForm.value.To_time)
        this.delaydatainput[this.date]["Difference"].push(this.DelayDataForm.value.Difference_time)
        senddelaydata = true;

      } else {
        //console.log(this.delaydatainput)
        if (from == false || to == false) {
          this.delaydatainput[this.date]["From"].push(this.DelayDataForm.value.From_time)
          this.delaydatainput[this.date]["To"].push(this.DelayDataForm.value.To_time)
          this.delaydatainput[this.date]["Difference"].push(this.DelayDataForm.value.Difference_time)
          senddelaydata = true
        } else {
          //console.log("checked")
        }

      }
      var idadd: any
      this.datestoshow = Object.keys(this.delaydatainput)
      //console.log(this.delaydatainput)

      if (senddelaydata == true) {
        var formdata = {
          'startdate': this.date,
          'in_time': this.DelayDataForm.value.From_time,
          'out_time': this.DelayDataForm.value.To_time,
          'time_difference': this.DelayDataForm.value.Difference_time,
          'vessel_info': this.id
        }
        this.vedentaService.showLoader()
        this.vedentaService.updatingdelaydata(formdata).then(data => {
          //console.log(data);
          this.vedentaService.hideLoader()
          idadd = data['success']['data']['id']
          //console.log(idadd)
          this.delaydatainput[this.date]['id'].push(idadd)
          this.modalService.dismissAll();
        })
      } else {
        alert("Already Added")
      }
    } else {
      alert("There Should Be A Difference")
    }


  }

  chartingdata() {
    var formdata = { 'vessel_info': this.id }
    //console.log(formdata)
    this.vedentaService.getchartingdelaydata(formdata).then(data => {
      this.delaydatainput = data['data']
      //console.log(data['data'])
      this.datestoshow = Object.keys(this.delaydatainput)
      //console.log(this.delaydatainput)
    })
  }

  diff() {
    //console.log(this.DelayDataForm.value)
    //console.log(this.DelayDataForm.value.From_time, this.DelayDataForm.value.To_time)
    var start = this.DelayDataForm.value.From_time;
    var end = this.DelayDataForm.value.To_time
    if (this.DelayDataForm.value.To_time != '' && this.DelayDataForm.value.From_time != '') {
      start = start.split(":");
      end = end.split(":");
      var startDate = new Date(0, 0, 0, start[0], start[1], 0);
      var endDate = new Date(0, 0, 0, end[0], end[1], 0);
      var diff = endDate.getTime() - startDate.getTime();
      var hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      var minutes = Math.floor(diff / 1000 / 60);

      // If using time pickers with 24 hours format, add the below line get exact hours
      if (hours < 0)
        hours = hours + 24;
      //console.log((hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes)
      this.differencetime = (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }

  }
}
