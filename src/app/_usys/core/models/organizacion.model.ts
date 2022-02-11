import { AuthModel } from "src/app/modules/auth/_models/auth.model";
import { Municipio } from "./municipio.model";

export interface Organizacion extends AuthModel {
  id: number;
  razonSocial: string;
  rfc: string;
  direccion: string;
  codigoPostal: string;
  telefono: string;
  celular: string;
  idEstado: number;
  estatus: number;
  fechaCreacion: Date;
  rubro: string;
  web: string;
  idMunicipio: number;
  idParametroOrganizacion: number;
  municipio?: Municipio
  
}
