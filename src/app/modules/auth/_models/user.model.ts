import { AuthModel } from './auth.model';
import { modulosModel } from './modulos.modal';
import { personaModel } from './persona.modal';
import { empleadoModel } from './empleado.modal.';
import { usuarioModel } from './usuario.model';
import { organizacionModel } from './organizacion.model';

export class UserModel extends AuthModel {
  directorios: number[];
  modulos: modulosModel;
  persona: personaModel;
  empleado: empleadoModel;
  usuario: usuarioModel;
  organizacion: organizacionModel;
  
}
