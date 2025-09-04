import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DivisionEntity } from './division.entity';
import { GaColaboradoresEntity } from './ga-colaboradores.entity';
import { PagoNoLiquidadoAdjuntoEntity } from './pago-no-liquidado-adjunto.entity';

@Entity('pagos_no_liquidados')
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
  @Column({ name: 'desembolso_numero', type: 'varchar', length: 100 })
  desembolsoNumero: string;

  @ApiProperty({
    description: 'Nombre del beneficiario',
    example: 'Lili Ortiz',
  })
  @Column({ name: 'beneficiario', type: 'varchar', length: 255 })
  beneficiario: string;

  @ApiProperty({
    description: 'ID del responsable',
    example: 1,
  })
  @Column({ name: 'responsable_id', type: 'int' })
  responsableId: number;

  @ApiProperty({
    description: 'ID de la división',
    example: 1,
  })
  @Column({ name: 'division_id', type: 'int' })
  divisionId: number;

  @ApiProperty({
    description: 'Monto del pago',
    example: 1500.50,
  })
  @Column({ name: 'monto', type: 'decimal', precision: 15, scale: 2, nullable: true })
  monto?: number;

  @ApiProperty({
    description: 'Estado del pago',
    example: 'Activo',
    enum: ['Activo', 'Cancelado'],
  })
  @Column({ name: 'estado', type: 'varchar', length: 20, default: 'Activo' })
  estado: string;

  @ApiProperty({
    description: 'Observaciones adicionales',
    example: 'Pago pendiente de liquidación',
  })
  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones?: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-01-09T10:30:00.000Z',
  })
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-09T15:45:00.000Z',
  })
  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @ApiProperty({
    description: 'Usuario que creó el registro',
    example: 1,
  })
  @Column({ name: 'usuario_creacion', type: 'int', nullable: true })
  usuarioCreacion?: number;

  @ApiProperty({
    description: 'Usuario que modificó el registro',
    example: 1,
  })
  @Column({ name: 'usuario_modificacion', type: 'int', nullable: true })
  usuarioModificacion?: number;

  // Relaciones
  @ManyToOne(() => GaColaboradoresEntity, { eager: false })
  @JoinColumn({ name: 'responsable_id' })
  responsable: GaColaboradoresEntity;

  @ManyToOne(() => DivisionEntity, { eager: false })
  @JoinColumn({ name: 'division_id' })
  division: DivisionEntity;

  @OneToMany(() => PagoNoLiquidadoAdjuntoEntity, adjunto => adjunto.pagoNoLiquidado)
  adjuntos: PagoNoLiquidadoAdjuntoEntity[];

  // Métodos de utilidad
  isActivo(): boolean {
    return this.estado === 'Activo';
  }

  isCancelado(): boolean {
    return this.estado === 'Cancelado';
  }

  getNumeroDesembolsoCompleto(): string {
    return `${this.desembolsoNumero} ${this.beneficiario}`;
  }
}
