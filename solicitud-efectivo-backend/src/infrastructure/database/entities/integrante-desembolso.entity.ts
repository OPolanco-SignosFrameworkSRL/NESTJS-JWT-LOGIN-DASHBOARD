import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SolicitudEfectivoEntity } from './solicitud-efectivo.entity';

@Entity('integrante_desembolso')
export class IntegranteDesembolsoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'solicitud_id' })
  solicitudId: number;

  @Column({ type: 'varchar', length: 150 })
  fullname: string;

  @Column({ type: 'bigint' })
  cedula: number;

  @Column({ type: 'varchar', length: 100 })
  beneficiario: string;

  @Column({ type: 'float' })
  monto: number;

  @Column({ name: 'tarea_asignada', type: 'varchar', length: 255 })
  tareaAsignada: string;

  @ManyToOne(() => SolicitudEfectivoEntity, solicitud => solicitud.integrantes)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudEfectivoEntity;
}