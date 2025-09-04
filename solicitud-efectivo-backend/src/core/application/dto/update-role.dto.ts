import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsNumber } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  role_name?: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario con permisos de administración completa',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  role_desc?: string;

  @ApiProperty({
    description: 'ID del status del rol (1=Activo, 2=Inactivo, etc.)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  statusId?: number;
}
