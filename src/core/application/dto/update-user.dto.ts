import { ApiProperty } from '@nestjs/swagger';
/*
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  Length,
} from 'class-validator';
import { UserRole } from '../../domain/user.interface';
*/
import { IsOptional, IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    /*
    example: 'Raul',
    maxLength: 100,
    */ 
    example: 'Raul',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  /*
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  */
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    /*
    example: 'Vargas',
    maxLength: 100,
    */
    example: 'Enriquez',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
/*
@Length(2, 100, { message: 'El apellido debe tener entre 2 y 100 caracteres' }) 
*/
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder 50 caracteres' })
  apellido?: string;

  @ApiProperty({
    /*
    description: 'Rol del usuario en el sistema',
    example: 'Usuario',
    enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
    */description: 'Cédula del usuario',
    example: '40245980129',
    required: false,
  })
  @IsOptional()
  /*
  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de: Admin, Usuario, Supervisor, Manager',
  })
  role?: UserRole;
  */
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @Matches(/^\d{11}$/, { message: 'La cédula debe tener exactamente 11 dígitos' })
  cedula?: string;

  @ApiProperty({
    /*
    description: 'Email del usuario',
    example: 'raul.vargas@grupoastro.com.do',
    maxLength: 255,
    */description: 'Contraseña del usuario (opcional)',
    example: 'nuevaContraseña123',
    required: false,
  })
  @IsOptional()
  /*
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @Length(5, 255, { message: 'El email debe tener entre 5 y 255 caracteres' })
  user_email?: string;
  */@IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiProperty({
    /*
    description: 'Número de teléfono del usuario',
    example: '8091234567',
    maxLength: 20,
    */description: 'Rol del usuario',
    example: 'Usuario',
    required: false,
  })
  @IsOptional()
  /*
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(10, 20, { message: 'El teléfono debe tener entre 10 y 20 caracteres' })
  telefono?: string;
  */@IsString({ message: 'El rol debe ser una cadena de texto' })
  role?: string;

  @ApiProperty({
    /*
    description: 'Dirección del usuario',
    example: 'Calle Principal #123',
    maxLength: 255,
    */description: 'Email del usuario',
    example: 'pedro@gmail.com',
    required: false,
  })
  @IsOptional()
  /*
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Length(5, 255, { message: 'La dirección debe tener entre 5 y 255 caracteres' })
  direccion?: string;
  */
 @IsEmail({}, { message: 'Debe ser un email válido' })
  user_email?: string;

  @ApiProperty({
    /*
    description: 'Número de celular del usuario',
    example: '8091234567',
    maxLength: 20,
    */
   description: 'Teléfono del usuario',
    example: '04145980129',
    required: false,
  })
  @IsOptional()
/*
@IsString({ message: 'El celular debe ser una cadena de texto' })
  @Length(10, 20, { message: 'El celular debe tener entre 10 y 20 caracteres' })
  celular?: string;
*/  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @ApiProperty({
/*
description: 'Estado del usuario',
    example: 1, 
*/    description: 'Celular del usuario',
    example: '04145980129',
    required: false,
  })
  @IsOptional()
  /*
   @IsNumber({}, { message: 'El estado debe ser un número' })
  user_status?: number;
  */
  @IsString({ message: 'El celular debe ser una cadena de texto' })
  celular?: string;

  @ApiProperty({
/*
 description: 'ID de la caja asignada',
    example: '1',
    maxLength: 50,
*/    description: 'Dirección del usuario',
    example: 'Calle 123, Ciudad',
    required: false,
  })
  @IsOptional()

/*
@IsString({ message: 'El ID de caja debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El ID de caja debe tener entre 1 y 50 caracteres' })
  caja_id?: string;
  @ApiProperty({
    description: 'ID de la tienda asignada',
    example: '1',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El ID de tienda debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El ID de tienda debe tener entre 1 y 50 caracteres' })
  tienda_id?: string;

  @ApiProperty({
    description: 'Permite múltiples tiendas (0=No, 1=Sí)',
    example: '0',
    maxLength: 1,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo allow_multi_tienda debe ser una cadena de texto' })
  @Length(1, 1, { message: 'El campo allow_multi_tienda debe tener exactamente 1 carácter' })
  allow_multi_tienda?: string;

  @ApiProperty({
    description: 'Descuento máximo permitido',
    example: '10.5',
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El descuento máximo debe ser una cadena de texto' })
  @Length(1, 10, { message: 'El descuento máximo debe tener entre 1 y 10 caracteres' })
  max_descuento?: string;

  @ApiProperty({
    description: 'Permite cerrar caja (0=No, 1=Sí)',
    example: '0',
    maxLength: 1,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo close_caja debe ser una cadena de texto' })
  @Length(1, 1, { message: 'El campo close_caja debe tener exactamente 1 carácter' })
  close_caja?: string;

  @ApiProperty({
    description: 'Email de la cuenta del usuario',
    example: 'usuario@email.com',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email de cuenta debe tener un formato válido' })
  @Length(5, 255, { message: 'El email de cuenta debe tener entre 5 y 255 caracteres' })
  user_account_email?: string;

  @ApiProperty({
    description: 'Contraseña del email de la cuenta',
    example: 'password123',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña del email debe ser una cadena de texto' })
  @Length(4, 255, { message: 'La contraseña del email debe tener entre 4 y 255 caracteres' })
  user_account_email_passw?: string;

  @ApiProperty({
    description: 'Porcentaje de comisión',
    example: '5.5',
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El porcentaje de comisión debe ser una cadena de texto' })
  @Length(1, 10, { message: 'El porcentaje de comisión debe tener entre 1 y 10 caracteres' })
  comision_porciento?: string;

  @ApiProperty({
    description: 'Portal ID por defecto',
    example: '1',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El portal ID debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El portal ID debe tener entre 1 y 50 caracteres' })
  default_portalid?: string;

  @ApiProperty({
    description: 'Nuevo campo',
    example: 'valor',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nuevo campo debe ser una cadena de texto' })
  @Length(1, 255, { message: 'El nuevo campo debe tener entre 1 y 255 caracteres' })
  nuevocampo?: string;

  @ApiProperty({
    description: 'ID del encargado',
    example: '1',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El ID del encargado debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El ID del encargado debe tener entre 1 y 50 caracteres' })
  encargadoId?: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: '1',
    maxLength: 1,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo valido debe ser una cadena de texto' })
  @Length(1, 1, { message: 'El campo valido debe tener exactamente 1 carácter' })
  valido?: string;
} 
   */
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccion?: string;
}