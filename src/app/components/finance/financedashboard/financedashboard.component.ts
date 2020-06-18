import { Component, OnInit } from '@angular/core';
import { NgxPowerBiService } from "ngx-powerbi";
import { environment } from '../../../../environments/environment';
import { VedantaService } from '../../../services/vedanta.service';

import * as $ from 'jquery';
@Component({
  selector: 'app-financedashboard',
  templateUrl: './financedashboard.component.html',
  styleUrls: ['./financedashboard.component.css']
})
export class FinancedashboardComponent implements OnInit {
  private pbiContainerElement: HTMLElement;
  public windowHeight:any;
  public open;
  constructor(private powerBiService: NgxPowerBiService , public nlgnlqService: VedantaService) {}

  ngOnInit() { 
    let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
    var sendpayload
    if (userlocation.UserLocation.toLowerCase() == 'balco') {
      sendpayload = {
        "reportId": environment.balco_finance_reportId
      }
    }
    else{
      sendpayload = {
        "reportId": environment.jsg_finance_reportId
      }
    }
    this.nlgnlqService.getAzureToken(sendpayload).then((s: any) => {
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
      let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
      var client = window['powerbi-client'];
     
      //console.log(userlocation.UserLocation)
      if (userlocation.UserLocation.toLowerCase() == 'balco') {
          config  = {
            type: "report",
            id: environment.balco_finance_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.balco_finance_reportId+"" +
            "&groupId="+environment.balco_finance_groupId+"",
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
            id: environment.jsg_finance_reportId, //this.powerbiDataValue.report_id,
            embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.jsg_finance_reportId+"" +
            "&groupId="+environment.jsg_finance_groupId+"",
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
