import { Estado } from "./estado.modal";

export interface Municipio{
    id: number;
    clave: string;
    estatus: number;
    id_estado: number;
    estado?: Estado
}