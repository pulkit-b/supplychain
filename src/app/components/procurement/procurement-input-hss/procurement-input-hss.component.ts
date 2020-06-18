import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VedantaService } from 'src/app/services/vedanta.service';

import * as $ from 'jquery';
@Component({
  selector: 'app-procurement-input-hss',
  templateUrl: './procurement-input-hss.component.html',
  styleUrls: ['./procurement-input-hss.component.css']
})
export class ProcurementInputHssComponent implements OnInit {
  public open = true;
  public inputdat: any = ['from', 'to', 'quantity'];
  public id;
  public addMoreData: any = [this.inputdat];
  public plantInfo: any;
  public totalQuantity = 0;
  public data: any;
  public countadd: number = 1;
  public disableadd: boolean = false;
  public disablesubmit: boolean = false;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public vedentaService: VedantaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.getVesselDetails();
    });
  }
  toggleSidenav() {
    this.open = !this.open;
  }
  addMore() {
    let totalQty = 0;
    let hasQtyOrNot = 0;
    //console.log(this.plantInfo)

    if (this.plantInfo.length == 0) {
      alert('No Plant To Select');
      this.disableadd = true
      this.disablesubmit = true
    } else {
      $('input[name=\'quantity\']').each(function (e, v) {
        if ($(this).val() == '') {
          hasQtyOrNot = 1;
        }
        totalQty += Number($(this).val());
      });
      if (hasQtyOrNot == 1) {
        alert('Please enter quantity');
        return;
      }
      //console.log(totalQty, this.totalQuantity);
      if (totalQty < this.totalQuantity) {
        this.addMoreData.push(this.inputdat);
        this.countadd++
        if (this.plantInfo.length == this.countadd) {
          this.disableadd = true
        }
      } else {
        alert('Entered quantity cannot exceed from the vessel quantity.');
      }

    }

  }
  deleteRow(index) {
    this.addMoreData.splice(index, 1);
    this.countadd--;
    this.disableadd = false
  }

  getVesselDetails() {
    const payload = { id: this.id };
    this.vedentaService.showLoader();

    this.vedentaService.getVesselDetails(payload).then((s: any) => {
      this.data = s.success.data;
      this.totalQuantity = this.data[0].Quantity;
      this.plantInfo = s.success.plant;
      //console.log(this.data)
      if (this.plantInfo.length == 0) {
        this.disablesubmit = true
        this.disableadd = true
      }
      if (this.plantInfo.length == 1) {
        this.disableadd = true
      }
      this.vedentaService.hideLoader();
    });
  }

  submitHss() {
    let totalQty = 0;
    const mainResult = {
      DischargePortSuggested: this.data[0].DischargePortSuggested,
      LoadPort: this.data[0].LoadPort,
      VesselConfirmationID: this.id,
      VesselName: this.data[0].VesselName,
      quantity: this.data[0].Quantity == '' ? 0 : this.data[0].Quantity,
      to: this.data[0].Plant
    };
    const dataForSubmit = [];
    // this.vedentaService.showLoader();
    const hasQtyOrNot = 0;
    $('.inputform-group').each(function (e, v) {
      const db = {};
      $(this)
        .find('input, select')
        .each(function (e, v) {
          if ($(this).attr('name') == 'quantity') {
            totalQty += Number($(this).val());
          }
          db[$(this).attr('name')] = $(this).val();
        });
      if (db['quantity'] == '') {
        db['quantity'] = 0;
      }
      dataForSubmit.push(db);
    });
    var check: boolean = false
    for (let i = 0; i < dataForSubmit.length; i++) {
      if (dataForSubmit[i].quantity == 0 && dataForSubmit[i].quantity == '') {
        check = true;
        break;
      } else if (dataForSubmit[i].to == 'Select' && dataForSubmit[i].to == '') {
        check = true;
        break;
      }
      else {
        check = false;
      }
    }
    //console.log(check)
    if (check == true) {
      alert("Enter all data")
    } else {
      this.vedentaService.showLoader();
      if (totalQty >= this.totalQuantity) {
        this.vedentaService.hideLoader();
        alert('Entered quantity cannot exceed from the vessel quantity.');
      } else {
        mainResult.quantity = this.totalQuantity - totalQty;
        dataForSubmit.push(mainResult);
        const dbfordata = [{ id: this.id, result: dataForSubmit }];
        //console.log(dbfordata);
        //console.log(dataForSubmit)
        this.vedentaService.updateHSSDataa(dbfordata).then((s: any) => {
          this.vedentaService.hideLoader();
          this.router.navigate(['/vessel-portal']);
        });
      }
    }
  }


}
