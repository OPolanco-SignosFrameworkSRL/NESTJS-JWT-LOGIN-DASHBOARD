import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean, MinLength, MaxLength, Matches, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Raul',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Vargas',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder 50 caracteres' })
  apellido?: string;

  @ApiProperty({
    description: 'Cédula del usuario',
    example: '40245980129',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @Matches(/^\d{11}$/, { message: 'La cédula debe tener exactamente 11 dígitos' })
  cedula?: string;

  @ApiProperty({
    description: 'Contraseña del usuario (opcional)',
    example: 'nuevaContraseña123',
    required: false,
  })
  @IsOptional()
  @ValidateIf((o) => o.password && o.password.length > 0)
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'Usuario',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  role?: string;

  @ApiProperty({
    description: 'Estado de activación del usuario (1=activo, 0=inactivo)',
    example: 1,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsString({ message: 'El campo valido debe ser 1 o 0' })
  valido?: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  user_email?: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '8091234567',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @ApiProperty({
    description: 'Celular del usuario',
    example: '8091234567',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El celular debe ser una cadena de texto' })
  celular?: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle 123, Ciudad',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccion?: string;
}