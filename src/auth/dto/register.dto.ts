import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ 
    description: 'Email del usuario', 
    example: 'usuario@ejemplo.com',
    type: String 
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario', 
    example: '123456',
    minLength: 6,
    type: String 
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiPropertyOptional({ 
    description: 'Nombre del usuario', 
    example: 'Juan',
    type: String 
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ 
    description: 'Apellido del usuario', 
    example: 'Pérez',
    type: String 
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ 
    description: 'Rol del usuario', 
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER
  })
  @IsEnum(UserRole, { message: 'El rol debe ser válido' })
  @IsOptional()
  role?: UserRole;
} 