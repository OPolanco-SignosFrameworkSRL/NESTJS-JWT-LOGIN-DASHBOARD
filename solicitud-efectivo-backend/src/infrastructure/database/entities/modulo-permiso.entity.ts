import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ModuloEntity } from '../../database/entities/modulo.entity';

@Entity('ModulosPermisos')
export class ModuloPermisoEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'IdModulo', type: 'int' })
  IdModulo: number;

  @Column({ name: 'Ver', type: 'bit', default: false })
  Ver: boolean;

  @Column({ name: 'Agregar', type: 'bit', default: false })
  Agregar: boolean;

  @Column({ name: 'Editar', type: 'bit', default: false })
  Editar: boolean;

  @Column({ name: 'Eliminar', type: 'bit', default: false })
  Eliminar: boolean;

  @Column({ name: 'RowActive', type: 'bit', default: true })
  RowActive: boolean;

  @Column({ name: 'User_Add', type: 'int', nullable: true })
  UserAdd?: number;

  @Column({ name: 'User_Mod', type: 'int', nullable: true })
  UserMod?: number;

  @Column({ name: 'User_Del', type: 'int', nullable: true })
  UserDel?: number;

  // Relación con Modulo
  @ManyToOne(() => ModuloEntity, { eager: true })
  @JoinColumn({ name: 'IdModulo' })
  modulo: ModuloEntity;

  // Getters para compatibilidad con la interfaz
  get id(): number {
    return this.Id;
  }

  get idModulo(): number {
    return this.IdModulo;
  }

  get ver(): boolean {
    return Boolean(this.Ver);
  }

  get agregar(): boolean {
    return Boolean(this.Agregar);
  }

  get editar(): boolean {
    return Boolean(this.Editar);
  }

  get eliminar(): boolean {
    return Boolean(this.Eliminar);
  }

  get rowActive(): boolean {
    return Boolean(this.RowActive);
  }

  get userAdd(): number | undefined {
    return this.UserAdd;
  }

  get userMod(): number | undefined {
    return this.UserMod;
  }

  get userDel(): number | undefined {
    return this.UserDel;
  }
}
