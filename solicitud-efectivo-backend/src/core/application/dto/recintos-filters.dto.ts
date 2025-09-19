import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class RecintosFiltersDto {
  @ApiProperty({
    description: 'Filtrar por status de recinto (1=Válidos, 2=Inválidos)',
    example: 1,
    enum: [1, 2],
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El statusId debe ser un número' })
  @Type(() => Number)
  statusId?: number;

  @ApiProperty({
    description: 'Filtrar por nombre de recinto',
    example: 'Sala de Conferencias',
    required: false,
  })
  @IsOptional()
  recinto?: string;

  @ApiProperty({
    description: 'Buscar por término (nombre de recinto o ubicación)',
    example: 'Edificio Principal',
    required: false,
  })
  @IsOptional()
  search?: string;

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
