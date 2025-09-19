import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
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
  @Type(() => Number)
  monto_solicitado: number;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 3,
    enum: CashRequestType,
  })
  @IsEnum(CashRequestType)
  @Type(() => Number)
  solicitud_tipo: number;

  @ApiProperty({
    description: 'División',
    example: 1,
    enum: Division,
  })
  @IsEnum(Division)
  @Type(() => Number)
  divicionid: number;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 1,
    enum: PaymentType,
  })
  @IsEnum(PaymentType)
  @Type(() => Number)
  tipo_pago: number;

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

  @ApiProperty({
    description: 'Departamento',
    example: 'Administración',
    required: false,
  })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Cliente ABC',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombre_cliente?: string;

  @ApiProperty({
    description: 'Número de orden de producción',
    example: 'OP-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  num_orden_prod?: string;

  @ApiProperty({
    description: 'Número de ticket de producción',
    example: 'TK-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  num_ticket_prod?: string;
} 