import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StatusEntity } from './status.entity';

@Entity('approles')
@Index(['roleName'], { unique: true })
export class RoleEntity {
  @ApiProperty({
    description: 'ID único del rol',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'ADMINISTRATOR',
    maxLength: 100,
  })
  @Column({ name: 'RoleName', length: 100 })
  @Index()
  roleName: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario con permisos de administración completa',
    maxLength: 255,
  })
  @Column({ name: 'RoleDesc', length: 255, nullable: true })
  roleDesc?: string;

  @ApiProperty({
    description: 'Indica si el rol está activo',
    example: true,
    default: true,
  })
  @Column({ name: 'RowActive', default: true })
  rowActive: boolean;

  @ApiProperty({
    description: 'Usuario que agregó el rol',
  })
  @Column({ name: 'User_Add', nullable: true })
  userAdd: number;

  @ApiProperty({
    description: 'Usuario que modificó el rol',
  })
  @Column({ name: 'User_Mod', nullable: true })
  userMod: number;

  @ApiProperty({
    description: 'Usuario que eliminó el rol',
  })
  @Column({ name: 'User_Del', nullable: true })
  userDel: number;

  @ApiProperty({
    description: 'ID del status asociado al rol',
    example: 1,
  })
  @Column({ name: 'StatusId', nullable: true })
  statusId?: number;

  // Relación con Status
  @ManyToOne(() => StatusEntity, { eager: false })
  @JoinColumn({ name: 'StatusId' })
  status?: StatusEntity;

  /**
   * Verifica si el rol está activo
   */
  isActive(): boolean {
    return this.rowActive;
  }

  /**
   * Obtiene la representación string del rol
   */
  toString(): string {
    return this.roleName;
  }
}
