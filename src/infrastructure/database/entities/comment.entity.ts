import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('solicitud_desembolso_web_comentarios')
export class CommentEntity {
  @ApiProperty({
    description: 'ID único del comentario',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Fecha de creación del comentario',
    example: '2024-01-10T08:00:00.000Z',
  })
  @Column({ type: 'datetime', name: 'fechacreado' })
  fechacreado: Date;

  @ApiProperty({
    description: 'ID del usuario que creó el comentario',
    example: 1,
  })
  @Column({ type: 'int', name: 'creadoporid' })
  creadoporid: number;

  @ApiProperty({
    description: 'ID de la solicitud a la que pertenece el comentario',
    example: 1,
  })
  @Column({ type: 'int', name: 'solicitudid' })
  solicitudid: number;

  @ApiProperty({
    description: 'Cédula del usuario que creó el comentario',
    example: '12345678',
  })
  @Column({ type: 'varchar', length: 50, name: 'creadopor_cedula' })
  creadopor_cedula: string;

  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Este es un comentario sobre la solicitud',
  })
  @Column({ type: 'varchar', length: 'MAX', name: 'comentario' })
  comentario: string;

  // Campos adicionales para información del usuario (si se necesitan)
  // Comentados porque no existen en la tabla real
  // @ApiProperty({
  //   description: 'Nombre del usuario que creó el comentario',
  //   example: 'Juan Pérez',
  //   nullable: true,
  // })
  // @Column({ type: 'varchar', length: 511, nullable: true, name: 'usuarionombre' })
  // usuarionombre?: string;

  // Campo comentado porque no existe en la tabla real
  // @ApiProperty({
  //   description: 'Apellido del usuario que creó el comentario',
  //   example: 'Pérez',
  //   nullable: true,
  // })
  // @Column({ type: 'varchar', length: 255, nullable: true, name: 'usuarioapellido' })
  // usuarioapellido?: string;

  // Campo comentado porque no existe en la tabla real
  // @ApiProperty({
  //   description: 'Email del usuario que creó el comentario',
  //   example: 'juan.perez@empresa.com',
  //   nullable: true,
  // })
  // @Column({ type: 'varchar', length: 255, nullable: true, name: 'user_email' })
  // user_email?: string;
}
