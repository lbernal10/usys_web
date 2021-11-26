export interface Organizacion {
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
