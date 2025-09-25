import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTipoPagoDto {
  @ApiPropertyOptional({ description: 'Descripción del tipo de pago' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  tipo_desc?: string;

  @ApiPropertyOptional({ description: 'Estado: 1=Activo, 2=Inactivo', enum: [1, 2] })
  @IsOptional()
  @IsIn([1, 2])
  estado?: number;
}


