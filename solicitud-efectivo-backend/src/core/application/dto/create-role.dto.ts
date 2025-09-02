import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Testing',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  role_name: string;

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
    description: 'Indica si el rol está activo',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  valido?: boolean = true;
}