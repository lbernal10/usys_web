import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { environment } from '../../../../../environments/environment';

import { Observable } from 'rxjs';
import { BaseModel } from '../../models/base.model';

@Injectable({
  providedIn: 'root',
})
export class SelectService  extends TableService<any> implements OnDestroy{
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
 
  getAllItems(lista: string): Observable<BaseModel> { 
    const url = `${environment.backend}/${lista}/listar`;
    return this.http.get<BaseModel>(url);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
