import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SolicitudEfectivoEntity } from './solicitud-efectivo.entity';
import { GaColaboradoresEntity } from './ga-colaboradores.entity';

@Entity('desembolso')
export class DesembolsoEntity {
  @ApiProperty({
    description: 'ID único del desembolso',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID de la solicitud de efectivo',
    example: 5,
  })
  @Column({ type: 'int', name: 'solicitud_id' })
  solicitudId: number;

  @ApiProperty({
    description: 'ID del responsable del desembolso',
    example: 30,
  })
  @Column({ type: 'int', name: 'responsable_id' })
  responsableId: number;

  @ApiProperty({
    description: 'Monto del desembolso',
    example: 3500,
  })
  @Column({ type: 'float', name: 'monto_desembolso' })
  montoDesembolso: number;

  @ApiProperty({
    description: 'Número de cheque',
    example: 'CHK-001',
  })
  @Column({ type: 'varchar', length: 255, name: 'cheque_num' })
  chequeNum: string;

  @ApiProperty({
    description: 'Referencia del desembolso',
    example: 'REF-001',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  referencia: string;

  @ApiProperty({
    description: 'Observaciones del desembolso',
    example: 'Desembolso por materiales de oficina',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  observacion: string;

  @ApiProperty({
    description: 'Número de desembolso único',
    example: 'DES-202408-001',
  })
  @Column({ type: 'varchar', length: 255, name: 'num_desembolso' })
  numDesembolso: string;

  // Relación con SolicitudEfectivo
  @ManyToOne(() => SolicitudEfectivoEntity, solicitud => solicitud.desembolsos)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudEfectivoEntity;

  // Relación con GaColaboradores
  @ManyToOne(() => GaColaboradoresEntity, colaborador => colaborador.desembolsos)
  @JoinColumn({ name: 'responsable_id' })
  responsable: GaColaboradoresEntity;
}
