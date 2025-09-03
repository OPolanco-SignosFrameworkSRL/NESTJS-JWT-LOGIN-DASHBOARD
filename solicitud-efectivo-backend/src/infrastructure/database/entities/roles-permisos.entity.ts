import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('RolesPermisos')
export class RolesPermisosEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'IdRol', type: 'int' })
  IdRol: number;

  @Column({ name: 'IdPermiso', type: 'int' })
  IdPermiso: number;

  @Column({ name: 'RowActive', type: 'bit', default: true })
  RowActive: boolean;

  @Column({ name: 'User_Add', type: 'int', nullable: true })
  UserAdd?: number;

  @Column({ name: 'User_Mod', type: 'int', nullable: true })
  UserMod?: number;

  @Column({ name: 'User_Del', type: 'int', nullable: true })
  UserDel?: number;

  // Getters para compatibilidad
  get id(): number {
    return this.Id;
  }

  get idRol(): number {
    return this.IdRol;
  }

  get idPermiso(): number {
    return this.IdPermiso;
  }

  get rowActive(): boolean {
    return Boolean(this.RowActive);
  }
}
