import { Injectable, OnDestroy, Inject, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../crud-table';
import { Documento } from '../../models/documento.model';
import { FileElement } from '../../models/fileElement.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { v4 } from 'uuid';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';


export interface IFileService {
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable({
  providedIn: 'root',
})

export class DocumentoService extends TableService<Documento> implements OnDestroy, IFileService {
  //valores default para carga inicial
  URL: string;
  public texto = '';
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  public map = new Map<string, FileElement>();


  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  findDocumentos(tableState: ITableState, fil, apa, mo): Observable<TableResponseModel<Documento>> {
    const authData = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    console.log("Variable: " + JSON.stringify(authData))
    this.URL = `${environment.backend}/documentos/buscar/${authData.idOrganizacion}/${fil}/${apa}/${mo}/${authData.directorios}/`;

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${authData.access_token}`,
    });

    return this.http.get<Documento[]>(this.URL, { headers: httpHeaders, }).pipe(
      map((response: Documento[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Documento> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  obtenerTotalDocumentos(filtro): Observable<any> {
    const authData = JSON.parse(localStorage.getItem(this.authLocalStorageToken));

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${authData.access_token}`,
    });

    return this.http.get(`${environment.backend}/documentos/buscar/total/${authData.idOrganizacion}/${filtro}/${authData.directorios}/`, { headers: httpHeaders, })
      .pipe(
        map(response => response as any)
      );
  }

  add(fileElement: FileElement) {
    //fileElement.id = v4();
    this.map.set(fileElement.id.toString(), this.clone(fileElement));
    return fileElement;
  }

  addDirec(fileElement: FileElement) {
    fileElement.id = v4();
    this.map.set(fileElement.id.toString(), this.clone(fileElement));
    return fileElement;
  }


  deleteFile(id: string) {
    this.map.delete(id);
  }

  updateDirectorio(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id.toString(), element);
  }

  private querySubject: BehaviorSubject<FileElement[]>;
  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }

  getAreas(modulo) {
    const idOrg = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idOrganizacion;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const auth = this.getAuthFromLocalStorageTableService();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    const url = `${this.API_URL}/${modulo}/organizacion/${idOrg}`;
    return this.http.get<BaseModel>(url, { headers: httpHeaders }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getDirectoriosByArea(areaSelect, modulo) {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const auth = this.getAuthFromLocalStorageTableService();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    const url = `${this.API_URL}/${modulo}/directoriosPorArea/${areaSelect}`;
    return this.http.get<BaseModel>(url, { headers: httpHeaders }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }


  getDocumentosByArea(areaSelect, modulo) {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const auth = this.getAuthFromLocalStorageTableService();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    const url = `${this.API_URL}/${modulo}/obtenerDocumentosPorArea/${areaSelect}`;
    return this.http.get<BaseModel>(url, { headers: httpHeaders }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  saveDirectorio(modulo, item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const auth = this.getAuthFromLocalStorageTableService();

    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });

    const idUsuario = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idUsuario;
    const idRol = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idRol;
    return this.http.post<BaseModel>(`${this.API_URL}/${modulo}/crear/${idUsuario}/${idRol}`, item, { headers: httpHeaders }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );

  }

  updateRenameDirectorio(modulo, item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const auth = this.getAuthFromLocalStorageTableService();

    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });

    const idUsuario = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idUsuario;
    return this.http.put<BaseModel>(`${this.API_URL}/${modulo}/actualizar/${idUsuario}`, item, { headers: httpHeaders }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );

  }



}
