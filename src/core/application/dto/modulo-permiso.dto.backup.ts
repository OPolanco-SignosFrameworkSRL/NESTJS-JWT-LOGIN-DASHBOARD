import { IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuloPermisoSimpleDto { @ApiProperty({ description: 'ID del rol', example: 1 }) @IsNumber() idRol: number; @ApiProperty({ description: 'Permiso de visualizaci�n', example: true }) @IsBoolean() ver: boolean; @ApiProperty({ description: 'Permiso de agregar', example: true }) @IsBoolean() agregar: boolean; @ApiProperty({ description: 'Permiso de editar', example: true }) @IsBoolean() editar: boolean; @ApiProperty({ description: 'Permiso de eliminar', example: true }) @IsBoolean() eliminar: boolean; } export class CreateModuloPermisoDto {
  @ApiProperty({ description: 'ID del módulo', example: 1 })
  @IsNumber()
  idModulo: number;

  @ApiProperty({ description: 'Permiso de visualización', example: true })
  @IsBoolean()
  ver: boolean;

  @ApiProperty({ description: 'Permiso de agregar', example: true })
  @IsBoolean()
  agregar: boolean;

  @ApiProperty({ description: 'Permiso de editar', example: true })
  @IsBoolean()
  editar: boolean;

  @ApiProperty({ description: 'Permiso de eliminar', example: true })
  @IsBoolean()
  eliminar: boolean;
}

export class UpdateModuloPermisoDto {
  @ApiProperty({ description: 'ID del módulo', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  idModulo?: number;

  @ApiProperty({ description: 'Permiso de visualización', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ver?: boolean;

  @ApiProperty({ description: 'Permiso de agregar', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  agregar?: boolean;

  @ApiProperty({ description: 'Permiso de editar', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  editar?: boolean;

  @ApiProperty({ description: 'Permiso de eliminar', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  eliminar?: boolean;

  @ApiProperty({ description: 'Estado activo', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  rowActive?: boolean;
}

export class BulkCreateModuloPermisoDto {
  @ApiProperty({ description: 'Array de permisos de módulos', type: [CreateModuloPermisoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuloPermisoDto)
  permisos: CreateModuloPermisoDto[];
}

export class UpdateModuloPermisoByRolDto {
  @ApiProperty({ description: 'ID del módulo', example: 1 })
  @IsNumber()
  idModulo: number;

  @ApiProperty({ description: 'ID del rol', example: 1 })
  @IsNumber()
  idRol: number;

  @ApiProperty({ description: 'Permiso de visualización', example: false })
  @IsBoolean()
  ver: boolean;

  @ApiProperty({ description: 'Permiso de agregar', example: false })
  @IsBoolean()
  agregar: boolean;

  @ApiProperty({ description: 'Permiso de editar', example: true })
  @IsBoolean()
  editar: boolean;

  @ApiProperty({ description: 'Permiso de eliminar', example: true })
  @IsBoolean()
  eliminar: boolean;
}

export class BulkUpdateModuloPermisoDto {
  @ApiProperty({ description: 'Array de permisos de módulos a actualizar', type: [UpdateModuloPermisoByRolDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateModuloPermisoByRolDto)
  permisos: UpdateModuloPermisoByRolDto[];
}

export class GetPermisosByRolDto {
  @ApiProperty({ description: 'ID del rol', example: 1 })
  @IsNumber()
  idRol: number;
}

export class PermisoByRolResponseDto {
  @ApiProperty({ description: 'Nombre del módulo', example: 'Usuarios' })
  modulo: string;

  @ApiProperty({ description: 'ID del rol', example: 1 })
  idRol: number;

  @ApiProperty({ description: 'ID del módulo', example: 1 })
  idModulo: number;

  @ApiProperty({ description: 'Permiso de visualización', example: true })
  ver: boolean;

  @ApiProperty({ description: 'Permiso de agregar', example: true })
  agregar: boolean;

  @ApiProperty({ description: 'Permiso de editar', example: true })
  editar: boolean;

  @ApiProperty({ description: 'Permiso de eliminar', example: true })
  eliminar: boolean;
}

export class ModuloPermisoResponseDto {
  @ApiProperty({ description: 'ID del permiso', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID del módulo', example: 1 })
  idModulo: number;

  @ApiProperty({ description: 'Nombre del módulo', example: 'Usuarios' })
  modulo?: string;

  @ApiProperty({ description: 'Permiso de visualización', example: true })
  ver: boolean;

  @ApiProperty({ description: 'Permiso de agregar', example: true })
  agregar: boolean;

  @ApiProperty({ description: 'Permiso de editar', example: true })
  editar: boolean;

  @ApiProperty({ description: 'Permiso de eliminar', example: true })
  eliminar: boolean;

  @ApiProperty({ description: 'Estado activo', example: true })
  rowActive: boolean;

  @ApiProperty({ description: 'Usuario que creó', example: 1, required: false })
  userAdd?: number;

  @ApiProperty({ description: 'Usuario que modificó', example: 1, required: false })
  userMod?: number;

  @ApiProperty({ description: 'Usuario que eliminó', example: 1, required: false })
  userDel?: number;
}
