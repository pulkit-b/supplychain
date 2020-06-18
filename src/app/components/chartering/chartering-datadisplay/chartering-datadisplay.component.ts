import { Component, OnInit } from '@angular/core';
import { VedantaService } from 'src/app/services/vedanta.service';
import { Charteringdetails } from '../../../models/charteringdetails';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chartering-datadisplay',
  templateUrl: './chartering-datadisplay.component.html',
  styleUrls: ['./chartering-datadisplay.component.css']
})
export class CharteringDatadisplayComponent implements OnInit {
  public id;
  public charteringDataDetails: any = [];
  public header: any;
  public open = true;
  constructor(
    public vedentaService: VedantaService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
    this.getCharteringDetails();
  }
  toggleSidenav() {
    this.open = !this.open;
  }
  getCharteringDetails() {
    this.vedentaService.showLoader();
    const payload = { id: this.id };
    this.vedentaService.getCharteringDetails(payload).then((s: any) => {
      // this.charteringDetails = s.success;
      //console.log(s.success.data.length!=0)
      if(s.success.data.length!=0){
        const d = Charteringdetails.getRequestData(s.success.data);
        this.charteringDataDetails = d.data;
        this.header = d.header;
      }else{
        alert("No data to display. Please go back and insert data first")
      }      
      this.vedentaService.hideLoader()
      //console.log(this.charteringDataDetails);
    });
  }
  backTopage() {
    this.router.navigate(['/chartering', this.id]);
  }
}
