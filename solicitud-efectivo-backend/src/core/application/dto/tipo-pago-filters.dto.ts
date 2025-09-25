import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TipoPagoFiltersDto {
  @ApiPropertyOptional({ description: 'Buscar por descripción', example: 'Efectivo' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: '1=Activos, 2=Inactivos', enum: [1, 2] })
  @IsOptional()
  @IsIn([1, 2])
  statusId?: number;

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


