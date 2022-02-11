import { AuthModel } from "src/app/modules/auth/_models/auth.model";

export interface CustomEmpleado extends AuthModel{

    idUsuario: number;
    idEmpleado: number;
    idPersona: number;
    numEmpleado: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    estatus: number;
    razonSocial: string;
    nombreArea: string;

}