import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTipoPagoDto {
  @ApiProperty({ description: 'Descripción del tipo de pago', example: 'Efectivo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  tipo_desc!: string;

  @ApiPropertyOptional({ description: 'Estado: 1=Activo, 2=Inactivo', enum: [1, 2], default: 1 })
  @IsOptional()
  @IsIn([1, 2])
  estado?: number = 1;
}


