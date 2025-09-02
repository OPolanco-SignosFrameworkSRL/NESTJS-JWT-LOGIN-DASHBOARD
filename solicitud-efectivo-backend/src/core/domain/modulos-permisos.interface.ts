export interface IModuloPermiso {
  id: number;
  idModulo: number;
  ver: boolean;
  agregar: boolean;
  editar: boolean;
  eliminar: boolean;
  rowActive: boolean;
  userAdd?: number;
  userMod?: number;
  userDel?: number;
}

export interface IModuloPermisoCreateData {
  idModulo: number;
  ver: boolean;
  agregar: boolean;
  editar: boolean;
  eliminar: boolean;
}

export interface IModuloPermisoUpdateData {
  idModulo?: number;
  ver?: boolean;
  agregar?: boolean;
  editar?: boolean;
  eliminar?: boolean;
  rowActive?: boolean;
}

export interface IModuloPermisoResponse {
  id: number;
  idModulo: number;
  modulo?: string; // Nombre del módulo
  ver: boolean;
  agregar: boolean;
  editar: boolean;
  eliminar: boolean;
  rowActive: boolean;
  userAdd?: number;
  userMod?: number;
  userDel?: number;
}

export interface IModuloPermisoFilters {
  idModulo?: number;
  ver?: boolean;
  agregar?: boolean;
  editar?: boolean;
  eliminar?: boolean;
  active?: boolean;
  page?: number;
  limit?: number;
}
