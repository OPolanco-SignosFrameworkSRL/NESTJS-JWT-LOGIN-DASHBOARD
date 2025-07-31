import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('appusuarios')
@Index(['cedula'], { unique: true })
export class UserWrite {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 62154,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Número de cédula del usuario (11 dígitos)',
    example: '40245980129',
    minLength: 11,
    maxLength: 11,
  })
  @Column({ length: 11 })
  @Index()
  cedula: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Raul',
    maxLength: 100,
  })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Vargas',
    maxLength: 100,
  })
  @Column({ length: 100 })
  apellido: string;

  @ApiProperty({
    description: 'Hash SHA-256 del código de usuario',
    example: '896ece9b8a314e6922783f9938ad8b1ad95cda0d11ece5902b36a2e879ccbaa2',
  })
  @Column({ length: 64 })
  @Exclude()
  codigo: string;

  @ApiProperty({
    description: 'Contraseña del usuario (se almacena hasheada)',
    example: 'password123',
  })
  @Column({ length: 64 })
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: 'Usuario',
    enum: ['Admin', 'Usuario', 'Supervisor', 'Manager'],
    default: 'Usuario',
  })
  @Column({ length: 50, default: 'Usuario' })
  role: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'Raul.Vargas@grupoastro.com.do',
    maxLength: 255,
  })
  @Column({ length: 255, nullable: true })
  user_email: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  @Column({ default: true })
  valido: boolean;

  // Métodos de instancia
  getFullName(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  getApellido(): string {
    return `${this.apellido}`.trim();
  }

  isActive(): boolean {
    return this.valido;
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }
} 