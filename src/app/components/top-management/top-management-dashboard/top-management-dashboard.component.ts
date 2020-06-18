import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VedantaService } from '../../../services/vedanta.service';
import { environment } from '../../../../environments/environment';
import { Planningresult } from '../../../models/planningresult';
import { Planningdata } from '../../../models/planningdata';
import { NgxPowerBiService } from "ngx-powerbi";
import * as $ from 'jquery';

@Component({
  selector: 'app-top-management-dashboard',
  templateUrl: './top-management-dashboard.component.html',
  styleUrls: ['./top-management-dashboard.component.css']
})
export class TopManagementDashboardComponent implements OnInit {

  private pbiContainerElement: HTMLElement;
  public windowHeight: any;
  public open;
  constructor(public router: Router, public nlgnlqService: VedantaService, private powerBiService: NgxPowerBiService) {
    // this.nlgnlqService.getAzureToken().then((s: any) => {
    //   const d = JSON.parse(s.token);
    //   localStorage.setItem('tokenAD', d.access_token);
    //   // window.location.reload();
    // });
  }

  // employees = employees;
  ngOnInit() {
    // this.getCurrentFiscalYear();
    // this.getPlanningData();
    let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
    var sendpayload
    if (userlocation.UserLocation.toLowerCase() == 'balco') {
      sendpayload = {
        "reportId": environment.balco_topManagment_reportId
      }
    }
    else{
      sendpayload = {
        "reportId": environment.jsg_topManagment_reportId
      }
    }
   
    this.nlgnlqService.getAzureToken(sendpayload).then((s: any) => {
      // const d = JSON.parse(s);
      localStorage.setItem('tokenAD', s.accessToken);
      // window.location.reload();
      this.getEmbedReport();
    });
    this.windowHeight = ($(window).height() - 112) + 'px';
  }
  
  getEmbedReport() {
    setTimeout(() => {
      this.powerBiService = new NgxPowerBiService();
      this.pbiContainerElement = <HTMLElement>(
        document.getElementById("reportContainer")
      );
      let config: any;
      var client = window['powerbi-client'];
      let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
      //console.log(userlocation.UserLocation)
      if (userlocation.UserLocation.toLowerCase() == 'balco') {
        config = {
          type: "report",
          id: environment.balco_topManagment_reportId, //this.powerbiDataValue.report_id,
          embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId=" + environment.balco_topManagment_reportId + "" +
            "&groupId=" + environment.balco_topManagment_groupId + "",
          accessToken: localStorage.getItem("tokenAD"),
          permissions: client.models.Permissions.All,
          tokenType: client.models.TokenType.Embed,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false
          }
        };

      } else {
        config = {
          type: "report",
          id: environment.jsg_topManagment_reportId, //this.powerbiDataValue.report_id,
          embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId=" + environment.jsg_topManagment_reportId + "" +
            "&groupId=" + environment.jsg_topManagment_groupId + "",
          accessToken: localStorage.getItem("tokenAD"),
          permissions: client.models.Permissions.All,
          tokenType: client.models.TokenType.Embed,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false
          }
        };
      }
      this.powerBiService.embed(this.pbiContainerElement, config);
      this.windowHeight = ($(window).height() - 112) + 'px';
    }, 1000);
  }

  // getEmbedReport() {
  //   this.pbiContainerElement = <HTMLElement>(
  //     document.getElementById("reportContainer")
  //   );
  //   let config: any;
  //   // let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
  //   config = {
  //     type: "report",
  //     id: environment.jsg_topManagment_reportId, //this.powerbiDataValue.report_id,
  //     embedUrl:
  //       "https://app.powerbi.com/reportEmbed?reportId=" + environment.jsg_topManagment_reportId + "" +
  //       "&groupId=" + environment.jsg_topManagment_groupId + "",
  //     accessToken:  localStorage.getItem("tokenAD"),
  //     settings: {
  //       filterPaneEnabled: false,
  //       navContentPaneEnabled: false
  //     }
  //   };
  //   console.log(config)
  //   this.powerBiService.embed(this.pbiContainerElement, config);
  // }

}
