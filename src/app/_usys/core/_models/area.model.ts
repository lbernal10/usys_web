import { BaseModel } from '../../../_usys/crud-table';

export interface Area extends BaseModel {
  id: number;
  descripcion: string;
  status: number; // Active = 1 | Suspended = 2 | Pending = 3
}
