import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RequestStatusQueryDto {
  @ApiPropertyOptional({ description: 'Número de página', example: 1, minimum: 1 })
  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor o igual a 1' })
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Cantidad de elementos por página', example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filtro por descripción (contiene)', example: 'PENDIENTE' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}


