import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
import { UserRole } from '../../domain/user.interface';

export class UserFiltersDto {
  @ApiProperty({
    description: 'Filtrar por rol',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser válido' })
  role?: UserRole;

  @ApiProperty({
    description: 'Filtrar por división',
    example: 'TI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La división debe ser una cadena de texto' })
  division?: string;

  @ApiProperty({
    description: 'Buscar por término (nombre, apellido o cédula)',
    example: 'Raul',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  search?: string;

  @ApiProperty({
    description: 'Filtrar solo usuarios activos',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo active debe ser un booleano' })
  active?: boolean;
} 