import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VedantaService } from '../../../services/vedanta.service';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { PortActivitiesComponent } from '../../port-activities/port-activities/port-activities.component';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-vessel-management-portal',
  templateUrl: './vessel-management-portal.component.html',
  styleUrls: ['./vessel-management-portal.component.css']
})
export class VesselManagementPortalComponent implements OnInit {
  authForm: FormGroup;
  authForm2: FormGroup;
  public open = true;
  public id;
  public vesselDetails: any = '';
  closeResult: string;
  public portdetails: any;
  public modalOpen;
  public NewArrivalDate: NgbDateStruct;
  public deltaFreight;
  public deltaFreightparadip;
  public minDate;
  public suggestedDemrragePort;
  public addmoredata = [0]
  public totaldemmurage: any
  public demurragetime: any
  public suggestedDropValue: any = [
    { source: 'KSPL' },
    { source: 'GPL' },
    { source: 'PARADIP' }
  ];
  public disableadd = false

  public deltafreightdropdown: any = [];
  @ViewChild('content2') content2: ElementRef;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public vedentaService: VedantaService,
    private modalService: NgbModal
  ) {
    this.authForm = this.fb.group({
      dischargePortSuggested: ['', Validators.required],
      potentialDemurrage: ['', Validators.required],
      tradeOffReason: ['', Validators.required]
    });
    this.authForm2 = this.fb.group({
      items: this.fb.array([this.createItem()])
    });

  }


  createItem(): FormGroup {
    return this.fb.group({
      NewArrivalDate: ['', Validators.required],
      deltaFreight: ['', Validators.required],
      deltaFreightparadip: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
    this.distinctportdata()

  }

  toggleSidenav() {
    this.open = !this.open;
  }


  distinctportdata() {
    this.vedentaService.showLoader()
    this.vedentaService.distinctport()
      .then((s: any) => {
        //console.log(s)
        this.deltafreightdropdown = ['JNPT' , 'LONI']
        this.getVesselDetails();
      });
  }

  getVesselDetails() {
    const payload = { id: this.id };
    var date = new Date();
    this.vedentaService.showLoader();
    this.vedentaService.getdemurragetime(payload).then((dem: any) => {
      this.demurragetime = dem.data[0]
      this.vedentaService.getVesselInformationById(payload).then((s: any) => {
        this.vesselDetails = JSON.parse(JSON.stringify(s.success.data[0]).replace(/Kwinana/g , 'Jebel Ali').replace(/Go Dau/g , 'Port Klang').replace(/Gladstone/g , 'Los Angeles').replace(/Worsley/g , 'Laem Chabang').replace(/Bunbury/g , 'Algeciras').replace(/Kendawangan/g , 'Jeddah').replace(/GPL/g , 'Chennai').replace(/KSPL/g , 'Mormugao').replace(/BALCO/g , 'Plant3')) ;
        // console.log(this.demurragetime)
        var demurragedata = this.demurragetime.demurrage_time
        // console.log(demurragedata)
        if(demurragedata ==null){
          this.totaldemmurage = Number(this.vesselDetails.Demurrage_LP)
        }else{
          this.totaldemmurage = Number(this.vesselDetails.Demurrage_LP) + Number(this.vesselDetails.Demurrage_DP*demurragedata)
        }
        // console.log(this.totaldemmurage)
        const newDate = new Date();
        this.minDate = {
          year: Number(newDate.getFullYear()),
          month: Number(newDate.getMonth() + 1),
          day: Number(newDate.getDate())
        };
        if (this.vesselDetails.ETA != null) {
          const etadate = this.vesselDetails.ETA.split('-');
          this.minDate = {
            year: Number(etadate[0]),
            month: Number(etadate[1]),
            day: Number(etadate[2])
          };
        }
        this.authForm.patchValue({
          dischargePortSuggested: '',
          potentialDemurrage: '',
          tradeOffReason: ''
        });
        this.getportdetails();
      })
    });
  }
  editchartering(id) {
    // localStorage.setItem('authForm', JSON.stringify(this.authForm));
    this.router.navigate(['/chartering', id]);
  }

  getportdetails() {
    const payload = { id: this.id };
    this.vedentaService.getportactivities(payload).then((s: any) => {
      this.portdetails = s.success[0];
      //console.log('by id vessel Data', this.portdetails);
      this.vedentaService.hideLoader();
    });
  }

  openModel(content) {
    this.modalOpen = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg'
    });
  }

  openportactivities(content) {
    //console.log(content);
    this.modalOpen = this.modalService.open(PortActivitiesComponent, {
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg'
    });
    this.modalOpen.componentInstance.portdata = this.portdetails;
    // this.modalOpen = this.modalService.open(content, { centered: true , ariaLabelledBy: 'modal-basic-title',backdrop: 'static',size: 'lg' });
  }

  private getDismissReason(reason: any) {
    //console.log('abcd');
    this.modalOpen.close();
  }
  submitData() {
    //console.log(this.authForm);
    if (this.authForm.valid) {
      //console.log(this.authForm.value);
      this.vedentaService.showLoader();
      // console.log(this.authForm2.value.items[0].NewArrivalDate)
      var data = this.authForm.value
      data['date'] = this.authForm2.value.items[0].NewArrivalDate
      // console.log(data)
      const payload = { id: this.id, data: data };
      this.vedentaService
        .updateVesselInformationByVessel2(payload)
        .then((s: any) => {
          this.vedentaService.hideLoader();
          this.modalService.open(this.content2, {
            windowClass: 'customsubmit_modal',
            centered: true
          });
        });
    }
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  get items(): FormArray {
    return this.authForm2.get('items') as FormArray;
  }

  Addmoreport() {
    //console.log("added")
    //console.log(this.authForm2);
    if (this.addmoredata.length >= this.deltafreightdropdown.length) {
      this.disableadd = true
    } else {
      this.disableadd = false
      this.addmoredata.push(this.addmoredata.length)
      this.items.insert(
        this.addmoredata.length,
        this.createItem()
      );
    }

  }

  deleteRow(index) {
    this.addmoredata.splice(index, 1);
    this.disableadd = false
    this.items.removeAt(index);
  }

  portchangedata(e) {
    //console.log(e)
    //console.log(this.authForm2.value.items[e].deltaFreight)
    // //console.log(this.deltafreightdropdown.indexof(this.authForm2.value.items[e].deltaFreight))
  }
  checkCharteringDate() {
    //console.log(this.authForm2);
    //console.log(this.authForm2.status)
    if (this.authForm2.status == "INVALID") {
      alert("Enter All Values To Check")
    } else {
      this.vedentaService.showLoader();
      const newArrivalDate =
        this.authForm2.value.items[0].NewArrivalDate.year +
        '-' +
        this.authForm2.value.items[0].NewArrivalDate.month +
        '-' +
        this.authForm2.value.items[0].NewArrivalDate.day;

      const portdata = {}

      this.authForm2.value.items.forEach(element => {
        //console.log(element)
        var key = element.deltaFreight
        portdata[key] = Number(element.deltaFreightparadip)
      });


      const payload = {
        vessel_id: this.vesselDetails.VesselConfirmationID,
        vessel_name: this.vesselDetails.VesselName,
        previous_arrival_date: this.vesselDetails.ArrivalDate,
        quantity: this.vesselDetails.Quantity,
        new_arrival_date: newArrivalDate,
        // gpl_delta_value: this.authForm2.value.deltaFreight,
        // paradip_delta_value: this.authForm2.value.deltaFreightparadip,
        paradip_delta_value: "7",
        gpl_delta_value: portdata
      };
      //console.log(payload)
      this.vedentaService.chartering_tradeoff_new(payload).then((s: any) => {
        document.getElementById("dischargePortSuggested").removeAttribute("disabled");
        const d = (s.success);
        const dda = d.data;
        //console.log(dda)
        this.suggestedDemrragePort = dda.dispatch_port_suggested;
        this.authForm.patchValue({
          dischargePortSuggested: dda.dispatch_port_suggested,
          potentialDemurrage: dda.demurrage,
          tradeOffReason: dda.tradeoff
        });
        this.vedentaService.hideLoader();
        // this.authForm.patchValue({ 'dischargePortSuggested': d.DischargePortSuggested, 'potentialDemurrage': this.vesselDetails.PotentialDemurrage, 'tradeOffReason': this.vesselDetails.TradeOffReason })
      });
    }
    // var authform2undefined = this.authForm2.value.NewArrivalDate == undefined || this.authForm2.value.deltaFreight == undefined || this.authForm2.value.deltaFreightparadip == undefined
    // var authform2null = this.authForm2.value.NewArrivalDate == null || this.authForm2.value.deltaFreight == null || this.authForm2.value.deltaFreightparadip == null
    // //console.log(authform2null, authform2undefined)
    // if (authform2undefined && authform2null) {
    //   //console.log("error")
    //   if (this.authForm2.value.NewArrivalDate == undefined && this.authForm2.value.NewArrivalDate == null) {
    //     document.getElementById("NewArrivalDateForm").classList.add("error");
    //   } else if (this.authForm2.value.deltaFreight == undefined && this.authForm2.value.deltaFreight == null) {
    //     document.getElementById("deltaFreight").classList.add("error");
    //     document.getElementById("NewArrivalDateForm").classList.remove("error");

    //   } else {
    //     document.getElementById("deltaFreightparadip").classList.add("error");
    //     document.getElementById("NewArrivalDateForm").classList.remove("error");
    //     document.getElementById("deltaFreight").classList.remove("error");

    //   }
    // } else {
    //   document.getElementById("deltaFreightparadip").classList.remove("error");
    //   document.getElementById("NewArrivalDateForm").classList.remove("error");
    //   document.getElementById("deltaFreight").classList.remove("error");
    //   const newArrivalDate =
    //     this.authForm2.value.NewArrivalDate.year +
    //     '-' +
    //     this.authForm2.value.NewArrivalDate.month +
    //     '-' +
    //     this.authForm2.value.NewArrivalDate.day;
    //   const payload = {
    //     vessel_id: this.vesselDetails.VesselConfirmationID,
    //     vessel_name: this.vesselDetails.VesselName,
    //     previous_arrival_date: this.vesselDetails.ArrivalDate,
    //     quantity: this.vesselDetails.Quantity,
    //     new_arrival_date: newArrivalDate,
    //     gpl_delta_value: this.authForm2.value.deltaFreight,
    //     paradip_delta_value: this.authForm2.value.deltaFreightparadip
    //   };
    // this.vedentaService.showLoader();

    // this.vedentaService.chartering_tradeoff(payload).then((s: any) => {
    //   document.getElementById("dischargePortSuggested").removeAttribute("disabled");
    //   const d = JSON.parse(s.success);
    //   const dda = d.data;
    //   //console.log(dda)
    //   this.suggestedDemrragePort=dda.dispatch_port_suggested;
    //   this.authForm.patchValue({
    //     dischargePortSuggested: dda.dispatch_port_suggested,
    //     potentialDemurrage: dda.demurrage,
    //     tradeOffReason: dda.tradeoff
    //   });
    //   this.vedentaService.hideLoader();
    //   // this.authForm.patchValue({ 'dischargePortSuggested': d.DischargePortSuggested, 'potentialDemurrage': this.vesselDetails.PotentialDemurrage, 'tradeOffReason': this.vesselDetails.TradeOffReason })
    // });
    // }


    // previous_arrival_date = eta

    //  "vessel_id":15, "vessel_name":"densa", "previous_arrival_date":"2019-6-15", "quantity":30, "new_arrival_date":"2019-6-28", "gpl_delta_value":3
  }
}
