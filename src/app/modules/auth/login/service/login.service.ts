import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { tokenModel } from '../../_models/token.model';
import { TableService } from '../../../../_usys/crud-table';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService extends TableService<tokenModel> implements OnDestroy{

  constructor(
    @Inject(HttpClient) http
  ) {  super(http); }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  
  obtenerToken(correo: string, password: string):Observable<any>{
    
    const urlEndPoint = `${environment.tokenURL}`;
    const credenciales = btoa('usysweb' + ':' + '12345');

    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                                          'Authorization': 'Basic ' + credenciales});

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', correo);
    params.set('password', password);

    return this.http.post(urlEndPoint, params.toString(), {headers: httpHeaders})
  }

  
}

