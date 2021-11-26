import { rolesModel } from "./roles.model";
import { tipoUsuarioModel } from "./tipoUsuario.model";

export class usuarioModel {
    id: number;
    correo: string;
    fechaCreacion: Date;
    ultimoAcceso: Date;
    estatus: boolean;
    tipoUsuario: tipoUsuarioModel;
    idEmpleado: number;
    roles: rolesModel;
  }
  