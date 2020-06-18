import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-leftpanel',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.css']
})
export class LeftpanelComponent implements OnInit, OnChanges {
  @Input() openValue: any;
  @Output() hidePanel = new EventEmitter();
  public currentPage: any = '';
  public open;
  constructor(private router: Router) {
    // alert(this.router.url)
    this.currentPage = this.router.url;
  }

  ngOnInit() {
    this.open = this.openValue;
  }

  ngOnChanges() {
    // console.log(this.openValue);
    this.open = this.openValue;
  }

  toggleSidenav() {
    this.open = !this.open;
    // console.log(this.open);
    this.hidePanel.emit(this.open);
  }
}
