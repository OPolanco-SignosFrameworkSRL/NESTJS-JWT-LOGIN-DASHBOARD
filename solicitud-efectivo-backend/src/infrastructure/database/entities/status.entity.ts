import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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
    description: 'Nombre del status',
    example: 'Activo',
    maxLength: 50,
  })
  @Column({ name: 'name', length: 50 })
  name: string;

  @ApiProperty({
    description: 'Descripción del status',
    example: 'Estado activo del sistema',
    maxLength: 100,
  })
  @Column({ name: 'description', length: 100, nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Indica si el status está activo',
    example: true,
    default: true,
  })
  @Column({ name: 'active', default: true })
  active: boolean;

  /**
   * Verifica si el status está activo
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Obtiene la representación string del status
   */
  toString(): string {
    return this.name;
  }
}
