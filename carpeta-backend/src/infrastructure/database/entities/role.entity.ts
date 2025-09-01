import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('approles')
@Index(['role_name'], { unique: true })
export class RoleEntity {
  @ApiProperty({
    description: 'ID único del rol',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    maxLength: 50,
  })
  @Column({ length: 50 })
  @Index()
  role_name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario con permisos de administración completa',
    maxLength: 255,
  })
  @Column({ length: 255 })
  role_desc: string;

  @ApiProperty({
    description: 'Indica si el rol está activo',
    example: true,
    default: true,
  })
  @Column({ default: true })
  valido: boolean;

  /**
   * Verifica si el rol está activo
   */
  isActive(): boolean {
    return this.valido;
  }

  /**
   * Verifica si es un rol administrativo
   */
  isAdministrativeRole(): boolean {
    const adminRoles = ['Administrador', 'Administrator', 'Admin'];
    return adminRoles.includes(this.role_name);
  }

  /**
   * Obtiene la representación string del rol
   */
  toString(): string {
    return `${this.role_name} - ${this.role_desc}`;
  }
}
