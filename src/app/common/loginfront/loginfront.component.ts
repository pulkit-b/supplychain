import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VedantaService } from 'src/app/services/vedanta.service';
@Component({
  selector: 'app-loginfront',
  templateUrl: './loginfront.component.html',
  styleUrls: ['./loginfront.component.scss']
})
export class LoginfrontComponent implements OnInit {
  loading: false;
  public model: any = {
    uid: '',
    password: '',
    resource: 'Authentication',
  };
  constructor(public vedentaService: VedantaService, public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('userEmail') != null) { 
    this.router.navigate(['/home']);
        }else{
    this.router.navigate(['/']);
        }
    }
  
  login() {
    console.log(this.model);
    if((this.model.uid=='anupam@celebaltech.com' && this.model.password=='anupam123')){
      let Details={'email':this.model.uid,'password':this.model.password}
      localStorage.setItem("vedantaLoginDeatils",JSON.stringify(Details)); 
      localStorage.setItem('userEmail', this.model.uid);
      const formdata = {
        mail: 'anupam@celebaltech.com'
      };
      this.vedentaService.getUserDetails(formdata).then((s: any) => {
          localStorage.setItem('userDetails', JSON.stringify(s.success));
          localStorage.setItem('loginType', s.success.UserLocation);
          // window.location.reload();
        });
      this.router.navigate(['/home']);
    }else{
      alert('Invalid credentials');
    }
     // localStorage.setItem("chatbotEmail",JSON.stringify(this.model.uid)); 
        // localStorage.setItem("chatbotPassword",JSON.stringify(this.model.password)); 

 
  }
}
