import { AuthModel } from "src/app/modules/auth/_models/auth.model";

export interface Organizacion extends AuthModel {
  id: number;
  razonSocial: string;
  rfc: string;
  direccion: string;
  codigoPostal: string;
  telefono: string;
  celular: string;
  idMunicipio: number;
  estado?: number;
  estatus: number;
  fechaCreacion: Date;
  rubro: string;
  web: string;
}
