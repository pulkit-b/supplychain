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
  NgbDateStruct,
  NgbCalendar,
  NgbDate,
  NgbDatepicker,
  NgbModal,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { VedantaService } from 'src/app/services/vedanta.service';

@Component({
  selector: 'app-port-activities',
  templateUrl: './port-activities.component.html',
  styleUrls: ['./port-activities.component.css']
})
export class PortActivitiesComponent implements OnInit {
  @Output() closePopup = new EventEmitter();
  @Input() modalOpen;
  @Input() portdata;

  public portdetails: any;

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public vedantaService: VedantaService
  ) {}

  ngOnInit() {
    //console.log(this.portdata);
    // this.getportdetails();
  }
  closeModal() {
    //console.log('asdfgh');
    this.closePopup.emit();
  }

  // getportdetails(){
  //   let payload = { 'id': this.id }
  //   this.vedantaService.getportactivities(payload).then((s: any) => {
  //     this.portdetails = s.success[0]
  //     //console.log('by id vessel Data', this.portdetails)
  //   })
  // }
}
