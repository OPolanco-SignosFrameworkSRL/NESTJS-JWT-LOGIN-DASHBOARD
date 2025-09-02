import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('Appusuarios')
@Index(['cedula'], { unique: true })
export class UserEntity {
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
  @Column({ name: 'cedula', length: 25 })
  @Index()
  cedula: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Raul',
    maxLength: 100,
  })
  @Column({ name: 'nombre', length: 255 })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Vargas',
    maxLength: 100,
  })
  @Column({ name: 'apellido', length: 255 })
  apellido: string;

  @ApiProperty({
    description: 'Hash SHA-256 del código de usuario',
    example: '896ece9b8a314e6922783f9938ad8b1ad95cda0d11ece5902b36a2e879ccbaa2',
  })
  @Column({ name: 'codigo', length: 100, nullable: true })
  @Exclude()
  codigo: string;

  @ApiProperty({
    description: 'Hash SHA-256 de la contraseña del usuario',
    example: '896ece9b8a314e6922783f9938ad8b1ad95cda0d11ece5902b36a2e879ccbaa2',
  })
  @Column({ name: 'password', length: 100, nullable: true })
  @Exclude()
  password: string;

  // El rol se obtiene desde UsuariosRoles, no directamente de Appusuarios

  @ApiProperty({
    description: 'Email del usuario',
    example: 'Raul.Vargas@grupoastro.com.do',
    maxLength: 255,
  })
  @Column({ name: 'user_email', length: 255, nullable: true })
  user_email: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '8091234567',
    maxLength: 20,
  })
  @Column({ name: 'telefono', length: 20, nullable: true })
  telefono: string;

  @ApiProperty({
    description: 'Número de celular del usuario',
    example: '8091234567',
    maxLength: 20,
  })
  @Column({ name: 'celular', length: 20, nullable: true })
  celular: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Principal #123',
    maxLength: 255,
  })
  @Column({ name: 'direccion', length: 255, nullable: true })
  direccion: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  @Column({ name: 'Valido', type: 'bit', default: () => '(1)' })
  valido: boolean;



  getFullName(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  getApellido(): string {
    return `${this.apellido}`.trim();
  }

  isActive(): boolean {
    return this.valido === true;
  }

  hasRole(roleId: number): boolean {
    // Este método ya no es válido porque el rol se obtiene desde UsuariosRoles
    // Se mantiene por compatibilidad pero siempre retorna false
    return false;
  }

}