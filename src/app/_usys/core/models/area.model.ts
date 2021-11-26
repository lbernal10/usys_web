import { BaseModel } from '../../../_usys/crud-table';

export interface Area
{
  id: number;
  nombre: string;
  estatus: number; // Active = 1 | Suspended = 2 | Pending = 3
  idOrganizacion: number;
}
