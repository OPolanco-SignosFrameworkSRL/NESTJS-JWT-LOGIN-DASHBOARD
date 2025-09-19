import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { TipoPagoEntity } from './tipo-pago.entity';

@Entity('solicitud_desembolso_web_pagos')
export class PagoNoLiquidadoEntity {
  @ApiProperty({
    description: 'ID único del pago no liquidado',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Número de desembolso',
    example: 'DES-2025-0026',
  })
  @Column({ name: 'desembolso_numero', type: 'varchar', length: 50 })
  desembolsoNumero: string;

  @ApiProperty({
    description: 'ID de la solicitud',
    example: 1,
  })
  @Column({ name: 'solicitudid', type: 'int' })
  solicitudId: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-09T10:30:00.000Z',
  })
  @Column({ name: 'fecha_creado', type: 'datetime' })
  fechaCreado: Date;

  @ApiProperty({
    description: 'ID del usuario que creó el registro',
    example: 1,
  })
  @Column({ name: 'creadoporid', type: 'int' })
  creadoPorId: number;

  @ApiProperty({
    description: 'Monto de la solicitud',
    example: 1500.50,
  })
  @Column({ name: 'solicitud_monto', type: 'float' })
  solicitudMonto: number;

  @ApiProperty({
    description: 'Monto del desembolso',
    example: 1500.50,
  })
  @Column({ name: 'desembolso_monto', type: 'float' })
  desembolsoMonto: number;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 1,
  })
  @Column({ name: 'tipo_pago', type: 'int' })
  tipoPago: number;

  @ApiProperty({
    description: 'Número de cheque',
    example: 'CHK-001',
  })
  @Column({ name: 'cheque_no', type: 'varchar', length: 50, nullable: true })
  chequeNo?: string;

  @ApiProperty({
    description: 'Referencia de transferencia',
    example: 'TRF-001',
  })
  @Column({ name: 'transerencia_ref', type: 'varchar', length: 50, nullable: true })
  transferenciaRef?: string;

  @ApiProperty({
    description: 'Estatus del pago',
    example: 1,
  })
  @Column({ name: 'estatus', type: 'int' })
  estatus: number;

  @ApiProperty({
    description: 'Concepto del pago',
    example: 'Pago de servicios profesionales',
  })
  @Column({ name: 'concepto', type: 'text' })
  concepto: string;

  @ApiProperty({
    description: 'Nombre del beneficiario',
    example: 'Lili Ortiz',
  })
  @Column({ name: 'beneficiario', type: 'varchar', length: 255 })
  beneficiario: string;

  @ApiProperty({
    description: 'Cédula del beneficiario',
    example: '40244044852',
  })
  @Column({ name: 'cedula', type: 'varchar', length: 50 })
  cedula: string;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Pago pendiente de liquidación',
  })
  @Column({ name: 'notas', type: 'text', nullable: true })
  notas?: string;

  @ApiProperty({
    description: 'ID de la caja',
    example: 1,
  })
  @Column({ name: 'cajaid', type: 'int', nullable: true })
  cajaId?: number;

  @ApiProperty({
    description: 'Cuenta de banco',
    example: '1234567890',
  })
  @Column({ name: 'cuenta_banco', type: 'varchar', length: 50, nullable: true })
  cuentaBanco?: string;

  // Relaciones
  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'creadoporid' })
  creadoPor: UserEntity;

  @ManyToOne(() => TipoPagoEntity, { eager: false })
  @JoinColumn({ name: 'tipo_pago' })
  tipoPagoInfo: TipoPagoEntity;

  // Métodos de utilidad
  isActivo(): boolean {
    return this.estatus === 1; // Asumiendo que 1 = activo
  }

  isCancelado(): boolean {
    return this.estatus === 0; // Asumiendo que 0 = cancelado
  }

  getNumeroDesembolsoCompleto(): string {
    return `${this.desembolsoNumero} ${this.beneficiario}`;
  }

  getEstadoTexto(): string {
    switch (this.estatus) {
      case 0: return 'Cancelado';
      case 1: return 'Activo';
      case 2: return 'Procesado';
      case 3: return 'Liquidado';
      default: return 'Desconocido';
    }
  }
}