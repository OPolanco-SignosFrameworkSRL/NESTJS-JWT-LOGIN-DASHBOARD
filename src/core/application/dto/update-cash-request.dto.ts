import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CashRequestType, PaymentType, Division } from '../../domain/cash-request.interface';

export class UpdateCashRequestDto {
  @ApiProperty({
    description: 'Monto solicitado',
    example: 3500,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(999999999)
  @Type(() => Number)
  monto_solicitado?: number;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 1,
    enum: CashRequestType,
    required: false,
  })
  @IsOptional()
  @IsEnum(CashRequestType)
  @Type(() => Number)
  solicitud_tipo?: number;

  @ApiProperty({
    description: 'División',
    example: 1,
    enum: Division,
    required: false,
  })
  @IsOptional()
  @IsEnum(Division)
  @Type(() => Number)
  divicionid?: number;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 1,
    enum: PaymentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  @Type(() => Number)
  tipo_pago?: number;

  @ApiProperty({
    description: 'Concepto de la solicitud',
    example: 'Materiales para mantenimiento de equipos',
    required: false,
  })
  @IsOptional()
  @IsString()
  concepto?: string;

  @ApiProperty({
    description: 'Fecha requerida',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  fecha_requerida?: Date;
} 