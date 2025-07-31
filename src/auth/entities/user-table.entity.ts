import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios') // Asumiendo que la tabla real se llama 'usuarios'
export class UserTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  codigo: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  user_email: string;

  @Column({ nullable: true })
  division: string;

  @Column({ nullable: true })
  cargo: string;

  @Column({ nullable: true })
  dependencia: string;

  @Column({ nullable: true })
  recinto: string;

  @Column({ nullable: true })
  estado: string;

  @Column({ type: 'bit', default: true })
  valido: boolean;
}
