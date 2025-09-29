import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTipoSolicitudDto {
  @ApiProperty({ description: 'Descripción del tipo de solicitud', example: 'Solicitud de Efectivo' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value, obj }) => value ?? obj?.tipo_desc)
  tipoDesc!: string;

  /* @ApiPropertyOptional({ description: 'Icono del tipo', example: '/AppExt/icons/grid.png' })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => value ?? obj?.tipo_icon)
  tipoIcon?: string; */

  @ApiPropertyOptional({ description: 'Flag de producción', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value, obj }) => {
    const v = value ?? obj?.produccion_flag;
    return v === true || v === 1 || v === '1' || v === 'true';
  })
  produccionFlag?: boolean = false;

  // Campo 'estado' removido para compatibilidad con BD actual
  @ApiPropertyOptional({ description: 'Estado del tipo de solicitud', example: 1, default: 1})
  @IsOptional()
  @IsIn([1, 2])
  @Transform(({ value, obj }) => (value ?? obj?.estado))
  estado?: number;
}



