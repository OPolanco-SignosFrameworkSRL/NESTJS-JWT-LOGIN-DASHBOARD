import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString, IsArray, IsOptional, Min, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntegranteDto {
  @ApiProperty({
    description: 'Nombre completo del empleado',
    example: 'Juan Pérez'
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: 'Cédula del empleado',
    example: 40208712477
  })
  @IsNumber()
  cedula: number;

  @ApiProperty({
    description: 'Nombre del beneficiario',
    example: 'María García'
  })
  @IsString()
  @IsNotEmpty()
  beneficiario: string;

  @ApiProperty({
    description: 'Monto asignado',
    example: 50000
  })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiProperty({
    description: 'Tarea asignada',
    example: 'Revisar documentación',
    required: false
  })
  @IsOptional()
  @IsString()
  tareaAsignada?: string;
}

export class CreateSolicitudDto {
  @ApiProperty({
    description: 'Monto solicitado',
    example: 3500
  })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiProperty({
    description: 'ID del tipo de solicitud',
    example: 2,
    enum: [2, 3, 4, 5, 6, 7, 9]
  })
  @IsNumber()
  tipoSolicitudId: number;

  @ApiProperty({
    description: 'ID de la división',
    example: 1,
    enum: [1, 2, 3, 4]
  })
  @IsNumber()
  divisionId: number;

  @ApiProperty({
    description: 'Fecha de la orden',
    example: '2024-01-15'
  })
  @IsDateString()
  fechaOrden: string;

  @ApiProperty({
    description: 'Número de orden',
    example: 10005
  })
  @IsNumber()
  numeroOrden: number;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Empresa ABC'
  })
  @IsString()
  nombreCliente: string;

  @ApiProperty({
    description: 'Número de ticket',
    example: 12345
  })
  @IsNumber()
  numeroTicket: number;

  @ApiProperty({
    description: 'Concepto de la solicitud',
    example: 'Pago de servicios de mantenimiento'
  })
  @IsString()
  @IsNotEmpty()
  concepto: string;

  @ApiProperty({
    description: 'Lista de integrantes del desembolso',
    type: [CreateIntegranteDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIntegranteDto)
  integrantes: CreateIntegranteDto[];
}