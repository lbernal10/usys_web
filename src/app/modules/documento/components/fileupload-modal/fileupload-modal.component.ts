import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { DocumentoService } from '../../../../_usys/core/services/modules/documento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { HttpClient, HttpEventType,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BaseModel2 } from 'src/app/_usys/crud-table';
import { AuthModel } from '../../../../modules/auth/_models/auth.model';
@Component({
  selector: 'app-fileupload-modal',
  templateUrl: './fileupload-modal.component.html',
  styleUrls: ['./fileupload-modal.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FileUpLoadModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  @Input()
  requiredFileType: string;
  API_URL = environment.backend;

  fileName = '';
  idOrganizacion = 1;
  idDirectorio = 1;
  uploadProgress: number;
  uploadSub: Subscription;
  formData = new FormData();
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private documentoService: DocumentoService, private fb: FormBuilder, public modal: NgbActiveModal, private http: HttpClient) { }

  loadForm() {
    this.formGroup = this.fb.group({
      archivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.formData = new FormData();
      this.formData.append("archivo", file);

      /*const upload$ = this.http.post("/api/thumbnail-upload", formData, {
          reportProgress: true,
          observe: 'events'
      })
      .pipe(
          finalize(() => this.reset())
      );
    
      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      })*/
    }
  }

  savefile() {
    const formData = new FormData();
    console.log(this.fileName);
   
    const auth = this.getAuthFromLocalStorage();

    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    formData.append("archivo", this.fileName);
    const upload$ = this.http.post<BaseModel2>(`${environment.backend}/documentos/upload/`,  this.formData, {
      reportProgress: true,
      observe: 'events',
      headers: httpHeaders
    })
      .pipe(
        finalize(() => this.reset())
      );

    this.uploadSub = upload$.subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      }
    })

  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse( localStorage.getItem(this.authLocalStorageToken) );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
