import { Injectable, OnDestroy, Inject, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../crud-table';
import { Documento } from '../../models/documento.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService  extends TableService<Documento> implements OnDestroy{
  //valores default para carga inicial
  URL: string;
  public texto = '';
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

// READ
findDocumentos(tableState: ITableState, fil, apa, mo): Observable<TableResponseModel<Documento>> {
    this.URL = `${environment.backend}/documento/buscar/${JSON.parse( localStorage.getItem('svariable')).idOrganizacion}/${fil}/${apa}/${mo}/${JSON.parse( localStorage.getItem('svariable')).directorios}/`;
    return this.http.get<Documento[]>(this.URL).pipe(
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
    return this.http.get(`${environment.backend}/documento/buscar/total/${JSON.parse( localStorage.getItem('svariable')).orgID}/${filtro}/${JSON.parse( localStorage.getItem('svariable')).directory}/`)
    .pipe(
      map(response => response as any)
    );
  }


}
