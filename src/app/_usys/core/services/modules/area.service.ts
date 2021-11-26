import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { Area } from '../../models/area.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: "root",
})
export class AreaService  extends TableService<Area> implements OnDestroy{
  URL: string;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Area>> {
    if (JSON.parse( localStorage.getItem('svariable')).userType === 1){
      this.URL = `${environment.backend}/area/listar`;
    }else if(JSON.parse( localStorage.getItem('svariable')).userType === 2){
      this.URL = `${environment.backend}/area/organizacion/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
    }else{
      this.URL = `${environment.backend}/area/organizacion/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
      console.log(this.URL)
    }

    return this.http.get<Area[]>(this.URL).pipe(
      map((response: Area[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Area> = {
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
