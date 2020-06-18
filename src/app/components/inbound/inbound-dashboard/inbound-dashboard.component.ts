import { Component, OnInit } from '@angular/core';
import { VedantaService } from 'src/app/services/vedanta.service';
import { environment } from '../../../../environments/environment';
import { NgxPowerBiService } from "ngx-powerbi";
import * as $ from 'jquery';
@Component({
  selector: 'app-inbound-dashboard',
  templateUrl: './inbound-dashboard.component.html',
  styleUrls: ['./inbound-dashboard.component.css']
})
export class InboundDashboardComponent implements OnInit {
  private pbiContainerElement: HTMLElement;
  public windowHeight: any;
  public open = true;
  public portstockdata: any = [];
  public transitdata: any;
  public P1P2days: any;
  public plantstock: any;
  public consumption: any;
  public fulldata: any;
  public brundamal = 'Brundamal';
  public bulkerdispatchaod: any = []
  public bulkerdispatchreceipt: any = []
  public bulkerdispatchUnload: any = [];
  inboundDashboardList = [];
  KSLKValuesList = [];
  LNJValuesList = [];
  KSLKKeysList = [];
  LNJKeysList = [];
  lengthOfLNJValuesList: number;
  lengthOfKSLKValuesList: number;
  transitlnj: any = 0;
  transitkskl: any = 0;
  btapinlnj: any = 0;
  btapinkskl: any = 0;
  btapinlnjjharsu: any = 0;
  btapinkskljharsu: any = 0;

