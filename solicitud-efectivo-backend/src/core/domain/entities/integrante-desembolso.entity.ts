import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { SolicitudEfectivoEntity } from "./solicitud-efectivo.entity";

@Entity('integrante_desembolso')
export class IntegranteDesembolsoEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'solicitud_id' })
  solicitudId: number;
  
  @Column({ length: 150 })
  fullname: string;
  
  @Column()
  cedula: number;
  
  @Column({ length: 100 })
  beneficiario: string;
  
  @Column({ type: 'float' })
  monto: number;
  
  @Column({ name: 'tarea_asignada', length: 255 })
  tareaAsignada: string;
  
  // Relación con solicitud
  @ManyToOne(() => SolicitudEfectivoEntity, solicitud => solicitud.integrantes)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudEfectivoEntity;
}