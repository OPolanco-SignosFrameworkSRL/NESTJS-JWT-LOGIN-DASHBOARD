import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';
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
  requestedAmount?: number;

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
    description: 'División',
    example: 'ADMINISTRACION',
    enum: Division,
    required: false,
  })
  @IsOptional()
  @IsEnum(Division)
  division?: string;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 'EFECTIVO',
    enum: PaymentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: string;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Materiales para mantenimiento de equipos',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
} 