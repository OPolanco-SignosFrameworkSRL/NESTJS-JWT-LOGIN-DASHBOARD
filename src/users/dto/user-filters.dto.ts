import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../common/interfaces/user.interface';

export class UserFiltersDto {
  @ApiProperty({
    description: 'Rol del usuario para filtrar',
    example: 'Usuario',
    enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de: Admin, Usuario, Supervisor, Manager',
  })
  role?: UserRole;

  @ApiProperty({
    description: 'División del usuario para filtrar',
    example: 'TI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La división debe ser una cadena de texto' })
  division?: string;

  @ApiProperty({
    description: 'Término de búsqueda (nombre, apellido o cédula)',
    example: 'Raul',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  search?: string;

  @ApiProperty({
    description: 'Filtrar por usuarios activos/inactivos',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'El campo active debe ser un valor booleano' })
  active?: boolean;
}
