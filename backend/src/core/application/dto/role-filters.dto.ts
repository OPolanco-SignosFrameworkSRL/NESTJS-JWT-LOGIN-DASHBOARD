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
    description: 'Filtrar por estado (activo/inactivo)',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  valido?: boolean;

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
  page?: number = 1;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
