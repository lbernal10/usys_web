export class AuthModel {
  access_token: string;
  refresh_token: string;
  expires_in: Date;

  setAuth(auth: any) {
    this.access_token = auth.access_token;
    this.refresh_token = auth.refresh_token;
    this.expires_in = auth.expires_in;
  }
}
