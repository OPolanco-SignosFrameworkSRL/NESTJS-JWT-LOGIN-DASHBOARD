import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('divisiones')
export class DivisionEntity {
  @ApiProperty({
    description: 'ID único de la división',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre de la división',
    example: 'Tecnología',
  })
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @ApiProperty({
    description: 'ID de la dependencia',
    example: 1,
  })
  @Column({ type: 'int', name: 'dependencia_id' })
  dependenciaId: number;

  @ApiProperty({
    description: 'Estado de la división',
    example: true,
  })
  @Column({ type: 'bit', default: 1 })
  estado: boolean;
}
