import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, IsEnum, Min, Max, IsInt } from 'class-validator';
import { CashRequestStatus, CashRequestType, PaymentType, Division } from '../../domain/cash-request.interface';
import { Type } from 'class-transformer';

export class CashRequestFiltersDto {
  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 1,
    enum: CashRequestStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(CashRequestStatus)
  @Type(() => Number)
  status?: number;

  @ApiProperty({
    description: 'División',
    example: 1,
    enum: Division,
    required: false,
  })
  @IsOptional()
  @IsEnum(Division)
  @Type(() => Number)
  division?: number;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 1,
    enum: CashRequestType,
    required: false,
  })
  @IsOptional()
  @IsEnum(CashRequestType)
  @Type(() => Number)
  requestType?: number;

  @ApiProperty({
    description: 'ID del usuario que solicitó',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  requestedBy?: number;

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