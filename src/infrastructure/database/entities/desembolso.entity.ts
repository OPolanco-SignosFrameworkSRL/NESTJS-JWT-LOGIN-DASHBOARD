import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('desembolsos')
export class DesembolsoEntity {
  @ApiProperty({
    description: 'ID único del desembolso',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Número de desembolso',
    example: 'DES-001',
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  numero_desembolso: string;

  @ApiProperty({
    description: 'ID de la solicitud autorizada',
    example: 5,
  })
  @Column({ type: 'int', name: 'solicitud_id' })
  solicitud_id: number;

  @ApiProperty({
    description: 'ID del responsable del desembolso',
    example: 30,
  })
  @Column({ type: 'int', name: 'responsable_id' })
  responsable_id: number;

  @ApiProperty({
    description: 'Cédula de identidad del responsable',
    example: '12345678',
  })
  @Column({ type: 'varchar', length: 25, name: 'cedula_identidad' })
  cedula_identidad: string;

  @ApiProperty({
    description: 'ID de la división',
    example: 1,
  })
  @Column({ type: 'int', name: 'division_id' })
  division_id: number;

  @ApiProperty({
    description: 'ID del método de pago',
    example: 1,
  })
  @Column({ type: 'int', name: 'metodo_pago_id' })
  metodo_pago_id: number;

  @ApiProperty({
    description: 'Monto solicitado en la solicitud original',
    example: 3500,
  })
  @Column({ type: 'float', name: 'monto_solicitado' })
  monto_solicitado: number;

  @ApiProperty({
    description: 'Monto del desembolso',
    example: 3500,
  })
  @Column({ type: 'float', name: 'monto_desembolso' })
  monto_desembolso: number;

  @ApiProperty({
    description: 'Número de cheque (si aplica)',
    example: 'CHK-001',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'numero_cheque' })
  numero_cheque: string;

  @ApiProperty({
    description: 'Referencia del desembolso',
    example: 'REF-001',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia: string;

  @ApiProperty({
    description: 'Observaciones del desembolso',
    example: 'Desembolso por materiales de oficina',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 1000, nullable: true })
  observaciones: string;

  @ApiProperty({
    description: 'ID del usuario que registró el desembolso',
    example: 1,
  })
  @Column({ type: 'int', name: 'registrado_por_id' })
  registrado_por_id: number;

  @ApiProperty({
    description: 'Fecha de registro del desembolso',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro: Date;

  @ApiProperty({
    description: 'Estado del desembolso',
    example: 'ACTIVO',
  })
  @Column({ type: 'varchar', length: 20, default: 'ACTIVO' })
  estado: string;
}
