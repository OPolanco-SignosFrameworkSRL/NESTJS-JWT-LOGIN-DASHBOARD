import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PagoNoLiquidadoEntity } from './pago-no-liquidado.entity';

@Entity('pagos_no_liquidados_adjuntos')
export class PagoNoLiquidadoAdjuntoEntity {
  @ApiProperty({
    description: 'ID único del adjunto',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID del pago no liquidado',
    example: 1,
  })
  @Column({ name: 'pago_no_liquidado_id', type: 'int' })
  pagoNoLiquidadoId: number;

  @ApiProperty({
    description: 'Nombre original del archivo',
    example: 'factura_001.pdf',
  })
  @Column({ name: 'nombre_archivo', type: 'varchar', length: 255 })
  nombreArchivo: string;

  @ApiProperty({
    description: 'Nombre del archivo en el servidor',
    example: 'adj_20250109_143022_001.pdf',
  })
  @Column({ name: 'nombre_servidor', type: 'varchar', length: 255 })
  nombreServidor: string;

  @ApiProperty({
    description: 'Ruta del archivo en el servidor',
    example: '/uploads/pagos_no_liquidados/2025/01/',
  })
  @Column({ name: 'ruta_archivo', type: 'varchar', length: 500 })
  rutaArchivo: string;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'application/pdf',
  })
  @Column({ name: 'tipo_mime', type: 'varchar', length: 100 })
  tipoMime: string;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 1024768,
  })
  @Column({ name: 'tamano_archivo', type: 'bigint' })
  tamanoArchivo: number;

  @ApiProperty({
    description: 'Descripción del adjunto',
    example: 'Factura del proveedor',
  })
  @Column({ name: 'descripcion', type: 'varchar', length: 500, nullable: true })
  descripcion?: string;

  @ApiProperty({
    description: 'Fecha de subida del archivo',
    example: '2025-01-09T14:30:22.000Z',
  })
  @CreateDateColumn({ name: 'fecha_subida' })
  fechaSubida: Date;

  @ApiProperty({
    description: 'Usuario que subió el archivo',
    example: 1,
  })
  @Column({ name: 'usuario_subida', type: 'int' })
  usuarioSubida: number;

  @ApiProperty({
    description: 'Estado del adjunto',
    example: 'Activo',
    enum: ['Activo', 'Eliminado'],
  })
  @Column({ name: 'estado', type: 'varchar', length: 20, default: 'Activo' })
  estado: string;

  // Relación con PagoNoLiquidado
  @ManyToOne(() => PagoNoLiquidadoEntity, pago => pago.adjuntos)
  @JoinColumn({ name: 'pago_no_liquidado_id' })
  pagoNoLiquidado: PagoNoLiquidadoEntity;

  // Métodos de utilidad
  isActivo(): boolean {
    return this.estado === 'Activo';
  }

  getRutaCompleta(): string {
    return `${this.rutaArchivo}${this.nombreServidor}`;
  }

  getTamanoFormateado(): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (this.tamanoArchivo === 0) return '0 Bytes';
    const i = Math.floor(Math.log(this.tamanoArchivo) / Math.log(1024));
    return Math.round(this.tamanoArchivo / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
