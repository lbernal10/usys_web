import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';
import { DocumentoService } from '../../../../_usys/core/services/modules/documento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BaseModel2 } from 'src/app/_usys/crud-table';
import { AuthModel } from '../../../../modules/auth/_models/auth.model';
import { FileElement } from 'src/app/_usys/core/models/fileElement.model';
import { FileDetails } from 'src/app/_usys/core/models/file.modal';
import Swal from 'sweetalert2';
import { DocumentoComponent } from '../../documento.component';
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
  @Input() directorioSelect: FileElement;
  @Input() idArea: number;
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  @Input()
  requiredFileType: string;
  API_URL = environment.backend;
  @Input() currentRoot: FileElement;
  currentPath: string;
  public fileElements: Observable<FileElement[]>;
  canNavigateUp = false;
  public _isLoading$ = new BehaviorSubject<boolean>(false);
  get isLoading$() {
    return this._isLoading$.asObservable();
  }

  fileName = '';
  idOrganizacion = 1;
  idDirectorio = 1;
  uploadProgress: number;
  uploadSub: Subscription;
  formData = new FormData();
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  arrfile = [];

  //TEST
  loaded = 0;
  selectedFiles: FileList;
  uploadedFiles: FileDetails[] = [];
  showProgress = false;
  //

  constructor(private documentoService: DocumentoService, private fb: FormBuilder, public modal: NgbActiveModal, private http: HttpClient) { }

  loadForm() {
    this.formGroup = this.fb.group({
      archivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadForm();
    console.log(this.directorioSelect);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  onFileSelected(event) {
    const file: File = event.target.files[0];
    this.arrfile = event.target.files;

    if (file) {
      this.fileName = file.name;
      this.formData = new FormData();
      this.formData.append("archivo", file);
    }

  }

  successMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'La documentación se ha sido guardada con éxito.',
      showConfirmButton: false,
      timer: 2000
    });
  }

  savefile() {

    for (let index = 0; index < this.arrfile.length; index++) {
      this.fileName = this.arrfile[index].name;
      this.formData = new FormData();
      this.formData.append("archivo", this.arrfile[index]);


      const idUsuario = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idUsuario;
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
      console.log(this.directorioSelect);
      const upload$ = this.http.post<BaseModel2>(`${environment.backend}/documentos/upload/${this.directorioSelect.id}/${idUsuario}`, this.formData, {
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

    //this.reloaderDirectorios();

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
      const authData = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }


  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this._isLoading$.next(true);
    this.showProgress = true;
    this.uploadedFiles = [];
    (document.getElementById('buttonUpload') as HTMLInputElement).disabled = true;
    (document.getElementById('btncancel') as HTMLInputElement).disabled = true;
    Array.from(this.selectedFiles).forEach(file => {
      this.fileName = file.name;
      this.formData = new FormData();
      this.formData.append("archivo", file);
      const fileDetails = new FileDetails();
      fileDetails.name = file.name;
      fileDetails.size = file.size;
      this.uploadedFiles.push(fileDetails);
      const auth = this.getAuthFromLocalStorage();

      if (!auth || !auth.access_token) {
        return of(undefined);
      }

      const httpHeaders = new HttpHeaders({
        Authorization: `Bearer ${auth.access_token}`,
      });
      const idUsuario = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idUsuario;
      this.http.post<BaseModel2>(`${environment.backend}/documentos/upload/${this.directorioSelect.id}/${idUsuario}`, this.formData, {
        reportProgress: true,
        observe: 'events',
        headers: httpHeaders
      }).pipe(tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.loaded = Math.round(100 * event.loaded / event.total);
          fileDetails.progress = Math.round(0);
        }
      })).subscribe(event => {
        if (event instanceof HttpResponse) {


          fileDetails.progress = this.loaded;
          console.log(event.body.id);
          this.documentoService.add({ name: fileDetails.name, isFolder: false, parent: this.directorioSelect.id.toString(), id: event.body.id });
          this.currentRoot = this.directorioSelect;
          console.log(this.currentRoot.parent);
          if (this.currentRoot && this.currentRoot.parent === 'root') {
            this.currentRoot = null;
            this.canNavigateUp = false;
          } else {
            this.currentRoot = this.documentoService.get(this.currentRoot.parent);
          }
          this.updateFileElementQuery();
          if (this.selectedFiles.item(this.selectedFiles.length - 1) === file) {
            // Invokes fetchFileNames() when last file in the list is uploaded.
            //this.fileService.fetchFileNames();
            console.log('Exito !');
            this.showProgress = true;
            this.uploadedFiles = [];
            this.successMessage();
            this.modal.close();
            this._isLoading$.next(false);
            (document.getElementById('buttonUpload') as HTMLInputElement).disabled = false;
            (document.getElementById('btncancel') as HTMLInputElement).disabled = false;
          }
        }
      });
    });
  }

  updateFileElementQuery() {
    //console.log(this.currentRoot);
    this.fileElements = this.documentoService.queryInFolder(this.currentRoot ? this.currentRoot.id.toString() : 'root');
  }
}
