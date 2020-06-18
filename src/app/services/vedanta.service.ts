import { Injectable, ViewChild } from '@angular/core';
// import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { map, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../app.component';
// import { resolve } from 'dns';
// import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class VedantaService {
  public url: any = environment.url;
  public url_pt: any = environment.url_pt;
  public url2: any = environment.url2;

  public childKey = [
    'total_alumina_req',
    'alumina_req_P1',
    'alumina_req_P2',
    'total_lanjigarh_supply',
    'alumina_lanjigarh_supply_p1',
    'alumina_lanjigarh_supply_p2',
    'year'
  ];
  public Month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  public date: any = new Date();
  public currentMonth = this.date.getMonth() + 1;
  public currentYear = this.date.getFullYear();
  public Year = [this.date.getFullYear()-1 ,this.date.getFullYear(), this.date.getFullYear() + 1];
  public options;
  public procservice: any;
  public header = { headers: new HttpHeaders({ timeout: '001' }) };
  public timeoutHttp: any = 90000;
  constructor(public _http: HttpClient, public modalService: NgbModal) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer dapi67afa03294ef2eedee8940ae5608ac73'
      })
    };
  }

  getPlanningData(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'getplanningdata/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  getDispatchSchedularResults(formData) {
    // const originalUrl = this.url + 'dispatchScheduler/getdispatchschedular/';
    const originalUrl = this.url + 'dispatchScheduler/getInitialData/';
    const newUrl = 'http://40.117.122.150:5000/api/v1/dispatch_schedular_data';
    return new Promise((resolve, reject) => {
      this._http
        .post(originalUrl, formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getDispatchSchedularResultsLanding(formData) {
    const originalUrl =
      this.url + 'dispatchScheduler/getdispatchschedularlandingdata/';
    const newUrl = 'http://40.117.122.150:5000/api/v1/dispatch_schedular_data';
    return new Promise((resolve, reject) => {
      this._http.post(originalUrl, formData).subscribe(s => {
        resolve(s);
      });
    });
  }

  postPlanningData(formData) {
    formData.username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'updateplanningdata/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getPlanningResult(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'getPlanningResultsData/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  handleError() { }
  getTextType(k, i) {
    let a = '';
    switch (k) {
      case 'Quarter1':
      case 'Quarter2':
      case 'Quarter3':
      case 'Quarter4':
        a = 'readonly=readonly';
        switch (this.childKey[i]) {
          case 'total_alumina_req':
          case 'total_lanjigarh_supply':
            a = 'readonly=readonly';
            break;
          default:
            break;
        }
        break;
      default:
        a = '';
        switch (this.childKey[i]) {
          case 'total_alumina_req':
          case 'total_lanjigarh_supply':
            a = 'readonly=readonly';
            break;
          default:
            break;
        }

        break;
    }

    return a;
  }

  getCalendarDataValues(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'getcalendardata/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  getCalendarData(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'posttothirdpartySuggestionData/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getCheckData(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'getcheckdata/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  submitData(formData) {
    formData.username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'submitdata/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  getVesselPortal(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/getVesselPortal/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  showErrorModel() {
    //  $('#myModal').css('display', 'block');
    //  $('#myModal').modal({show:true});
    //  let a =  new AppComponent();
    // a.open();
    this.open();
  }
  getVesselPortalDetails(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(
          this.url + 'vesselmanagement/getVesselPortalDetails/',
          formData,
          this.header
        )
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  getVesselDetails(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/getHSSDetails/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  updateHSSDataa(formData) {
    formData[0].username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/submitHssDetails/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getportactivities(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/getPortActivity/', formData)

        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  showLoader() {
    $('#loader').css('display', 'block');
  }
  hideLoader() {
    $('#loader').css('display', 'none');
  }
  getVesselInformationById(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/getVesselInformationById/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getPortsData() {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/getPortsData/', {})
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getApiStatus() {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'getRunningStatus/', {})
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  apiCall() {
    //   this._http.post(
    //     "https://eastus.azuredatabricks.net/api/2.0/jobs/run-now",
    //     JSON.stringify({"job_id": 6}),
    //     this.options
    // ).pipe(timeout(this.timeoutHttp)).subscribe();
  }
  updateVesselInformation(formData) {
    formData.username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/updateVesselInformation/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  submitDocument(formData) {
    formData.username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/uploadDocument/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  saveFiles(total_form) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });

    const options = {
      headers: httpHeaders
    };
    total_form.username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/uploadDocument/', total_form)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(s => {
          resolve(s);
        });
    });
  }
  getChartsData(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(
          this.url + 'vesselmanagement/getcharteringGraph/',
          formData,
          this.header
        )
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  updateVesselInformationByVessel2(formData) {
    formData.username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(
          this.url + 'vesselmanagement/updateVesselInformationByVessel2/',
          formData
        )
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  getCharteringDetails(payload) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/charteringdata/', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getdemurragetime(payload) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/getdemurragetime/', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getchartingdelaydata(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url2 + 'chartering_data_out_time_get_data', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  updatingdelaydata(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(
          this.url + 'vesselmanagement/chartering_data_out_time_insert/',
          formData
        )
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getDispatcherFirstEdit(payload) {
    payload.username = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'dispatchScheduler/getDispatcherFirstEdit/', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  submitDispatcher(payload) {
    payload.user_name = localStorage.getItem('userEmail')
      ? localStorage.getItem('userEmail')
      : '';
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'dispatchScheduler/dispatchSchedulerLanding/', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  updatingdatacharting(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(
          this.url + 'vesselmanagement/chartering_data_calculate/',
          formData
        )
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  inbounddashboarddata() {
    return new Promise((resolve, reject) => {
      this._http
        .get(this.url + 'inbounddesktop/location_latest_record')
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getDocumentList(payload) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/getdocumentlist/', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  inbounddashboarddata2(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'inbounddesktop/Inbound', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }
  downloadFile(url) {
    this._http
      .post(this.url + 'vesselmanagement/files/', { responseType: 'blob' })
      .pipe(timeout(this.timeoutHttp))
      .subscribe((res: any) => {
        // //console.log(res.success);
        //   var url = window.URL.createObjectURL(res);
        //  var a = document.createElement('a');
        //  document.body.appendChild(a);
        //  a.setAttribute('style', 'display: none');
        // a.href = url;
        // a.download = "ad.xls";
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove(); // remove the element
        const url = res.success.split('routes/');
        const b = url[1].split('upload/');
        const bv = url[0] + 'upload/' + b[1];
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = bv;
        a.click();
      });
  }

  inboundcalenderdata(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'inbounddesktop/calender', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getDelayReasons() {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vtapDelayreason/', {})
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getLastMonthLastDay(payload) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'dispatchScheduler/getlastmonthlastday', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getBulker(payload) {
    return new Promise((resolve, reject) => {
      this._http.post(this.url + 'dispatchScheduler/getBulker', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          }, error => {
            this.open();
          }
        );
    });
  }

  inbounddata(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'inbounddesktop/Inbound2', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  inboundbulker(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'inbounddesktop/getinboundstatus', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  deletedatacharting(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(
          this.url + 'vesselmanagement/deletecharteringtimenottofund',
          formData
        )
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getIndividualDispatchData(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'dispatchScheduler/dispatch_data/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            // console.log(s);
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getPlantSupplyStatus(payload) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'dispatchScheduler/getPlantSupplyStatus', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getBtapSupply() {
    return new Promise((resolve, reject) => {
      this._http
        .get(this.url + 'dispatchScheduler/getBtapSupply')
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getPlantUpdateStatus(payload) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'dispatchScheduler/getPlantUpdateStatus', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  chartering_tradeoff(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/chartering_tradeoff', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  chartering_tradeoff_new(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/chartering_tradeoff_new', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  distinctport() {
    return new Promise((resolve, reject) => {
      this._http
        .get(this.url + 'vesselmanagement/distinctportdata')
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  getHoldStatus(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'dispatchScheduler/getHoldStatus', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  open() {
    this.hideLoader();
    //  const modalRef = this.modalService.open('Hello');
    //   modalRef.componentInstance.title = 'About';
    const a =
      '<ngb-modal-backdrop style="z-index: 1050" class="modal-backdrop fade show"></ngb-modal-backdrop><div class="modal fade show d-block"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"> <h4 class="modal-title">Error</h4> <button type="button" class="close" aria-label="Close" onclick="close()"><span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body">    There was an error. Please reload again. </div> </div></div></div>';
    $('body').append(a);
    $('.close').on('click', function () {
      $('.modal-backdrop').remove();
      $('.modal').remove();
    });
  }

  getUserLoginDetails() {
    // console.log('======');
    return new Promise((resolve, reject) => {
      $.get('https://vedantaweb.azurewebsites.net/' + '.auth/me', function (
        data
      ) {
        // labeler = data[0]['user_id'];

        // window.alert("You logged in as " + data[0]['user_id']);
        resolve(data[0]['user_id']);
      });
    });
  }

  getUserDetails(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'getuserdetails', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  // getAzureToken() {
  //   return new Promise((resolve, reject) => {
  //     const formData = {};
  //     this._http
  //       .post(this.url + 'getADLoginDetails', formData)
  //       .pipe(timeout(this.timeoutHttp))
  //       .subscribe(
  //         s => {
  //           resolve(s);
  //         },
  //         error => {
  //           this.open();
  //         }
  //       );
  //   });
  // }

  getAzureToken(payload) {
    return new Promise((resolve, reject) => {
      const formData = {};
      this._http
        .post(this.url + 'pbitoken/getToken', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }


  updatePlanningResult(formData) {
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'updateplanningdataPB/', formData)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

  updateVessName(payload){
    return new Promise((resolve, reject) => {
      this._http
        .post(this.url + 'vesselmanagement/updateVessName', payload)
        .pipe(timeout(this.timeoutHttp))
        .subscribe(
          s => {
            resolve(s);
          },
          error => {
            this.open();
          }
        );
    });
  }

}
