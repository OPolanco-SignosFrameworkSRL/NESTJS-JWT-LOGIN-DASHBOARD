import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('solicitud_desembolso_web')
export class CashRequestWriteEntity {
  @ApiProperty({
    description: 'ID único de la solicitud',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-10T08:00:00.000Z',
  })
  @Column({ type: 'datetime', name: 'fechacreada' })
  fechacreada: Date;

  @ApiProperty({
    description: 'ID del usuario que solicita',
    example: 1,
  })
  @Column({ type: 'int', name: 'solicitada_porid' })
  solicitada_porid: number;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 1,
  })
  @Column({ type: 'int', name: 'solicitud_tipo' })
  solicitud_tipo: number;

  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 1,
  })
  @Column({ type: 'int', name: 'solicitud_status' })
  solicitud_status: number;

  @ApiProperty({
    description: 'ID del usuario que autorizó',
    example: 2,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true, name: 'autorizado_porid' })
  autorizado_porid: number;

  @ApiProperty({
    description: 'Monto solicitado',
    example: 3500,
  })
  @Column({ type: 'float', name: 'monto_solicitado' })
  monto_solicitado: number;

  @ApiProperty({
    description: 'Fecha requerida',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  @Column({ type: 'datetime', nullable: true, name: 'fecha_requerida' })
  fecha_requerida: Date;

  @ApiProperty({
    description: 'ID de la división',
    example: 1,
  })
  @Column({ type: 'int', name: 'divicionid' })
  divicionid: number;

  @ApiProperty({
    description: 'Departamento',
    example: 'Administración',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  departamento: string;

  @ApiProperty({
    description: 'Concepto de la solicitud',
    example: 'Materiales para mantenimiento',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 2500, nullable: true })
  concepto: string;

  @ApiProperty({
    description: 'Fecha de orden de producción',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  @Column({ type: 'datetime', nullable: true, name: 'fecha_orden_prod' })
  fecha_orden_prod: Date;

  @ApiProperty({
    description: 'Número de orden de producción',
    example: 'OP-001',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'num_orden_prod' })
  num_orden_prod: string;

  @ApiProperty({
    description: 'Número del ticket de producción',
    example: 'TK-001',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'num_ticket_prod' })
  num_ticket_prod: string;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Cliente ABC',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'nombre_cliente' })
  nombre_cliente: string;

  @ApiProperty({
    description: 'Número de solicitud',
    example: 'SOL-001',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'solicitud_numero' })
  solicitud_numero: string;

  @ApiProperty({
    description: 'Fecha de rechazo',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  @Column({ type: 'datetime', nullable: true, name: 'fecha_rechazada' })
  fecha_rechazada: Date;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 1,
  })
  @Column({ type: 'int', name: 'tipo_pago' })
  tipo_pago: number;

  @ApiProperty({
    description: 'Razón de rechazo',
    example: 'Documentación incompleta',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 4000, nullable: true, name: 'razon_rechazon' })
  razon_rechazon: string;

  @ApiProperty({
    description: 'Fecha de aprobación',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  @Column({ type: 'datetime', nullable: true, name: 'fecha_aprobada' })
  fecha_aprobada: Date;

  @ApiProperty({
    description: 'ID del usuario que verificó',
    example: 1,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true, name: 'verificada_porid' })
  verificada_porid: number;

  @ApiProperty({
    description: 'Cédula del autorizador',
    example: '12345678',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 25, nullable: true, name: 'cedula_autoriza' })
  cedula_autoriza: string;
} 