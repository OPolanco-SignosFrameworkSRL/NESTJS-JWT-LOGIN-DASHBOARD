import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Número de cédula del usuario',
    example: '40245980129',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula es requerida' })
  cedula: string;

  @ApiProperty({
    description: 'Contraseña del usuario (puede ser hash SHA-256 o contraseña normal)',
    example: 'password123',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
} 