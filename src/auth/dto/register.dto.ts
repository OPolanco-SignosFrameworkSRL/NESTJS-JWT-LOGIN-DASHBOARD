import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../common/interfaces/user.interface';

export class RegisterDto {
  @ApiProperty({
    description: 'Número de cédula del usuario (11 dígitos)',
    example: '40245980129',
    minLength: 11,
    maxLength: 11,
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula es requerida' })
  @Length(11, 11, { message: 'La cédula debe tener exactamente 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'La cédula debe contener solo números' })
  cedula: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Raul',
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Vargas',
    maxLength: 100,
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @Length(2, 100, {
    message: 'El apellido debe tener entre 2 y 100 caracteres',
  })
  apellido: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 4,
    maxLength: 50,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @Length(4, 50, {
    message: 'La contraseña debe tener entre 4 y 50 caracteres',
  })
  password: string;

  @ApiProperty({
    description: 'Clave dinámica proporcionada por el usuario (requerida)',
    example: 'MiClaveSecreta2024',
    minLength: 1,
  })
  @IsString({ message: 'La clave debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La clave es requerida' })
  clave: string; // Se mantiene el campo 'clave' aquí

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: 'Usuario',
    enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
    default: 'Usuario',
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de: Admin, Usuario, Supervisor, Manager',
  })
  role?: UserRole;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'raul.vargas@grupoastro.com.do',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @Length(5, 255, { message: 'El email debe tener entre 5 y 255 caracteres' })
  user_email?: string;
}
