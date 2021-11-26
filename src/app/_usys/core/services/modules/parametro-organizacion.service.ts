import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { ParametroOrganizacion } from '../../models/parametro-organizacion.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParametroOrganizacionService  extends TableService<ParametroOrganizacion> implements OnDestroy{
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<ParametroOrganizacion>> {
    return this.http.get<ParametroOrganizacion[]>(`${environment.backend}/ParametroOrganizacion/listar`).pipe(
      map((response: ParametroOrganizacion[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<ParametroOrganizacion> = {
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
