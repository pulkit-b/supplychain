import { Component } from '@angular/core';
import { VedantaService } from './services/vedanta.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Vedanta';
  constructor(public vedentaService: VedantaService, public router: Router) {

    this.getPortsList();
    // this.getUserLoginDetails();
    // if (localStorage.getItem('userEmail') == null) {
    //   this.router.navigate(['/signin']);
    // }else{
    //   this.router.navigate(['/planning']);
    // }
  }
  getPortsList() {
    if (localStorage.getItem('Ports') == null) {
      this.vedentaService.getPortsData().then((s: any) => {
        localStorage.setItem('Ports', JSON.stringify(s.success.ports));
        localStorage.setItem('plants', JSON.stringify(s.success.plant));
        
      });
    }
    const formdata = {
      mail: 'anupam@celebaltech.com'
    };
    this.vedentaService.getUserDetails(formdata).then((s: any) => {
      console.log(s)
      localStorage.setItem('userDetails', JSON.stringify(s.success));
      localStorage.setItem('loginType', s.success.UserLocation);
      // window.location.reload();
    });
  }


  getUserLoginDetails() { 
if (localStorage.getItem('userEmail') == null) { 
    this.vedentaService.getUserLoginDetails().then((s: any) => {
      localStorage.setItem('userEmail', s);
     
    }).then(() => {
      const formdata = {
        mail: localStorage.getItem('userEmail')
      };
      this.vedentaService.getUserDetails(formdata).then((s: any) => {
          localStorage.setItem('userDetails', JSON.stringify(s.success));
          localStorage.setItem('loginType', s.success.UserLocation);
          // window.location.reload();
        });
    })
    // .then(() => {
    //     this.vedentaService.getAzureToken().then((s: any) => {
    //       const d = JSON.parse(s.token);
    //       localStorage.setItem('tokenAD', d.access_token);
    //       // window.location.reload();
    //     });
    // });
  } else {
    if (localStorage.getItem('userDetails') == null) { 
    const formdata = {
        mail: 'anupam@celebaltech.com'
      };
      this.vedentaService.getUserDetails(formdata).then((s: any) => {
          localStorage.setItem('userDetails', JSON.stringify(s.success));
          localStorage.setItem('loginType', s.success.UserLocation);
          // window.location.reload();
        });

    }
    // const formdata = {
    //   mail: localStorage.getItem('userEmail')
    // };
    // this.vedentaService.getUserDetails(formdata).then((s: any) => {
    //     localStorage.setItem('userDetails', JSON.stringify(s.success));
    //     localStorage.setItem('loginType', s.success.UserLocation);
    //     // window.location.reload();
    //   });
      // this.vedentaService.getAzureToken().then((s: any) => {
      //   const d = JSON.parse(s.token);
      //   localStorage.setItem('tokenAD', d.access_token);
      //   // window.location.reload();
      // });
    // this.vedentaService.getAzureToken().then((s: any) => {
    //   const d = JSON.parse(s.token);
    //   localStorage.setItem('tokenAD', d.access_token);
     
    // })
    // .then(() => {
    //   const formdata = {
    //     mail: localStorage.getItem('userEmail')
    //   };
    //   this.vedentaService.getUserDetails(formdata).then((s: any) => {
    //       localStorage.setItem('userDetails', JSON.stringify(s.success));
    //       localStorage.setItem('loginType', JSON.stringify(s.success));
    //     });
    // })
  }
     
  }


}
