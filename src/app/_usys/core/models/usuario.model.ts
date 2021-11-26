import { Empleado } from "./empleado.model";
import { Rol } from "./rol.model";
import { tipoUsuario } from "./tipoUsuario.model";

export interface Usuario{
    id: number;
    correo: string;
    contrasenia: string;
    fechaCreacion: Date;
    ultimoAcceso: Date;
    estatus: number;
    idTipoUsuario: number;
    idEmpleado: number;
    idRol: number;
}