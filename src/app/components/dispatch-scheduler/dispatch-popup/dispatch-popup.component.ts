import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
  Renderer,
  TemplateRef,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import { VedantaService } from '../../../services/vedanta.service';
@Component({
  selector: 'app-dispatch-popup',
  templateUrl: './dispatch-popup.component.html',
  styleUrls: ['./dispatch-popup.component.css']
})
export class DispatchPopupComponent implements OnInit {
  @Input() showtitle;
  @Input() next;
  @Input() previous;
  @Input() current;
  @Input() viewShown;
  public holdStatus: any = [];
  public loading: any = {
    holdStatus: false
  };
  public addDelay: Boolean = false;
  public popupValue = [];
  constructor(
    public activeModal: NgbActiveModal,
    public vedentaService: VedantaService
  ) {}

  ngOnInit() {
    const i = 0;
    ////console.log(this.popupValue, this.current)
    this.popupValue.push(this.current);
    if (this.next.destination !== this.current.destination) {
      this.popupValue.push(this.next);
    }
    this.getHoldStatus(this.current);
  }

  getHoldStatus(current) {
    this.loading.holdStatus = true;
    const payload = { btapname: current.BTAP_Name, startdate: current.Datetime };
    this.vedentaService.getHoldStatus(payload).then((s: any) => {
      this.holdStatus = s.success;
      this.loading.holdStatus = false;
      this.getBtapPlanted();
    });
  }

  getBtapPlanted() {
    const formdata = '';
  }
}
