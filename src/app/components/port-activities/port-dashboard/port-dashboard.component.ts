import { Component, OnInit } from '@angular/core';
import { NgxPowerBiService } from "ngx-powerbi";
import { VedantaService } from 'src/app/services/vedanta.service';
import { environment } from '../../../../environments/environment';
import * as $ from 'jquery';
@Component({
  selector: 'app-port-dashboard',
  templateUrl: './port-dashboard.component.html',
  styleUrls: ['./port-dashboard.component.css']
})
export class PortDashboardComponent implements OnInit {
  private pbiContainerElement: HTMLElement;
  public windowHeight:any;
  public open;
  constructor(public vedentaService: VedantaService,private powerBiService: NgxPowerBiService) {
    // this.vedentaService.getAzureToken().then((s: any) => {
    //   const d = JSON.parse(s.token);
    //   localStorage.setItem('tokenAD', d.access_token);
    //   // window.location.reload();
    // });
   }

  ngOnInit() {
    this.windowHeight = ($(window).height()-112)+'px';
    let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
    var sendpayload
    if (userlocation.UserLocation.toLowerCase() == 'balco') {
      sendpayload = {
        "reportId": environment.balco_portDashboard_reportId
      }
    }
    else{
      sendpayload = {
        "reportId": environment.jsg_portDashboard_reportId
      }
    }
    this.vedentaService.getAzureToken(sendpayload).then((s: any) => {
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
      //console.log(userlocation.UserLocation)
      if (userlocation.UserLocation.toLowerCase() == 'balco') {
          config  = {
            type: "report",
            id: environment.balco_portDashboard_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.balco_portDashboard_reportId+"" +
            "&groupId="+environment.balco_portDashboard_groupId+"",
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
            id: environment.jsg_portDashboard_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.jsg_portDashboard_reportId+"" +
            "&groupId="+environment.jsg_portDashboard_groupId+"",
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
}
