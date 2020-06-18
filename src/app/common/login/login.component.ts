import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VedantaService } from '../../services/vedanta.service';
import { environment } from '../../../environments/environment';
import { Planningresult } from '../../models/planningresult';
import { Planningdata } from '../../models/planningdata';
import { NgxPowerBiService } from "ngx-powerbi";
import * as $ from 'jquery';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loading: false;
  private powerBiService: NgxPowerBiService;
  public model: any = {
    username: '',
    password: ''
  };
  public open;
  public dbfinaldata = [];
  public Month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private JSObject: Object = Object;
  private pbiContainerElement: HTMLElement;
  public widnowHeight: any;
  constructor(public router: Router, public nlgnlqService: VedantaService) {
    let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
    var sendpayload
    if (userlocation.UserLocation.toLowerCase() == 'balco') {
      sendpayload = {
        "reportId": environment.balco_planing_reportId
      }
    }
    else{
      sendpayload = {
        "reportId": environment.jsg_planing_reportId
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

  // employees = employees;
  ngOnInit() {


    // this.getEmbedReport();
  }
  getEmbedReport() {
    setTimeout(() => {
      this.powerBiService = new NgxPowerBiService();
      this.pbiContainerElement = <HTMLElement>(
        document.getElementById("reportContainer")
      );
      let config:any;
      let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
      var client = window['powerbi-client'];
     
      // console.log(userlocation.UserLocation)
      if (userlocation.UserLocation.toLowerCase() == 'balco') {
          config  = {
          type: "report",
          id: environment.balco_planing_reportId, //this.powerbiDataValue.report_id,
          embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId="+environment.balco_planing_reportId+"" +
            "&groupId="+environment.balco_planing_groupId+"",
          accessToken: localStorage.getItem("tokenAD"),
          tokenType: client.models.TokenType.Embed,
          permissions: client.models.Permissions.All,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: true
          }
        };

      } else {
          config  = {
          type: "report",
          id: environment.jsg_planing_reportId, //this.powerbiDataValue.report_id,
          embedUrl:
          "https://app.powerbi.com/reportEmbed?reportId="+environment.jsg_planing_reportId+"" +
          "&groupId="+environment.jsg_planing_groupId+"",
          accessToken: localStorage.getItem("tokenAD"),
          tokenType: client.models.TokenType.Embed,
          permissions: client.models.Permissions.All,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: true
          }
        };
      }


      this.powerBiService.embed(this.pbiContainerElement, config);
      this.widnowHeight = ($(window).height() - 112) + 'px';
    }, 1000);
  }
}
