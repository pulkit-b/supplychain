import { Component, OnInit } from '@angular/core';
import { VedantaService } from 'src/app/services/vedanta.service';
import { NgxPowerBiService } from "ngx-powerbi";
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-inboundlogs',
  templateUrl: './inboundlogs.component.html',
  styleUrls: ['./inboundlogs.component.css']
})
export class InboundlogsComponent implements OnInit {
  private pbiContainerElement: HTMLElement;
  public windowHeight:any;
  public open;
  constructor(public vedentaService: VedantaService, private powerBiService: NgxPowerBiService) {
  }
  ngOnInit() {
    this.windowHeight = ($(window).height()-112)+'px';
    let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
    var sendpayload
    if (userlocation.UserLocation.toLowerCase() == 'balco') {
      sendpayload = {
        "reportId": environment.balco_inbound_reportId
      }
    }
    else{
      sendpayload = {
        "reportId": environment.jsg_inbound_reportId
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
      var client = window['powerbi-client'];
     
      let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0] 
      if (userlocation.UserLocation.toLowerCase() == 'balco') {
        //console.log("----")
          config  = {
            type: "report",
            id: environment.balco_inbound_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.balco_inbound_reportId+"" +
            "&groupId="+environment.balco_inbound_groupId+"",
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
            id: environment.jsg_inbound_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.jsg_inbound_reportId+"" +
            "&groupId="+environment.jsg_planing_groupId+"",
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

  // toggleSidenav() {
  //   this.open = !this.open;
  // }

  // getprefernce() {
  //   //console.log(this.userpreferencevalue);
  //   if (this.userpreferencevalue == 'Quaterly') {
  //     this.yearshow = true;
  //     this.quatershow = true;
  //     this.monthshow = false;
  //   } else if (this.userpreferencevalue == 'Monthly') {
  //     this.yearshow = true;
  //     this.monthshow = true;
  //     this.quatershow = false;
  //   } else {
  //     this.yearshow = true;
  //     this.monthshow = false;
  //     this.quatershow = false;
  //   }
  // }

  // getdata() {
  //   this.vedentaService.showLoader();
  //   //console.log(
  //     this.userpreferencevalue,
  //     this.monthvalue,
  //     this.yearsvalue,
  //     this.quatersvalue
  //   );
  //   let payload = {};
  //   if (this.userpreferencevalue == 'Quaterly') {
  //     payload = {
  //       'Q/M/Y': this.quatersvalue + '-' + this.yearsvalue
  //     };
  //   } else if (this.userpreferencevalue == 'Monthly') {
  //     payload = {
  //       'Q/M/Y': this.monthvalue + '-' + this.yearsvalue
  //     };
  //   } else {
  //     payload = {
  //       'Q/M/Y': String(this.yearsvalue)
  //     };
  //   }

  //   //console.log(payload);

  //   this.vedentaService.inbounddata(payload).then(data => {
  //     //console.log(data);
  //     this.inbounddata = data['success'];
  //     this.vedentaService.hideLoader();
  //   });
  // }
}
