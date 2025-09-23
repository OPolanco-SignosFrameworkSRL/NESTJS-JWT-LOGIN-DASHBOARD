import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TipoSolicitudFiltersDto {
  @ApiPropertyOptional({ description: 'Buscar por descripción', example: 'Efectivo' })
  @IsOptional()
  @IsString()
  search?: string;

  // Filtro statusId removido (no existe columna 'estado' en BD)

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}



