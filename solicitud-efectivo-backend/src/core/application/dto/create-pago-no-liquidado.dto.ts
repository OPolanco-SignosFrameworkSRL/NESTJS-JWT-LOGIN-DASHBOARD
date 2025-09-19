import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreatePagoNoLiquidadoDto {
  @ApiProperty({ description: 'Número de desembolso', example: 'DES-2025-0030' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  desembolso_numero: string;

  @ApiProperty({ description: 'ID de la solicitud', example: 1 })
  @IsInt()
  @IsPositive()
  solicitud_id: number;

  @ApiProperty({ description: 'Monto de la solicitud', example: 2500.0 })
  @IsNumber()
  @IsPositive()
  solicitud_monto: number;

  @ApiProperty({ description: 'Monto del desembolso', example: 2500.0 })
  @IsNumber()
  @IsPositive()
  desembolso_monto: number;

  @ApiProperty({ description: 'Tipo de pago', example: 1 })
  @IsInt()
  @IsPositive()
  tipo_pago: number;

  @ApiProperty({ description: 'Concepto del pago', example: 'Pago de servicios profesionales' })
  @IsString()
  @IsNotEmpty()
  concepto: string;

  @ApiProperty({ description: 'Nombre del beneficiario', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  beneficiario: string;

  @ApiProperty({ description: 'Cédula del beneficiario', example: '40244044852' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  cedula: string;

  @ApiProperty({ description: 'Estatus del pago', example: 1, required: false })
  @IsOptional()
  @IsInt()
  estatus?: number;

  @ApiProperty({ description: 'Número de cheque', example: 'CHK-001', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cheque_no?: string;

  @ApiProperty({ description: 'Referencia de transferencia', example: 'TRF-001', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  transferencia_ref?: string;

  @ApiProperty({ description: 'Notas adicionales', example: 'Notas del pago', required: false })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({ description: 'ID de la caja', example: 1, required: false })
  @IsOptional()
  @IsInt()
  caja_id?: number;

  @ApiProperty({ description: 'Cuenta de banco', example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cuenta_banco?: string;
}


