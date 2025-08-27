import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('Appusuarios')
@Index(['cedula'], { unique: true })
export class UserWriteEntity {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 62154,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Número de cédula del usuario (11 dígitos)',
    example: '40245980129',
    minLength: 11,
    maxLength: 11,
  })
  @Column({ name: 'cedula', length: 25 })
  @Index()
  cedula: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Raul',
    maxLength: 100,
  })
  @Column({ name: 'nombre', length: 255 })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Vargas',
    maxLength: 100,
  })
  @Column({ name: 'apellido', length: 255 })
  apellido: string;

  @ApiProperty({
    description: 'Hash SHA-256 del código de usuario',
    example: '896ece9b8a314e6922783f9938ad8b1ad95cda0d11ece5902b36a2e879ccbaa2',
  })
  @Column({ name: 'codigo', length: 100, nullable: true })
  @Exclude()
  codigo: string;

  @ApiProperty({
    description: 'Hash SHA-256 de la contraseña del usuario',
    example: '896ece9b8a314e6922783f9938ad8b1ad95cda0d11ece5902b36a2e879ccbaa2',
  })
  @Column({ name: 'password', length: 100, nullable: true })
  @Exclude()
  password: string;

  // El rol se almacena en la tabla UsuariosRoles, no en Appusuarios

  @ApiProperty({
    description: 'Email del usuario',
    example: 'Raul.Vargas@grupoastro.com.do',
    maxLength: 255,
  })
  @Column({ name: 'user_email', length: 255, nullable: true })
  user_email: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '8091234567',
    maxLength: 20,
  })
  @Column({ name: 'telefono', length: 20, nullable: true })
  telefono: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Principal #123',
    maxLength: 255,
  })
  @Column({ name: 'direccion', length: 255, nullable: true })
  direccion: string;

  @ApiProperty({
    description: 'Número de celular del usuario',
    example: '8091234567',
    maxLength: 20,
  })
  @Column({ name: 'celular', length: 20, nullable: true })
  celular: string;

  @ApiProperty({
    description: 'Estado del usuario',
    example: 1,
  })
  @Column({ name: 'user_status', type: 'tinyint', nullable: true })
  user_status: number;

  @ApiProperty({
    description: 'ID de la caja asignada',
    example: '1',
    maxLength: 50,
  })
  @Column({ name: 'caja_id', type: 'int', nullable: true })
  caja_id: string;

  @ApiProperty({
    description: 'ID de la tienda asignada',
    example: '1',
    maxLength: 50,
  })
  @Column({ name: 'tienda_id', type: 'int', nullable: true })
  tienda_id: string;

  @ApiProperty({
    description: 'Permite múltiples tiendas (0=No, 1=Sí)',
    example: '0',
    maxLength: 1,
  })
  @Column({ name: 'allow_multi_tienda', type: 'bit', default: () => '(0)', nullable: true })
  allow_multi_tienda: string;

  @ApiProperty({
    description: 'Descuento máximo permitido',
    example: '10.5',
    maxLength: 10,
  })
  @Column({ name: 'max_descuento', type: 'decimal', precision: 5, scale: 2, nullable: true })
  max_descuento: string;

  @ApiProperty({
    description: 'Permite cerrar caja (0=No, 1=Sí)',
    example: '0',
    maxLength: 1,
  })
  @Column({ name: 'close_caja', type: 'bit', default: () => '(0)', nullable: true })
  close_caja: string;

  @ApiProperty({
    description: 'Fecha y hora del último login',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Column({ name: 'LastLoginDateTime', type: 'datetime2', nullable: true })
  lastlogindatetime: Date;

  @ApiProperty({
    description: 'IP del último login',
    example: '192.168.1.1',
    maxLength: 50,
  })
  @Column({ name: 'LastLoginIP', length: 45, nullable: true })
  lastloginip: string;

  @ApiProperty({
    description: 'IP del usuario',
    example: '192.168.1.1',
    maxLength: 50,
  })
  @Column({ name: 'user_ip', length: 45, nullable: true })
  user_ip: string;

  @ApiProperty({
    description: 'Email de la cuenta del usuario',
    example: 'usuario@email.com',
    maxLength: 255,
  })
  @Column({ name: 'user_account_email', length: 255, nullable: true })
  user_account_email: string;

  @ApiProperty({
    description: 'Contraseña del email de la cuenta',
    example: 'password123',
    maxLength: 255,
  })
  @Column({ name: 'user_account_email_passw', length: 20, nullable: true })
  user_account_email_passw: string;

  @ApiProperty({
    description: 'Porcentaje de comisión',
    example: '5.5',
    maxLength: 10,
  })
  @Column({ name: 'comision_porciento', type: 'decimal', precision: 5, scale: 2, nullable: true })
  comision_porciento: string;

  @ApiProperty({
    description: 'Portal ID por defecto',
    example: '1',
    maxLength: 50,
  })
  @Column({ name: 'Default_PortalId', type: 'int', nullable: true })
  default_portalid: string;

  @ApiProperty({
    description: 'Nuevo campo',
    example: 'valor',
    maxLength: 255,
  })
  @Column({ name: 'NuevoCampo', length: 300, nullable: true })
  nuevocampo: string;

  @ApiProperty({
    description: 'ID del encargado',
    example: '1',
    maxLength: 50,
  })
  @Column({ name: 'encargadoId', type: 'int', nullable: true })
  encargadoId: string;

  @ApiProperty({
    description: 'Indica si la contraseña ha sido cambiada',
    example: '0',
    maxLength: 1,
  })
  @Column({ name: 'passwchanged', type: 'bit', default: () => '(0)', nullable: true })
  passwchanged: string;

  @ApiProperty({
    description: 'Estado de validez del usuario (1=activo, 0=inactivo)',
    example: 1,
  })
  @Column({ name: 'valido', type: 'bit', default: () => '(1)' })
  valido: number;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deleted_at: Date;

  @ApiProperty({
    description: 'ID del usuario que realizó la eliminación',
    example: 1,
    nullable: true,
  })
  @Column({ name: 'deleted_by', type: 'int', nullable: true })
  deleted_by: number;

  getFullName(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  getApellido(): string {
    return `${this.apellido}`.trim();
  }

  isActive(): number {
    // Devuelve 1 si el usuario está activo, 0 si no
    return this.valido === 1 ? 1 : 0;
  }

  hasRole(roleId: number): boolean {
    // El rol se obtiene desde UsuariosRoles, no directamente de UserWriteEntity
    // Este método se mantiene por compatibilidad pero siempre retorna false
    return false;
  }
} 