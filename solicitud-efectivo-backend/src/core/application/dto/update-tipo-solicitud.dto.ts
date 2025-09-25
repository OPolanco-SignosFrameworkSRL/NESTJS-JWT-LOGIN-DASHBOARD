import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTipoSolicitudDto {
  @ApiPropertyOptional({ description: 'Descripción del tipo de solicitud' })
  @IsOptional()
  @IsString()
  tipoDesc?: string;

  @ApiPropertyOptional({ description: 'Icono del tipo' })
  @IsOptional()
  @IsString()
  tipoIcon?: string;

  @ApiPropertyOptional({ description: 'Flag de producción' })
  @IsOptional()
  @IsBoolean()
  produccionFlag?: boolean;

  // Campo 'estado' removido para compatibilidad con BD actual
}



