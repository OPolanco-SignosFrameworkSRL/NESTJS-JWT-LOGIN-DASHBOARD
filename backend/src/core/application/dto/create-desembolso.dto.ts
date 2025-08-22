import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsPositive, Max, Min, IsNotEmpty } from 'class-validator';

export class CreateDesembolsoDto {
  @ApiProperty({
    description: 'ID de la solicitud autorizada',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  solicitud_id: number;

  @ApiProperty({
    description: 'ID del responsable del desembolso',
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  responsable_id: number;

  @ApiProperty({
    description: 'Cédula de identidad del responsable',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  cedula_identidad: string;

  @ApiProperty({
    description: 'ID de la división',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  division_id: number;

  @ApiProperty({
    description: 'ID del método de pago',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  metodo_pago_id: number;

  @ApiProperty({
    description: 'Monto del desembolso (no puede exceder el monto solicitado)',
    example: 3500,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  monto_desembolso: number;

  @ApiProperty({
    description: 'Número de cheque (si aplica)',
    example: 'CHK-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  numero_cheque?: string;

  @ApiProperty({
    description: 'Referencia del desembolso',
    example: 'REF-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiProperty({
    description: 'Observaciones del desembolso',
    example: 'Desembolso por materiales de oficina',
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
