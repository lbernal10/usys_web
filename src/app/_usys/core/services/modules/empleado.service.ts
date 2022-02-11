import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { environment } from '../../../../../environments/environment';
import { CustomEmpleado } from '../../models/customEmpleado.models';
import { Observable, of } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class EmpleadoService  extends TableService<CustomEmpleado> implements OnDestroy{
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  URL: string;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CustomEmpleado>> {
    
    const auth = JSON.parse( localStorage.getItem(this.authLocalStorageToken) );
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });

    if (JSON.parse( localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idTipoUsuario === 1){
      //this.URL = `${environment.backend}/empleados/`;
      this.URL = `${environment.backend}/empleados/organizacion/${JSON.parse( localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idOrganizacion}`;
    }else if(JSON.parse( localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idTipoUsuario === 2){
      this.URL = `${environment.backend}/empleados/organizacion/${JSON.parse( localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idOrganizacion}`;
    }else{
      this.URL = `${environment.backend}/empleados/organizacion/${JSON.parse( localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)).idOrganizacion}`;
      console.log(this.URL)
    }

    return this.http.get<CustomEmpleado[]>(this.URL, {headers: httpHeaders}).pipe(
      map((response: CustomEmpleado[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<CustomEmpleado> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  // READ
  findCustomEmpleado(tableState: ITableState): Observable<TableResponseModel<CustomEmpleado>> {
    if (JSON.parse( localStorage.getItem('svariable')).userType === 1){
      this.URL = `${environment.backend}/empleado/listar`;
    }else if(JSON.parse( localStorage.getItem('svariable')).userType === 2){
      this.URL = `${environment.backend}/empleado/organizacion/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
    }else{
      this.URL = `${environment.backend}/empleado/organizacion/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
      console.log(this.URL)
    }

    return this.http.get<CustomEmpleado[]>(this.URL).pipe(
      map((response: CustomEmpleado[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<CustomEmpleado> = {
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
