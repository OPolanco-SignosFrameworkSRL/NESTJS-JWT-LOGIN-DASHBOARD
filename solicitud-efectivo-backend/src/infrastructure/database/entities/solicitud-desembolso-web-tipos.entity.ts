import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('solicitud_desembolso_web_tipos')
export class SolicitudDesembolsoWebTiposEntity {
  @ApiProperty({
    description: 'ID del tipo de solicitud desembolso web',
    example: 1,
  })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({
    description: 'Descripción del tipo de solicitud desembolso web',
    example: 'Solicitud de Efectivo',
  })
  @Column({ type: 'varchar', length: 255 })
  tipo_desc: string;

  @ApiProperty({
    description: 'Icono del tipo de solicitud desembolso web',
    example: 'cash-icon',
  })
  @Column({ type: 'varchar', length: 500 })
  tipo_icon: string;

  @ApiProperty({
    description: 'Flag de producción',
    example: 1,
  })
  @Column({ type: 'int' })
  produccion_flag: number;
}
