import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { CashRequestStatus, CashRequestType, PaymentType, Division } from '../../domain/cash-request.interface';
import { Type } from 'class-transformer';

export class CashRequestFiltersDto {
  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 'PENDIENTE',
    enum: CashRequestStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(CashRequestStatus)
  status?: string;

  @ApiProperty({
    description: 'División',
    example: 'ADMINISTRACION',
    enum: Division,
    required: false,
  })
  @IsOptional()
  @IsEnum(Division)
  division?: string;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 'COMPRA DE MATERIALES',
    enum: CashRequestType,
    required: false,
  })
  @IsOptional()
  @IsEnum(CashRequestType)
  requestType?: string;

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
} 