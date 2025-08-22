import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { UserRole } from '../../domain/user.interface';
import { Type } from 'class-transformer';

export class UserFiltersDto {
  @ApiProperty({
    description: 'Filtrar por rol',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser válido' })
  role?: UserRole;

  @ApiProperty({
    description: 'Filtrar por división',
    example: 'TI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La división debe ser una cadena de texto' })
  division?: string;

  @ApiProperty({
    description: 'Buscar por término (nombre, apellido o cédula)',
    example: 'Raul',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  search?: string;

  @ApiProperty({
    description: 'Filtrar solo usuarios activos',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo active debe ser un booleano' })
  active?: boolean;

  // Campos de paginación
  @ApiProperty({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor o igual a 1' })
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  @Type(() => Number)
  limit?: number = 10;
} 