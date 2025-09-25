import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTipoSolicitudDto {
  @ApiProperty({ description: 'Descripción del tipo de solicitud', example: 'Solicitud de Efectivo' })
  @IsString()
  @IsNotEmpty()
  tipoDesc!: string;

  @ApiPropertyOptional({ description: 'Icono del tipo', example: '/AppExt/icons/grid.png' })
  @IsOptional()
  @IsString()
  tipoIcon?: string;

  @ApiPropertyOptional({ description: 'Flag de producción', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  produccionFlag?: boolean = false;

  // Campo 'estado' removido para compatibilidad con BD actual
}



