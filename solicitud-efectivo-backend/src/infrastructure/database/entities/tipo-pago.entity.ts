import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tipo_pagos')
export class TipoPagoEntity {
  @ApiProperty({
    description: 'ID del tipo de pago',
    example: 1,
  })
  @PrimaryColumn({ type: 'bigint' })
  pago_tipo: number;

  @ApiProperty({
    description: 'Descripción del tipo de pago',
    example: 'Efectivo',
  })
  @Column({ type: 'varchar', length: 45 })
  tipo_desc: string;

  @ApiProperty({ description: 'Estado (1=Activo, 2=Inactivo)', example: 1 })
  @Column({ type: 'int', default: 1 })
  estado: number;
}
