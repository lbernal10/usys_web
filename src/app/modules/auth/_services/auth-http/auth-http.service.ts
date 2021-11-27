import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const credenciales = btoa(`${environment.usuarioToken}` + ':' + `${environment.passwordToken}`);
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + credenciales});

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', email);
    params.set('password', password);

    return this.http.post<AuthModel>(`${environment.tokenURL}`, params.toString(), {headers: httpHeaders});
  }

  getUserByToken(token): Observable<UserModel> {
    const correo = JSON.parse( atob(token.split('.')[1])).user_name;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserModel>(`${environment.backend}/usuarios/detalleLogin/${correo}`, { headers: httpHeaders, });
  }

}
