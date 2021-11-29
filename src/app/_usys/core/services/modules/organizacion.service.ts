import { Injectable, OnDestroy, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { Organizacion } from '../../models/organizacion.model';
import { Observable, of } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../../../modules/auth/_models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService  extends TableService<Organizacion> implements OnDestroy{
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  URL: string;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
  OnInit(){
    
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Organizacion>> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    if (JSON.parse( localStorage.getItem('svariable')).userType === 1){
      this.URL = `${environment.backend}/organizaciones/`;
    }else if(JSON.parse( localStorage.getItem('svariable')).userType === 2){
      this.URL = `${environment.backend}/organizaciones/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
    }else{
      this.URL = `${environment.backend}/organizaciones/${JSON.parse( localStorage.getItem('svariable')).orgID}`;
      console.log(this.URL)
    }

    return this.http.get<Organizacion[]>(this.URL,{headers: httpHeaders}).pipe(
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

  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse( localStorage.getItem(this.authLocalStorageToken) );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
