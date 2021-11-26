import { BaseModel } from '../../../_usys/crud-table';

export interface ProductSpecification extends BaseModel {
  id: number;
  carId: number;
  specId: number;
  specName: string;
  value: string;
}
