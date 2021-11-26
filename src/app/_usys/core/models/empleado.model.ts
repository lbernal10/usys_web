import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";
import { Area } from "./area.model";

export interface Empleado {
  id: number;
  numeroEmpleado: string;
  puesto: string;
  cargo: string;
  idPersona: number;
  idArea: number;
  estatus: number;
}
