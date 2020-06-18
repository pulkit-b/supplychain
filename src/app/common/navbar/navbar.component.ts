import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // public open: Boolean = true;
  @Input() public open: Boolean;
  @Output() public event = new EventEmitter();
  public currentPage: any = '';
  public logindata:any;
  public loginUser:any;
  constructor(private router: Router) {
    let pagename = this.router.url.split("/")
    this.currentPage = "/"+pagename[1];
    // console.log(this.currentPage)
  }

  ngOnInit() {
    if(!localStorage.getItem("vedantaLoginDeatils").length){
      this.router.navigate(['/signin']);
    }
    this.logindata = JSON.parse(localStorage.getItem('vedantaLoginDeatils'));
    this.loginUser = this.logindata.email;
  }

  toggleSidenav() {
    this.open = !this.open;
    this.event.emit(this.open);
    // console.log('toggling');
    // this.open = !this.open;
  }
  logoutuser(){
    localStorage.removeItem("userEmail");
    localStorage.removeItem('vedantaLoginDeatils')
    this.router.navigate(["/"])
  }
}
