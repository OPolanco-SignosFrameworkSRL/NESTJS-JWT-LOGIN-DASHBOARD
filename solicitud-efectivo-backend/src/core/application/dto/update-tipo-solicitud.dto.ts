import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTipoSolicitudDto {
  @ApiPropertyOptional({ description: 'Descripción del tipo de solicitud' })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj?.tipo_desc)
  tipoDesc?: string;

  /* @ApiPropertyOptional({ description: 'Icono del tipo' })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj?.tipo_icon)
  tipoIcon?: string;
 */
  @ApiPropertyOptional({ description: 'Flag de producción' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value, obj }) => {
    const v = value ?? obj?.produccion_flag;
    return v === true || v === 1 || v === '1' || v === 'true';
  })
  produccionFlag?: boolean;

  // Campo 'estado' removido para compatibilidad con BD actual
  @ApiPropertyOptional({ description: 'Estado del tipo de solicitud' })
  @IsOptional()
  @IsIn([1, 2])
  @Transform(({ value, obj }) => (value ?? obj?.estado))
  estado?: number;
}



