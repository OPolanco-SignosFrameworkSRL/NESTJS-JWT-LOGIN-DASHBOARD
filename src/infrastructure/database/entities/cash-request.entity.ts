import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CashRequestStatus, CashRequestType, PaymentType, Division } from '../../../core/domain/cash-request.interface';

@Entity('cash_requests')
export class CashRequestEntity {
  @ApiProperty({
    description: 'ID único de la solicitud',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID del usuario que solicita',
    example: 1,
  })
  @Column({ type: 'int', name: 'requested_by' })
  requestedBy: number;

  @ApiProperty({
    description: 'Monto solicitado',
    example: 3500,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'requested_amount' })
  requestedAmount: number;

  @ApiProperty({
    description: 'Tipo de solicitud',
    example: 'COMPRA DE MATERIALES',
    enum: CashRequestType,
  })
  @Column({ type: 'varchar', length: 100, name: 'request_type' })
  requestType: string;

  @ApiProperty({
    description: 'División',
    example: 'ADMINISTRACION',
    enum: Division,
  })
  @Column({ type: 'varchar', length: 50 })
  division: string;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 'EFECTIVO',
    enum: PaymentType,
  })
  @Column({ type: 'varchar', length: 50, name: 'payment_type' })
  paymentType: string;

  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 'PENDIENTE',
    enum: CashRequestStatus,
  })
  @Column({ type: 'varchar', length: 20, default: 'PENDIENTE' })
  status: string;

  @ApiProperty({
    description: 'ID del usuario que aprobó',
    example: 2,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true, name: 'approved_by' })
  approvedBy: number;

  @ApiProperty({
    description: 'Fecha de aprobación',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  @Column({ type: 'datetime', nullable: true, name: 'approved_at' })
  approvedAt: Date;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Materiales para mantenimiento de equipos',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Indica si el registro está activo',
    example: '1',
  })
  @Column({ type: 'char', length: 1, default: '1' })
  valido: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-10T08:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2024-01-10T08:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @ApiProperty({
    description: 'ID del usuario que realizó la eliminación',
    example: 1,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true, name: 'deleted_by' })
  deletedBy: number;
} 