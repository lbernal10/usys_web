export class tokenModel {

    accessToken: string;
    tokenTyp: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    directorios: number[];
    //modulos: string[];
    numeroEmpleado: string;
    organizacion: number;
    nombreOrganizacion: string;
    usuario: number;
    nombreUsuario: string;
    jti: string;

    setAuth(token: any) {
        this.accessToken = token.accessToken;
        this.refreshToken = token.refreshToken;
        this.expiresIn = token.expiresIn;
      }
  }
  