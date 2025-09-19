import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  Matches,
  IsEmail,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {  } from '../../domain/user.interface';

class RoleUpdateDto {
  @ApiProperty({ description: 'ID del rol', example: 1 })
  @IsOptional()
  id?: number;

  @ApiProperty({ 
    description: 'Nombre del rol (opcional)', 
    example: 'maracuya',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  roleName?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Raul',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Enriquez',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @Length(2, 100, {
    message: 'El apellido debe tener entre 2 y 100 caracteres',
  })
  apellido?: string;

  @ApiProperty({
    description: 'Número de cédula del usuario (11 dígitos)',
    example: '40245980129',
    minLength: 11,
    maxLength: 11,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @Length(11, 11, { message: 'La cédula debe tener exactamente 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'La cédula debe contener solo números' })
  cedula?: string;

  @ApiProperty({
    description: 'Roles del usuario (array de objetos con ID de rol)',
    type: [RoleUpdateDto],
    example: [{ id: 1 }, { id: 2 }, { id: 3, roleName: 'maracuya' }],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Los roles deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => RoleUpdateDto)
  roles?: RoleUpdateDto[];

  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'nuevaContraseña123',
    minLength: 4,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Length(4, 50, {
    message: 'La contraseña debe tener entre 4 y 50 caracteres',
  })
  password?: string;

 /*  @ApiProperty({
    description: 'Rol del usuario en el sistema (para compatibilidad)',
    enum: ,
    example: 'Usuario',
    required: false,
  })
  @IsOptional()
  @IsEnum(, { message: 'El rol debe ser uno de los valores permitidos' })
  role?: ; */

  @ApiProperty({
    description: 'Email del usuario',
    example: 'pedro@gmail.com',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @Length(5, 255, { message: 'El email debe tener entre 5 y 255 caracteres' })
  user_email?: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '04145980129',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(10, 20, { message: 'El teléfono debe tener entre 10 y 20 caracteres' })
  telefono?: string;

  @ApiProperty({
    description: 'Número de celular del usuario',
    example: '04145980129',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El celular debe ser una cadena de texto' })
  @Length(10, 20, { message: 'El celular debe tener entre 10 y 20 caracteres' })
  celular?: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle 123, Ciudad',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Length(5, 255, { message: 'La dirección debe tener entre 5 y 255 caracteres' })
  direccion?: string;

  @ApiProperty({
    description: 'Estado de validez del usuario',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'valida debe ser un valor booleano (true/false)' })
  valida?: boolean;
}