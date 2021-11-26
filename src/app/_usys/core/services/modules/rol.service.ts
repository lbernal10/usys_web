import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { Rol } from '../../models/rol.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class RolService  extends TableService<Rol> implements OnDestroy{
  URL: string;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Rol>> {
    if (JSON.parse( localStorage.getItem('svariable')).userType === 1){
      this.URL = `${environment.backend}/rol/listar`;
    }else if(JSON.parse( localStorage.getItem('svariable')).userType === 2){
      this.URL = `${environment.backend}/rol/listarIdOrganizacion/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
    }else{
      this.URL = `${environment.backend}/rol/listarIdOrganizacion/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
      console.log(this.URL)
    }

    return this.http.get<Rol[]>(this.URL).pipe(
      map((response: Rol[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Rol> = {
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
}
