export interface Directorio{
  id: number;
  expandable: boolean;
  level: number;
  nombre: string;
  isExpanded?: boolean;
  idArea: number;
  bandera?: number;
  idPadre: number;
  habilitado: number;
}