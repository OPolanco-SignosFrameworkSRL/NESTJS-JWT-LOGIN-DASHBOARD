import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager'
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Email del usuario', example: 'usuario@ejemplo.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Contraseña encriptada del usuario' })
  @Column()
  password: string;

  @ApiProperty({ 
    description: 'Rol del usuario', 
    enum: UserRole, 
    example: UserRole.USER 
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({ description: 'Estado activo del usuario', example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación del usuario' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del usuario' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Método para excluir la contraseña al serializar
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
} 