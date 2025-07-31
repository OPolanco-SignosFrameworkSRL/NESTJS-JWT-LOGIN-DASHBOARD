import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../common/interfaces/user.interface';

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
    example: 'Vargas',
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
    description: 'Rol del usuario en el sistema',
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
    description: 'Email del usuario',
    example: 'raul.vargas@grupoastro.com.do',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @Length(5, 255, { message: 'El email debe tener entre 5 y 255 caracteres' })
  user_email?: string;

  @ApiProperty({
    description: 'División del usuario',
    example: 'TI',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La división debe ser una cadena de texto' })
  @Length(1, 100, {
    message: 'La división debe tener entre 1 y 100 caracteres',
  })
  division?: string;

  @ApiProperty({
    description: 'Cargo del usuario',
    example: 'Desarrollador',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El cargo debe ser una cadena de texto' })
  @Length(1, 100, { message: 'El cargo debe tener entre 1 y 100 caracteres' })
  cargo?: string;

  @ApiProperty({
    description: 'Dependencia del usuario',
    example: 'Sistemas',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dependencia debe ser una cadena de texto' })
  @Length(1, 100, {
    message: 'La dependencia debe tener entre 1 y 100 caracteres',
  })
  dependencia?: string;

  @ApiProperty({
    description: 'Recinto del usuario',
    example: 'Santo Domingo',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El recinto debe ser una cadena de texto' })
  @Length(1, 100, { message: 'El recinto debe tener entre 1 y 100 caracteres' })
  recinto?: string;

  @ApiProperty({
    description: 'Estado del usuario',
    example: 'ACTIVO',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El estado debe tener entre 1 y 50 caracteres' })
  estado?: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo valido debe ser un valor booleano' })
  valido?: boolean;
}
