import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IntegranteDesembolsoEntity } from "./integrante-desembolso.entity";

@Entity('solicitud_efectivo')
export class SolicitudEfectivoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id'})
  usuarioId: number;


  @Column({ type: 'float'})
  monto: number;

  @Column({ name: 'tipo_solicitud_id'})
  tipoSolicitudId: number;

  @Column({ name: 'tipo_pago_id'})
  tipoPagoId: number;

  @Column({ name: 'division_id'})
  divisionId: number;

  @Column({ name: 'fecha_orden' })
  fechaOrden: Date;
  
  @Column({ name: 'numero_orden' })
  numeroOrden: string;
  
  @Column({ name: 'nombre_cliente' })
  nombreCliente: string;
  
  @Column({ name: 'numero_ticket' })
  numeroTicket: string;
  
  @Column()
  concepto: string;
  
  @Column({ name: 'status_id' })
  statusId: number;

  @OneToMany(() => IntegranteDesembolsoEntity, integrante => integrante.solicitud)
  integrantes: IntegranteDesembolsoEntity[];
}