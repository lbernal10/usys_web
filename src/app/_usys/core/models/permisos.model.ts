

export interface Permisos{

    id: number;
    idRol: number;
    idPermiso: number;
    idModulo: number;
    accionPermiso: String;
    estatusPermiso: number; // Active = 1 | Inactive = 2
    modulo: String;
    habilitado: number;
    idIntermedio: number;
}