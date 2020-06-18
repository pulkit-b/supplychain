import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { VedantaService } from 'src/app/services/vedanta.service';
import * as $ from 'jquery';
declare var google: any;
@Component({
  selector: 'app-vessel-management',
  templateUrl: './vessel-management.component.html',
  styleUrls: ['./vessel-management.component.css']
})
export class VesselManagementComponent implements OnInit {
  public open = true;
  public currentMonth: any = this.vedentaService.currentMonth;
  public currentYear: any = this.vedentaService.currentYear;
  public vesselPortal: any = '';
  public vesselPortalDetails: any;
  public menuState;
  public rightClicked;
  public menuPosition;
  public menuPositionX;
  public menuPositionY;
  public menuWidth = 10;
  public cdRef;
  public menuHeight;
  public windowWidth;
  public windowHeight;
  public portsDetails: any;
  public portsStartData: any = [];
  public portsEndData: any = [];
  public portsDetailsDataForMap: any = [];
  public VesselNameData: any = [];
  public domastic: any;
  public laycandata: any;
  public eta: any;
  public colors:any = [
    {
      // grey
      backgroundColor: ['#A9A9AA', '#517DBF'],
      borderColor: ['#A9A9AA', '#517DBF']
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ]
  public dbresult = {
    success: [
      {
        VesselName: 'FOB',
        Quantity: 60,
        Plant: 'BALCO',
        LoadPort: 'INDONESIA',
        DischargePortSuggested: 'KSPL'
      },
      {
        VesselName: 'FOB',
        Quantity: 25,
        Plant: 'BALCO',
        LoadPort: 'VIETNAM',
        DischargePortSuggested: 'KSPL'
      },
      {
        VesselName: 'FOB',
        Quantity: 22,
        Plant: 'PLANT 1',
        LoadPort: 'VIETNAM',
        DischargePortSuggested: 'KSPL'
      },
      {
        VesselName: 'FOB',
        Quantity: 30,
        Plant: 'SEZ',
        LoadPort: 'WA',
        DischargePortSuggested: 'KSPL'
      }
    ]
  };
  @ViewChild('contextMenu') contextMenu;
  @HostListener('document:click', ['$event'])
  public documentClick(event: Event): void {
    this.menuState = false;
  }
  @HostListener('document:contextmenu', ['$event'])
  public documentRClick(event: Event): void {
    this.menuState = false;
  }
  constructor(public router: Router, public vedentaService: VedantaService) {}

  onRightClick(event, data) {
    this.rightClicked = data.Parent;
    event.stopPropagation();
    this.menuState = true;
    this.positionMenu(event);
  }
  positionMenu(e) {
    const th = this;
    th.menuPosition = th.getPosition(e);
    th.menuPositionX = th.menuPosition.x;
    th.menuPositionY = th.menuPosition.y;
    // th.cdRef.detectChanges();
    th.menuWidth = th.contextMenu.nativeElement.offsetWidth;
    th.menuHeight = th.contextMenu.nativeElement.offsetHeight;
    th.windowWidth = window.innerWidth;
    th.windowHeight = window.innerHeight;
    //console.log(th.menuPositionY);
    if (th.windowWidth - th.menuPositionX < th.menuWidth) {
      th.menuPositionX = th.windowWidth - th.menuWidth + 'px';
    } else {
      th.menuPositionX = th.menuPositionX + 'px';
    }
    if (th.windowHeight - th.menuPositionY < th.menuHeight) {
      th.menuPositionY = (th.menuPositionY) + 'px';
    } else {
      //console.log("--->..")
      th.menuPositionY = th.menuPositionY + 'px';
    }
  }

  getPosition(e) {
    let posx = 0;
    let posy = 0;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      posy =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    return { x: posx, y: posy };
  }
  toggleSidenav() {
    this.open = !this.open;
  }
  showMessage(message: any) {
    //console.log(message);
  }
  ngOnInit() {
    this.getVesselPortalDetails();
  }

  getVesselPortalDetails() {
    const payload = {
      month: Number(this.currentMonth),
      year: Number(this.currentYear)
    };
    this.vedentaService.showLoader();
    this.vedentaService
      .getVesselPortal(payload)
      .then((s: any) => {
        this.vesselPortal = s.success.data[0];
        this.domastic = s.success.totalLangigarh[0];
        this.eta = s.success.EtaData.data;
      })
      .then(() => {
        // this.vesselPortalDetails = this.dbresult.success
        this.vedentaService.getVesselPortalDetails(payload).then((s: any) => {
          this.vesselPortalDetails = JSON.parse(JSON.stringify(s.success.data).replace(/Kwinana/g , 'Jebel Ali').replace(/Go Dau/g , 'Port Klang').replace(/Gladstone/g , 'Los Angeles').replace(/Worsley/g , 'Laem Chabang').replace(/Bunbury/g , 'Algeciras').replace(/Kendawangan/g , 'Jeddah').replace(/GPL/g , 'Chennai').replace(/KSPL/g , 'Mormugao').replace(/BALCO/g , 'Plant3')) ;
          this.laycandata = s.success.laycan[0];
          this.portsDetails = s.success.ports;
          const startPort = [];
          const endport = [];
          this.portsStartData = [];
          this.portsEndData = [];

          this.vesselPortalDetails.forEach(element => {
            this.VesselNameData.push(element);
            this.portsStartData.push([element.slat, element.slong]);
            this.portsEndData.push([element.elat, element.elong]);
            this.portsDetailsDataForMap.push(element);
          });

          
          let winscreen = screen.width
          if(winscreen>1900){
            $(".moadlbox1").css('left','19%')
            $(".moadlbox2").css('left','25%')
            $(".moadlbox5").css('right','19%')
          }
          this.vedentaService.hideLoader();
          setTimeout(() => {
            this.showMap();
          }, 100);
        });
      });
  }
  multiDimensionalUnique(arr) {
    const uniques = [];
    const itemsFound = {};
    for (let i = 0, l = arr.length; i < l; i++) {
      const stringified = JSON.stringify(arr[i]);
      if (itemsFound[stringified]) {
        continue;
      }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  updateData(event, type) {
    this.getVesselPortalDetails();
  }

  hssUpdate(id) {
    this.router.navigate(['/hss-update', id]);
  }
  viewvessel(id) {
    this.router.navigate(['/vessel-logistics', id]);
  }

  showMap() {
    const start = this.portsStartData;
    const end = this.portsEndData;
    let center = new google.maps.LatLng(16.93134, 82.3058);
    if (start.length > 0) {
      center = new google.maps.LatLng(start[0][0], start[0][1]);
    }

    const map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false
    });

    const infowindow = new google.maps.InfoWindow({});
    const bounds = new google.maps.LatLngBounds();
    const matchData = [];
    this.portsDetailsDataForMap.forEach(element => {
      const matchCenterLatLong = {};
      let match = 0;
      this.eta.forEach(element1 => {
        if (element.VesselName == element1.vesselName) {
          matchCenterLatLong['cordinates'] = element1.cordinates;
          match = 1;
        }
      });
      if (match == 1) {
        matchData.push(Object.assign(element, matchCenterLatLong));
      }
    });
    //console.log(matchData);
    for (let i = 0; i < matchData.length; i++) {
      const startCoords = matchData[i];

      const startPt = new google.maps.LatLng(
        matchData[i].slat,
        matchData[i].slong
      );
      center = new google.maps.LatLng(
        matchData[i].cordinates[0],
        matchData[i].cordinates[1]
      );
      //console.log(center);
      const endPt = new google.maps.LatLng(
        matchData[i].elat,
        matchData[i].elong
      );
      this.calcRoute(startPt, endPt, map);
      bounds.extend(startPt);
      bounds.extend(endPt);
      const image = {
        url: 'assets/images/map-pin-20x18.png', // url
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
      };
      const marker = new google.maps.Marker({
        position: center,
        map: map,
        icon: image
      });

      const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">' +
        matchData[i].VesselName +
        '</h1>' +
        '<div id="bodyContent">' +
        '<div class="detailsmap"><span>Quantity</span> :' +
        matchData[i].Quantity +
        '</div>' +
        '<div class="detailsmap"><span>Lord Port </span> :' +
        matchData[i].LoadPort +
        '</div class="detailsmap"><span>' +
        '<div class="detailsmap"><span>Discharge Port </span> :' +
        matchData[i].DischargePortSuggested +
        '</div>' +
        '<div class="detailsmap"><span>For Plant </span> :' +
        matchData[i].Plant +
        '</div>' +
        '</div>' +
        '</div>';

      const infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(
        marker,
        'click',
        (function(marker, contentString, infowindow) {
          return function() {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          };
        })(marker, contentString, infowindow)
      );
    }
  }

  calcRoute(source, destination, map) {
    const polyline = new google.maps.Polyline({
      path: [source, destination],
      strokeColor: 'red',
      strokeWeight: 2,
      strokeOpacity: 1
    });

    polyline.setMap(map);
  }
}
