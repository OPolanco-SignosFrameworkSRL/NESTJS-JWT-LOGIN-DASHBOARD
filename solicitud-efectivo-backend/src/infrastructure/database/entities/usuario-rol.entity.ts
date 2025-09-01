import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from './role.entity';
import { UserWriteEntity } from './user-write.entity';

@Entity('UsuariosRoles')
export class UsuarioRolEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @ApiProperty({ description: 'ID del usuario', example: 1 })
  @Column({ name: 'IdUsuario', type: 'int' })
  idUsuario: number;

  @ApiProperty({ description: 'ID del rol', example: 1 })
  @Column({ name: 'IdRol', type: 'int' })
  idRol: number;

  @ApiProperty({ description: 'Activo', example: true, default: true })
  @Column({ name: 'RowActive', type: 'bit', default: () => '(1)' })
  rowActive: boolean;

  @Column({ name: 'User_Add', type: 'int', nullable: true })
  userAdd: number | null;

  @Column({ name: 'User_Mod', type: 'int', nullable: true })
  userMod: number | null;

  @Column({ name: 'User_Del', type: 'int', nullable: true })
  userDel: number | null;

  @Column({ name: 'CreatedAt', type: 'datetime2', precision: 0, default: () => 'sysutcdatetime()' })
  createdAt: Date;

  @Column({ name: 'UpdatedAt', type: 'datetime2', precision: 0, default: () => 'sysutcdatetime()' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'IdRol', referencedColumnName: 'id' })
  roleEntity: RoleEntity;

  @ManyToOne(() => UserWriteEntity)
  @JoinColumn({ name: 'IdUsuario', referencedColumnName: 'id' })
  userEntity: UserWriteEntity;
}


