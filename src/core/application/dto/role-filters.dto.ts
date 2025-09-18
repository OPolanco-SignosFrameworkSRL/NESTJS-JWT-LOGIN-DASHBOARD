import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RoleFiltersDto {
  @ApiProperty({
    description: 'Filtrar por nombre de rol',
    example: 'Administrador',
    required: false,
  })
  @IsOptional()
  @IsString()
  role_name?: string;

  @ApiProperty({
    description: 'Filtrar por descripción de rol',
    example: 'administración',
    required: false,
  })
  @IsOptional()
  @IsString()
  role_desc?: string;


  @ApiProperty({
    description: 'Búsqueda general por nombre o descripción',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Número de elementos por página (si no se especifica, trae todos los registros)',
    example: 10,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Filtrar por StatusId específico',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  statusId?: number;
}
