import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdatePhoneDto {
  @ApiProperty({
    description: 'Número de cédula del usuario',
    example: '40245980129',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula es requerida' })
  cedula: string;

  @ApiProperty({
    description: 'Clave del usuario para validar',
    example: 'MiClaveSecreta2024',
  })
  @IsString({ message: 'La clave debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La clave es requerida' })
  clave: string;

  @ApiProperty({
    description: 'Nuevo número de teléfono',
    example: '8091234567',
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @Length(10, 20, { message: 'El teléfono debe tener entre 9 y 20 caracteres' })
  telefono: string;
} 