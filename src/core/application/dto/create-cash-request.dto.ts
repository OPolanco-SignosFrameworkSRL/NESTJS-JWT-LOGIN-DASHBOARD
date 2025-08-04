import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { CashRequestType, PaymentType, Division } from '../../domain/cash-request.interface';

export class CreateCashRequestDto {
  @ApiProperty({
    description: 'Monto solicitado',
    example: 3500,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Max(999999999)
  requestedAmount: number;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 'COMPRA DE MATERIALES',
    enum: CashRequestType,
  })
  @IsEnum(CashRequestType)
  requestType: string;

  @ApiProperty({
    description: 'División',
    example: 'ADMINISTRACION',
    enum: Division,
  })
  @IsEnum(Division)
  division: string;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 'EFECTIVO',
    enum: PaymentType,
  })
  @IsEnum(PaymentType)
  paymentType: string;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Materiales para mantenimiento de equipos',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
} 