import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { environment } from '../../../../../environments/environment';

import { Observable, of } from 'rxjs';
import { BaseModel } from '../../models/base.model';

@Injectable({
  providedIn: 'root',
})
export class SelectService  extends TableService<any> implements OnDestroy{
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
 
  getAllItems(lista: string): Observable<BaseModel> {
    const auth = JSON.parse( localStorage.getItem(this.authLocalStorageToken) );
    if (!auth || !auth.access_token) {
      return of(undefined);
    } 
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });

    const url = `${environment.backend}/${lista}/`;
    return this.http.get<BaseModel>(url,{headers: httpHeaders});
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
