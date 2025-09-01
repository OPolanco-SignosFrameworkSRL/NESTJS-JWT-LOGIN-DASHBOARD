import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { SolicitudStatus, SolicitudTipo } from '../../domain/solicitud-general.interface';

export class SolicitudGeneralFiltersDto {
  @ApiProperty({
    description: 'ID del usuario solicitante',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  solicitada_porid?: number;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 1,
    enum: SolicitudTipo,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  solicitud_tipo?: number;

  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 1,
    enum: SolicitudStatus,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  solicitud_status?: number;

  @ApiProperty({
    description: 'Departamento',
    example: 'ADMINISTRACION',
    required: false,
  })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Fecha de fin',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Monto mínimo',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minAmount?: number;

  @ApiProperty({
    description: 'Monto máximo',
    example: 10000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxAmount?: number;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  usuarionombre?: string;

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