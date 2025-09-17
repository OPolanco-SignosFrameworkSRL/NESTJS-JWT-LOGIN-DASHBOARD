import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('solicitud_desembolso_web_status')
export class SolicitudDesembolsoWebStatusEntity {
  @ApiProperty({ description: 'ID del status', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Descripción del status', example: 'Pendiente' })
  @Column({ name: 'descripcion', type: 'varchar', length: 255 })
  descripcion: string;

  @ApiProperty({ description: 'Nombre corto del status', example: 'PEND', required: false })
  @Column({ name: 'nombre', type: 'varchar', length: 255, nullable: true })
  nombre?: string;
}


