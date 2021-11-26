// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import Swal from 'sweetalert2';
import { Directorio } from '../../core/models/directorio.model';
import { environment } from '../../../../environments/environment';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

export abstract class TableService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  protected http: HttpClient;
  // API URL has to be overrided
 // API_URL = `${environment.apiUrl}/endpoint`;
 API_URL = environment.backend;
 MODAL = '';
  constructor(http: HttpClient) {
    this.http = http;
  }

  // CREATE 
  // server should return the object with ID  
  create(item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(`${this.API_URL}/${this.MODAL}/crear/${JSON.parse( localStorage.getItem('svariable')).userID}`, item).pipe(
      tap((res) => {
        this.successMessage();
       }),
      catchError(err => {
        this._errorMessage.next(err);
        this.failedMessage();
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  createParam(item: BaseModel, paramUrl): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(`${this.API_URL}/${paramUrl}/${JSON.parse( localStorage.getItem('svariable')).userID}`, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // READ (Returning filtered list of entities)
  find(tableState: ITableState): Observable<TableResponseModel<T>> {
    const url = this.API_URL +'/'+  this.MODAL + '/listar';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  // READ (Returning filtered list of entities)
  findById(tableState: ITableState, id: number): Observable<TableResponseModel<T>> {
    //const url = this.API_URL +  this.MODAL + '/listarIdOrganizacion/'+id;
    const url = `${this.API_URL}/${this.MODAL}/listarIdOrganizacion/${id}`;
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getItemById(id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${ this.MODAL}/ver/${id}`;
    console.log(url)
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  
  getItemByIdParametroOrganizacion(id: number, paramUrl): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${paramUrl}/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  // UPDATE
  update(item: BaseModel, urlparam?: string): Observable<any> {
    var url;
    if(urlparam){
       url = `${this.API_URL}/${urlparam}${item.id}/${JSON.parse( localStorage.getItem('svariable')).userID}`;
    }else{
       url = `${this.API_URL}/${ this.MODAL}/editar/${item.id}/${JSON.parse( localStorage.getItem('svariable')).userID}`;
    }
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      tap((res) => {
       this.successMessage();
      }),
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
       this.failedMessage();
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE Status
  updateStatusForItems(ids: number[], status: number): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL +'/'+ this.MODAL + '/updateStatus';
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${this.MODAL}/eliminar/${id}/${JSON.parse( localStorage.getItem('svariable')).userID}`;
    return this.http.delete(url).pipe(
      tap((res) => {
        this.successMessage();
       }),
      catchError(err => {
        this._errorMessage.next(err);
        this.failedMessage();
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  deleteCustomModulo(modulo, id: any): Observable<any> {
    /*this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}${modulo}/eliminar/${id}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );*/

    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${modulo}/eliminar/${id}/${JSON.parse( localStorage.getItem('svariable')).userID}`;
    return this.http.delete(url).pipe(
      tap((res) => {
        this.successMessage();
       }),
      catchError(err => {
        this._errorMessage.next(err);
        this.failedMessage();
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  deletePermisoRol(id: any, modulo: string): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${modulo}/eliminarByRol/${id}/${JSON.parse( localStorage.getItem('svariable')).userID}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItems(ids: number[] = []): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/eliminar/${JSON.parse( localStorage.getItem('svariable')).userID}`;
    const body = { ids };
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE SELECTED ITEMS', ids, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  obtenerDocumentos(idOrganizacion, filtro, apartirDe, mostrar): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${environment.backend}/documento/buscar/${idOrganizacion}/${filtro}/${apartirDe}/${mostrar}/`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT' + err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );

  }

// READ (Returning filtered list of entities)
findDocumentos(tableState: ITableState, idOrganizacion?:number, filtro?:string, apartirDe?:number, mostrar?:number): Observable<TableResponseModel<T>> {
  const url = `${environment.backend}/documento/buscar/${idOrganizacion}/${filtro}/${apartirDe}/${mostrar}/`;
  this._errorMessage.next('');
  return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
    catchError(err => {
      this._errorMessage.next(err);
      console.error('FIND ITEMS', err);
      return of({ items: [], total: 0 });
    })
  );
}


  public fetchDocumentos( modulo: string, filtro, apartirDe, mostrar) {
    this.MODAL = modulo;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findDocumentos(this._tableState$.value, filtro, apartirDe, mostrar)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          console.log(res)
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
      this._subscriptions.push(request);
  }
  public fetch( modulo: string) {
    this.MODAL = modulo;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          console.log(res)
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public fetchByIdorganizacion( modulo: string, idOrganizacion) {
    this.MODAL = modulo;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findById(this._tableState$.value,idOrganizacion)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState()
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch( this.MODAL);
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  /**
   * 
   * @param modulo 
   * @returns json entity catalogoModulo
   * @description obtiene listado de tabla dbo.catalago_modulo
   */
  getCatalogo(modulo) {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = this.API_URL +'/'+  modulo + '/listar';
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getPermisosByRolModulo(idModulo: number, idRol: number, paramUrl): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${paramUrl}/${idRol}/${idModulo}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', idModulo+'|'+idRol, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // CREATE int_permiso_rol
  // server should return the object with ID
  createPermisoCheck(modulo, item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(`${this.API_URL}/${modulo}/crear/${JSON.parse( localStorage.getItem('svariable')).userID}`, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items by int_permiso_rol
  deleteItemsPermisoCheck(modulo, id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${modulo}/eliminar/${id}/${JSON.parse( localStorage.getItem('svariable')).userID}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  successMessage(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'La información ha sido guardada con éxito.',
      showConfirmButton: false,
      timer: 2000
    });
  }
  failedMessage(){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'La petición no pudo ser completada.',
      showConfirmButton: false,
      timer: 2000
    });
  }
  

  fetchCustomEmpleado(modulo: string){
    this.MODAL = modulo;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findCustomEmpleado(this._tableState$.value)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          console.log(res.items);
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  
  // READ (Returning filtered list of entities)
  findCustomEmpleado(tableState: ITableState): Observable<TableResponseModel<T>> {
    const url = this.API_URL +'/'+ this.MODAL + '/listarCustomEmpleado';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  // CREATE
  // server should return the object with ID
  createGeneral(modulo,item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(`${this.API_URL}/${modulo}/crear/${JSON.parse( localStorage.getItem('svariable')).userID}`, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  addNumEmpleado(modulo,item: number, idOrganizacion: number): Observable<any> {
    const url = `${this.API_URL}/${modulo}/numeroEmpleado/${idOrganizacion}/${item}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getItemByIdCustom(modulo, id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${modulo}/ver/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getItemByIdCustomGeneral(modulo: string,apiaction :string, id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${modulo}/${apiaction}/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  
  updateCustomModal(modulo, item: BaseModel): Observable<any> {
    const url = `${this.API_URL}/${modulo}/editar/${item.id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getDirectorios(idModulo: number, idRol: number, paramUrl){
    console.log(`${this.API_URL}/${paramUrl}/${idModulo}/${idRol}`);
    return this.http.get<Directorio[]>(`${this.API_URL}/${paramUrl}/${idModulo}/${idRol}`)
/*
    this._isLoading$.next(true);
    this._errorMessage.next('');
    //const url = `http://localhost:8080/api/CatalogoPermiso/verPermisosPorRolModulo/${idRol}/${idModulo}`;
    const url = `${this.API_URL}${paramUrl}/${idRol}/${idModulo}`;
    return this.http.get(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', idModulo+'|'+idRol, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );*/
  }

}
