import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PagoNoLiquidadoQueryDto {
  @ApiProperty({
    description: 'Buscar en número de desembolso y beneficiario',
    example: 'DES-2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtrar por nombre de división',
    example: 'Finanzas',
    required: false,
  })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiProperty({
    description: 'Estado del pago',
    example: 'Activo',
    enum: ['Activo', 'Cancelado'],
    default: 'Activo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['Activo', 'Cancelado'])
  @Transform(({ value }) => value || 'Activo')
  estado?: string = 'Activo';

  @ApiProperty({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value) || 1)
  page?: number = 1;

  @ApiProperty({
    description: 'Tamaño de página',
    example: 10,
    minimum: 1,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value) || 10)
  pageSize?: number = 10;
}
