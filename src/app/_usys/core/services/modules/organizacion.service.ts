import { Injectable, OnDestroy, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { Organizacion } from '../../models/organizacion.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService  extends TableService<Organizacion> implements OnDestroy{
  URL: string;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
  OnInit(){
    
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Organizacion>> {
    if (JSON.parse( localStorage.getItem('svariable')).userType === 1){
      this.URL = `${environment.backend}/organizacion/listar`;
    }else if(JSON.parse( localStorage.getItem('svariable')).userType === 2){
      this.URL = `${environment.backend}/organizacion/ver/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
    }else{
      this.URL = `${environment.backend}/organizacion/ver/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
      console.log(this.URL)
    }

    return this.http.get<Organizacion[]>(this.URL).pipe(
      map((response: Organizacion[]) => { 
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Organizacion> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        console.log(result)
        return result;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
