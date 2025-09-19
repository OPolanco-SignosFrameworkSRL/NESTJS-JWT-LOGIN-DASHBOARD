import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsIn, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class SolicitudEfectivoFiltersDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por status de solicitud',
    example: 1,
    enum: [1, 2, 3, 4, 5, 6],
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El statusId debe ser un número' })
  @IsIn([1, 2, 3, 4, 5, 6], { message: 'Status inválido. Valores permitidos: 1=Pendiente, 2=Aprobada, 3=Autorizado, 4=Rechazada, 5=Desembolsado, 6=Verificada' })
  @Type(() => Number)
  statusId?: number;

  @ApiProperty({
    description: 'Buscar por término (concepto, nombre cliente, número orden, número ticket)',
    example: 'Material oficina',
    required: false,
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filtrar por monto mínimo',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El monto mínimo debe ser un número' })
  @Min(0, { message: 'El monto mínimo debe ser mayor o igual a 0' })
  @Type(() => Number)
  montoMin?: number;

  @ApiProperty({
    description: 'Filtrar por monto máximo',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El monto máximo debe ser un número' })
  @Min(0, { message: 'El monto máximo debe ser mayor o igual a 0' })
  @Type(() => Number)
  montoMax?: number;
}