  constructor(private powerBiService: NgxPowerBiService, public vedentaService: VedantaService) { }
  toggleSidenav() {
    this.open = !this.open;
  }
  ngOnInit() {
    // this.dashboarddata();
    //console.log(this.fulldata);
    let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
    var sendpayload
    if (userlocation.UserLocation.toLowerCase() == 'balco') {
      sendpayload = {
        "reportId": environment.balco_inboundDashboard_reportId
      }
    }
    else {
      sendpayload = {
        "reportId": environment.jsg_inboundDashboard_reportId
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

  getEmbedReport() {
    setTimeout(() => {
      this.powerBiService = new NgxPowerBiService();
      this.pbiContainerElement = <HTMLElement>(
        document.getElementById("reportContainer")
      );
      let config: any;
      let userlocation = JSON.parse(localStorage.getItem('userDetails'))[0]
      var client = window['powerbi-client'];

      //console.log(userlocation.UserLocation)
      if (userlocation.UserLocation.toLowerCase() == 'balco') {
        config = {
          type: "report",
          id: environment.balco_inboundDashboard_reportId, //this.powerbiDataValue.report_id,
          embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId=" + environment.balco_inboundDashboard_reportId + "" +
            "&groupId=" + environment.balco_inboundDashboard_groupId + "",
          accessToken: localStorage.getItem("tokenAD"),
          tokenType: client.models.TokenType.Embed,
          permissions: client.models.Permissions.All,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false
          }
        };

      } else {
        config = {
          type: "report",
          id: environment.jsg_inboundDashboard_reportId, //this.powerbiDataValue.report_id,
          embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId=" + environment.jsg_inboundDashboard_reportId + "" +
            "&groupId=" + environment.jsg_inboundDashboard_groupId + "",
          accessToken: localStorage.getItem("tokenAD"),
          tokenType: client.models.TokenType.Embed,
          permissions: client.models.Permissions.All,
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

  dashboarddata() {
    this.vedentaService.showLoader();
    const payload = {
      Date: `${('0' + new Date().getDate()).slice(-2)}-${(
        '0' +
        (new Date().getMonth() + 1)
      ).slice(-2)}-${new Date().getFullYear()}`
    };
    this.vedentaService.inbounddashboarddata2(payload).then((response: any) => {

      this.inboundDashboardList =
        response.success.latest.data.json_data

      const valuesOfInboundDashboardList = Object.values(
        this.inboundDashboardList
      );
      this.KSLKValuesList = valuesOfInboundDashboardList.filter(
        x => x.destination === 'KSPL'
      );
      this.lengthOfKSLKValuesList = this.KSLKValuesList.length;
      this.LNJValuesList = valuesOfInboundDashboardList.filter(
        x => x.destination === 'LNJ'
      );
      this.lengthOfLNJValuesList = this.LNJValuesList.length;
      const keysOfInboundDashboard = Object.keys(this.inboundDashboardList);
      //console.log( this.LNJValuesList);

      keysOfInboundDashboard.forEach(x => {
        if (this.inboundDashboardList[x].destination === 'KSPL') {
          this.KSLKKeysList.push(x);
        } else {
          this.LNJKeysList.push(x);
        }
        if (this.inboundDashboardList[x].current_station === 'Lanjigarh Road') {
          this.btapinlnj++;
        } else if (
          this.inboundDashboardList[x].current_station === 'Kakinada Port'
        ) {
          this.btapinkskl++;
        } else if (
          this.inboundDashboardList[x].current_station === 'Brundamal ' &&
          this.inboundDashboardList[x].destination === 'KSPL'
        ) {
          this.btapinkskljharsu++;
        } else if (
          this.inboundDashboardList[x].current_station === 'Brundamal ' &&
          this.inboundDashboardList[x].destination === 'LNJ'
        ) {
          this.btapinlnjjharsu++;
        }
      });
      this.transitlnj =
        this.lengthOfLNJValuesList - (this.btapinlnj + this.btapinlnjjharsu);
      this.transitkskl =
        this.lengthOfKSLKValuesList - (this.btapinkskl + this.btapinkskljharsu);

      //console.log(this.KSLKKeysList, this.LNJKeysList);

      this.fulldata = response.success;
      this.portstockdata = response.success.inbound['Port_stock'];
      this.portstockdata['vessel_stock_p1'] =
        Number(this.portstockdata['vessel_Stock_Gpl_P1']) +
        Number(this.portstockdata['vessel_Stock_Kspl_P1']);
      this.portstockdata['vessel_stock_p2'] =
        Number(this.portstockdata['vessel_Stock_Gpl_P2']) +
        Number(this.portstockdata['vessel_Stock_Kspl_P2']);
      this.portstockdata['total_p1'] =
        Number(this.portstockdata['vessel_stock_p1']) +
        Number(this.portstockdata['Stock_Gpl_P1']) +
        Number(this.portstockdata['Stock_Kspl_P1']);
      this.portstockdata['total_p2'] =
        Number(this.portstockdata['vessel_stock_p2']) +
        Number(this.portstockdata['Stock_Gpl_P2']) +
        Number(this.portstockdata['Stock_Kspl_P2']);

      //console.log(this.portstockdata);
      this.transitdata = response.success.inbound['Transit_Stock'];
      this.plantstock = response.success.inbound['Plant_Stock'];
      this.P1P2days = response.success.inbound['P1_P2_days'];
      this.consumption = response.success.inbound['consumption'];
      //console.log(this.transitdata, this.P1P2days);
      this.vedentaService.hideLoader();
      this.bulketruckdata()
    });
  }

  bulketruckdata() {
    this.vedentaService.showLoader();
    var senddate = `${new Date().getFullYear()}-${(
      '0' + (new Date().getMonth() + 1)
    ).slice(-2)}-${('0' + new Date().getDate()).slice(-2)}`
    const formdatasend = {
      "date": senddate
    };
    //console.log(formdatasend)
    this.vedentaService.inboundbulker(formdatasend).then((response: any) => {
      // //console.log(response)
      this.bulkerdispatchaod = response['success']

      this.bulkerdispatchreceipt = this.bulkerdispatchaod['receipt']
      this.bulkerdispatchUnload = this.bulkerdispatchaod['unloaded']
      //console.log(this.bulkerdispatchUnload)
      this.vedentaService.hideLoader();
    })
  }

  getKeyByValue(value) {

    if (
      (this.inboundDashboardList !== undefined ||
        this.inboundDashboardList.length !== 0) &&
      value !== undefined
    ) {
      // //console.log(value)
      let b = Object.keys(this.inboundDashboardList).find(
        key => this.inboundDashboardList[key].current_station === value
      );
      // //console.log(b); 
      return b;
    }
  }
}
