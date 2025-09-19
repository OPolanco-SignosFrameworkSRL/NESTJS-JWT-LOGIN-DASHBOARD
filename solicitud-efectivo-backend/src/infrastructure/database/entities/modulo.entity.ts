import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Modulos')
export class ModuloEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'Modulo', type: 'varchar', length: 50, unique: true })
  Modulo: string;

  @Column({ name: 'RowActive', type: 'bit', default: true })
  RowActive: boolean;

  @Column({ name: 'User_Add', type: 'int', nullable: true })
  UserAdd?: number;

  @Column({ name: 'User_Mod', type: 'int', nullable: true })
  UserMod?: number;

  @Column({ name: 'User_Del', type: 'int', nullable: true })
  UserDel?: number;

  // Getters para compatibilidad con la interfaz
  get id(): number {
    return this.Id;
  }

  get modulo(): string {
    return this.Modulo;
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
