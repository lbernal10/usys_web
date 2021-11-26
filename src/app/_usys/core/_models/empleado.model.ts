import { BaseModel } from '../../../_usys/crud-table';

export interface Empleado extends BaseModel {
    id: number;
    noEmpleado: string;
    Puesto: string;
    Cargo: string;
    idPersona: number;
    idArea: number;
    idOrganizacion: number;
    
    //atributos persona
    nombre: string;
    apellido_Paterno: string;
    apellido_materno: string;
    genero: number; // H = 1 | M = 2 | O = 3
    fecha_Nacimiento: Date;
  
    //atributos usuario
    correo_Electronico: string;
    fecha_Creacion: Date;
    ultimo_Acceso: Date;
    estatus: number; // Active = 1 | Suspended = 2 | Pending = 3
    idTipo_Usuario: number;
    idEmpleado: number;
    idRol: number;
    password: string;
  
  
  }