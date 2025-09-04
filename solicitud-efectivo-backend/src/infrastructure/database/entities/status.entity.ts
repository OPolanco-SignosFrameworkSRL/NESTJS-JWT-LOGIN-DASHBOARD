import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('status')
export class StatusEntity {
  @ApiProperty({
    description: 'ID único del status',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({
    description: 'Descripción del status',
    example: 'Activo',
    maxLength: 100,
  })
  @Column({ name: 'description', length: 100 })
  description: string;

  @ApiProperty({
    description: 'Estado del status (A=Activo, I=Inactivo)',
    example: 'A',
    enum: ['A', 'I'],
  })
  @Column({ name: 'char_status', length: 1, default: 'A' })
  charStatus: string;

  /* @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'GETDATE()' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'GETDATE()' })
  updatedAt: Date; */

  // Getters para compatibilidad
  get char_status(): string {
    return this.charStatus;
  }

  /* get created_at(): Date {
    return this.createdAt;
  }

  get updated_at(): Date {
    return this.updatedAt;
  }
 */
  /**
   * Verifica si el status está activo
   */
  isActive(): boolean {
    return this.charStatus === 'A';
  }

  /**
   * Obtiene la representación string del status
   */
  toString(): string {
    return this.description;
  }
}
