import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('recintos')
export class RecintosEntity {
  @ApiProperty({
    description: 'ID del recinto',
    example: 1,
  })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({
    description: 'Nombre del recinto',
    example: 'Sala de Conferencias A',
  })
  @Column({ type: 'varchar', length: 255 })
  recinto: string;

  @ApiProperty({
    description: 'Ubicación del recinto',
    example: 'Edificio Principal, Piso 2, Oficina 201',
  })
  @Column({ type: 'varchar', length: 'max' })
  ubicacion: string;

  @ApiProperty({
    description: 'Estado del recinto',
    example: true,
  })
  @Column({ type: 'bit', default: 1 })
  estado: boolean;
}
