import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ga_dependencias')
export class GaDependenciasEntity {
  @ApiProperty({
    description: 'ID de la dependencia',
    example: 1,
  })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({
    description: 'Nombre de la dependencia',
    example: 'Recursos Humanos',
  })
  @Column({ type: 'varchar', length: 255 })
  dependencia_nombre: string;

  @ApiProperty({
    description: 'Estado de la dependencia',
    example: true,
  })
  @Column({ type: 'bit' })
  estado: boolean;
}
