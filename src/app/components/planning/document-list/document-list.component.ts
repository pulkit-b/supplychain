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
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { VedantaService } from 'src/app/services/vedanta.service';
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDate,
  NgbDatepicker,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  public listOfDocument: any = [
    { id: '1', name: 'General Spec Description' },
    { id: '2', name: 'Class Certificate' },
    { id: '3', name: 'Certificate of registry' },
    { id: '4', name: 'P&I Certificate' },
    { id: '5', name: 'GA Plan' },
    { id: '6', name: 'Hold Pictures' },
    { id: '7', name: 'Maritime Labour Certificate' },
    { id: '8', name: 'Hull and Machinery Insurance' },
    { id: '9', name: 'International Ship Security Certificate' },
    { id: '10', name: 'Safety Management Certificate' },
    { id: '11', name: 'International Oil Pollution Prevention Certificate' },
    { id: '12', name: 'International Tonnage Certificate' },
    { id: '13', name: 'Energy Efficiency Rating' },
    { id: '14', name: 'Hold Dimension Details' },
    { id: '15', name: 'Statement of Facts at Both Ends' },
    { id: '16', name: 'Laytime Docs' },
    { id: '17', name: 'Draft Survey Certificate' },
    { id: '18', name: 'Mates Receipt' },
    { id: '19', name: 'Bills of Lading' },
    { id: '20', name: 'Cargo Quality Certificate' },
    { id: '21', name: '3rd Party Surveyor Report' },
    { id: '22', name: 'Other Custom Docs (can ask  port guys)' },
    { id: '23', name: 'Letters of Indemnity (if any)' }
  ];
  public forShowListofDocument = this.listOfDocument;
  public uploadedDocument: any = [];
  productForm: FormGroup;
  myFiles: string[] = [];
  @Input() modalOpen;
  @Input() procurement_id;

  @Output() closePopup = new EventEmitter();

  constructor(
    private renderer: Renderer,
    private formBuilder: FormBuilder,
    public vedantaService: VedantaService,
    public modalService: NgbModal
  ) {}

  public documentGrp: FormGroup;
  public totalfiles: Array<File> = [];
  public totalFileName = [];
  public lengthCheckToaddMore = 0;
  public unlinkdocument: any = [];
  @Output() successError = new EventEmitter();
  ngOnInit() {
    this.documentGrp = this.formBuilder.group({
      doc_name: '',
      doc_description: '',
      documentFile: new FormControl(File),

      items: this.formBuilder.array([this.createUploadDocuments()])
    });

    this.successError.emit('success');
    this.getUploadedDocumentList().then(s => {});
  }
  createUploadDocuments(): FormGroup {
    return this.formBuilder.group({
      doc_name: '',
      doc_description: '',
      documentFile: File,
      username:localStorage.getItem('userEmail')?localStorage.getItem('userEmail'):''
    });
  }

  get items(): FormArray {
    return this.documentGrp.get('items') as FormArray;
  }

  addItem(): void {
    if (this.totalfiles.length != 0) {
      if (
        this.items.value[0].doc_name != '' &&
        this.items.value[0].doc_description != '' &&
        this.lengthCheckToaddMore === this.totalfiles.length
      ) {
        this.lengthCheckToaddMore = this.lengthCheckToaddMore + 1;
        this.items.insert(
          this.lengthCheckToaddMore,
          this.createUploadDocuments()
        );
      }
    }
  }

  removeItem(index: number) {
    this.totalfiles.splice(index);
    this.totalFileName.splice(index);
    this.items.removeAt(index);
    this.lengthCheckToaddMore = this.lengthCheckToaddMore - 1;
    // //console.log("name are ",this.totalFileName);
  }

  public fileSelectionEvent(fileInput: any, oldIndex) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {};
      if (oldIndex == 0) {
        this.totalfiles.unshift(fileInput.target.files[0]);
        this.totalFileName.unshift(fileInput.target.files[0].name);
      } else {
        this.totalfiles[oldIndex] = fileInput.target.files[0];
        this.totalFileName[oldIndex] = fileInput.target.files[0].name;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
    }

    if (this.totalfiles.length == 1) {
      this.lengthCheckToaddMore = 1;
    }
  }

  public OnSubmit(formValue: any) {
    const main_form: FormData = new FormData();

    for (let j = 0; j < this.totalfiles.length; j++) {
      main_form.append(this.totalFileName[j], <File>this.totalfiles[j]);
    }

    const AllFilesObj = [];

    formValue.items.forEach((element, index) => {
      const eachObj = {
        doc_name: element.doc_name,
        doc_description: element.doc_description,
        procurement_id: this.procurement_id,
        file_name: this.totalFileName[index],
        username:localStorage.getItem('userEmail')?localStorage.getItem('userEmail'):''
      };
      AllFilesObj.push(eachObj);
    });

    main_form.append('fileInfo', JSON.stringify(AllFilesObj));
    main_form.append('fileInfoRemove', JSON.stringify(this.unlinkdocument));

    this.vedantaService.saveFiles(main_form).then(data => {
      this.closePopup.emit();
    });
  }
  closeModal() {
    this.closePopup.emit();
  }
  getUploadedDocumentList() {
    return new Promise((resolve, reject) => {
      this.vedantaService.showLoader();

      let remainingDocument;
      this.vedantaService
        .getDocumentList({ id: this.procurement_id })
        .then((s: any) => {
          this.uploadedDocument = s.success;
          s.success.forEach(element => {
            this.listOfDocument = this.listOfDocument.filter(element1 => {
              //console.log(typeof element1.id + '====' + typeof element.document_type);
              return Number(element1.id) !== Number(element.document_type);
            });
          });
          this.vedantaService.hideLoader();

          // this.listOfDocument = remainingDocument;
          resolve();
        });
    });
  }

  deleteDocument(d, index) {
    //console.log('----');
    const conf = window.confirm('Are you sure to delete the document');
    if (conf) {
      this.forShowListofDocument.filter(element1 => {
        if (element1.id == d.document_type) {
          this.listOfDocument.push(element1);
        }
      });
      this.uploadedDocument.splice(index, 1);
      this.unlinkdocument.push(d);
    }
  }

  downloadFile(file) {
    // const blob = new Blob(['http://localhost:8000/upload/temp/1565012936950_vedentaissue.xlsx']);
    // //console.log(blog)
    // const url= window.URL.createObjectURL(blob);
    // window.open(url);
  }
}
