import { Injectable, OnDestroy, Inject, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(@Inject(HttpClient) http) {
    super(http);
  }

// READ
findDocumentos(tableState: ITableState, fil, apa, mo): Observable<TableResponseModel<Documento>> {
    const authData = JSON.parse( localStorage.getItem(this.authLocalStorageToken) );
  console.log("Variable: " + JSON.stringify( authData ))
    this.URL = `${environment.backend}/documento/buscar/${authData.idOrganizacion}/${fil}/${apa}/${mo}/${authData.directorios}/`;

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
    const authData = JSON.parse( localStorage.getItem(this.authLocalStorageToken) );

    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${authData.access_token}`,
    }); 

    return this.http.get(`${environment.backend}/documento/buscar/total/${authData.idOrganizacion}/${filtro}/${authData.directorios}/`, { headers: httpHeaders, })
    .pipe(
      map(response => response as any)
    );
  }


}
