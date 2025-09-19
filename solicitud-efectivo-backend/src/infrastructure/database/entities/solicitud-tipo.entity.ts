import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('solicitud_desembolso_web_tipos')
export class SolicitudTipoEntity {
  @ApiProperty({ description: 'ID del tipo de solicitud', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Descripción del tipo de solicitud', example: 'Solicitud de Cheque' })
  @Column({ name: 'tipo_desc', type: 'varchar', length: 255 })
  tipoDesc: string;

  @ApiProperty({ description: 'Icono del tipo', example: '/AppExt/icons/grid.png' })
  @Column({ name: 'tipo_icon', type: 'varchar', length: 255 })
  tipoIcon: string;

  @ApiProperty({ description: 'Flag de producción', example: 1 })
  @Column({ name: 'produccion_flag', type: 'bit' })
  produccionFlag: boolean;
}
