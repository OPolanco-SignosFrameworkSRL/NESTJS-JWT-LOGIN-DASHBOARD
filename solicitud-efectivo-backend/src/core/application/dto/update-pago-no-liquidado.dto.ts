import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdatePagoNoLiquidadoDto {
  @ApiPropertyOptional({ description: 'Número de desembolso', example: 'DES-2025-0030' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  desembolso_numero?: string;

  @ApiPropertyOptional({ description: 'Monto de la solicitud', example: 2500.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  solicitud_monto?: number;

  @ApiPropertyOptional({ description: 'Monto del desembolso', example: 2500.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  desembolso_monto?: number;

  @ApiPropertyOptional({ description: 'Tipo de pago', example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tipo_pago?: number;

  @ApiPropertyOptional({ description: 'Concepto del pago', example: 'Pago de servicios profesionales' })
  @IsOptional()
  @IsString()
  concepto?: string;

  @ApiPropertyOptional({ description: 'Nombre del beneficiario', example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  beneficiario?: string;

  @ApiPropertyOptional({ description: 'Cédula del beneficiario', example: '40244044852' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cedula?: string;

  @ApiPropertyOptional({ description: 'Estatus del pago', example: 1 })
  @IsOptional()
  @IsInt()
  estatus?: number;

  @ApiPropertyOptional({ description: 'Número de cheque', example: 'CHK-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cheque_no?: string;

  @ApiPropertyOptional({ description: 'Referencia de transferencia', example: 'TRF-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  transferencia_ref?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales', example: 'Notas del pago' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ description: 'ID de la caja', example: 1 })
  @IsOptional()
  @IsInt()
  caja_id?: number;

  @ApiPropertyOptional({ description: 'Cuenta de banco', example: '1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cuenta_banco?: string;
}


