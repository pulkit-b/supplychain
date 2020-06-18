import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VedantaService } from 'src/app/services/vedanta.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-basicvesseldetails',
  templateUrl: './basicvesseldetails.component.html',
  styleUrls: ['./basicvesseldetails.component.css']
})
export class BasicvesseldetailsComponent implements OnInit, OnChanges {
  @Input() idVal;
  @Input() dataVal;
  public data: any;
  public plantInfo: any;
  public totalQuantity = 0;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public vedentaService: VedantaService
  ) {}

  ngOnInit() {
    // let payload = { id: this.idVal }
    // this.vedentaService.showLoader()
    // this.vedentaService.getVesselDetails(payload).then((s: any) => {
    //   this.data = s.success.data[0]
    //   this.totalQuantity = this.data.Quantity;
    //   this.plantInfo = s.success.plant;
    //   this.vedentaService.hideLoader()
    // })
  }

  ngOnChanges() {
    this.data = this.dataVal;
    //console.log(this.data);
  }
}
