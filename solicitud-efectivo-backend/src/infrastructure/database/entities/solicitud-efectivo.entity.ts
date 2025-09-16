import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IntegranteDesembolsoEntity } from './integrante-desembolso.entity';
import { DesembolsoEntity } from './desembolso.entity';
import { UserEntity } from './user.entity';
import { SolicitudTipoEntity } from './solicitud-tipo.entity';
import { DivisionEntity } from './division.entity';
import { TipoPagoEntity } from './tipo-pago.entity';

@Entity('solicitud_efectivo')
export class SolicitudEfectivoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'float' })
  monto: number;

  @Column({ name: 'tipo_solicitud_id' })
  tipoSolicitudId: number;

  @Column({ name: 'tipo_pago_id' })
  tipoPagoId: number;

  @Column({ name: 'division_id' })
  divisionId: number;

  @Column({ name: 'fecha_orden', type: 'date' })
  fechaOrden: Date;

  @Column({ name: 'numero_orden', type: 'int' })
  numeroOrden: number;

  @Column({ name: 'nombre_cliente', type: 'varchar', length: 100 })
  nombreCliente: string;

  @Column({ name: 'numero_ticket', type: 'int' })
  numeroTicket: number;

  @Column({ type: 'varchar', length: 255 })
  concepto: string;

  @Column({ name: 'status_id' })
  statusId: number;

  @ManyToOne(() => UserEntity, user => user.solicitudes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UserEntity;

  @ManyToOne(() => SolicitudTipoEntity)
  @JoinColumn({ name: 'tipo_solicitud_id' })
  tipoSolicitud: SolicitudTipoEntity;

  @ManyToOne(() => DivisionEntity)
  @JoinColumn({ name: 'division_id' })
  division: DivisionEntity;

  @ManyToOne(() => TipoPagoEntity)
  @JoinColumn({ name: 'tipo_pago_id' })
  tipoPago: TipoPagoEntity;

  @OneToMany(() => IntegranteDesembolsoEntity, integrante => integrante.solicitud)
  integrantes: IntegranteDesembolsoEntity[];

  @OneToMany(() => DesembolsoEntity, desembolso => desembolso.solicitud)
  desembolsos: DesembolsoEntity[];
}