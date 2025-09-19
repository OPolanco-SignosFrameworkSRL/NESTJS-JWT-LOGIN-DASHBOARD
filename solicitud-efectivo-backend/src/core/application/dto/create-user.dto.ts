import { IsString, IsEmail, IsOptional, Length, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Número de cédula del usuario (11 dígitos)',
    example: '40208712477',
    minLength: 11,
    maxLength: 11,
  })
  @IsString()
  @Length(11, 11, { message: 'La cédula debe tener exactamente 11 dígitos' })
  cedula: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Frandy',
    maxLength: 100,
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Jeffry Cepeda',
    maxLength: 100,
  })
  @IsString()
  apellido: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Frandy Jeffry Cepeda',
    maxLength: 200,
  })
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'hashedpassword456',
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Clave especial del usuario para generar código',
    example: 'MiClaveSecreta2024',
    minLength: 6,
  })
  @IsString()
  clave: string;

  @ApiProperty({
    description: 'Array de roles del usuario',
    example: [{ id: 1 }, { id: 2 }, { id: 3 }],
    type: [Object],
  })
  @IsArray()
  roles: Array<{ id: number }>;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'agomez',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  user_email?: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '8292552888',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'De Arroyo Hondo',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    description: 'Número de celular',
    example: '565465654645464',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiProperty({
    description: 'Estado del usuario (1=activo, 0=inactivo)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  user_status?: number;

  @ApiProperty({
    description: 'ID de la caja asignada',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  caja_id?: string;

  @ApiProperty({
    description: 'ID de la tienda asignada',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  tienda_id?: string;

  @ApiProperty({
    description: 'Permite múltiples tiendas (1=sí, 0=no)',
    example: '0',
    required: false,
  })
  @IsOptional()
  @IsString()
  allow_multi_tienda?: string;

  @ApiProperty({
    description: 'Porcentaje máximo de descuento',
    example: '0.5',
    required: false,
  })
  @IsOptional()
  @IsString()
  max_descuento?: string;

  @ApiProperty({
    description: 'Puede cerrar caja (1=sí, 0=no)',
    example: '0',
    required: false,
  })
  @IsOptional()
  @IsString()
  close_caja?: string;

  @ApiProperty({
    description: 'Email de la cuenta del usuario',
    example: 'prueba@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  user_account_email?: string;

  @ApiProperty({
    description: 'Porcentaje de comisión',
    example: '5.5',
    required: false,
  })
  @IsOptional()
  @IsString()
  comision_porciento?: string;

  @ApiProperty({
    description: 'Portal ID por defecto',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  default_portalid?: string;

  @ApiProperty({
    description: 'ID del encargado',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  encargadoId?: string;
}
