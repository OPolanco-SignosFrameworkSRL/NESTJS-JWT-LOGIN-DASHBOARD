import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DesembolsoEntity } from './desembolso.entity';

@Entity('ga_colaboradores')
export class GaColaboradoresEntity {
  @ApiProperty({
    description: 'ID único del colaborador',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre del colaborador',
    example: 'Juan',
  })
  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @ApiProperty({
    description: 'Cédula del colaborador',
    example: '12345678',
  })
  @Column({ type: 'varchar', length: 25 })
  cedula: string;

  @ApiProperty({
    description: 'División del colaborador',
    example: 'TI',
  })
  @Column({ type: 'varchar', length: 100 })
  division: string;

  // Relación con Desembolsos
  @OneToMany(() => DesembolsoEntity, desembolso => desembolso.responsable)
  desembolsos: DesembolsoEntity[];

}
