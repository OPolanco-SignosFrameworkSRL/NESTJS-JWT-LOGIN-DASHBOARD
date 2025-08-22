import { UserRole } from '../interfaces/user.interface';

/**
 * Entidad de dominio User
 * Representa un usuario en el sistema de negocio
 * No depende de frameworks externos (TypeORM, etc.)
 */
export class User {
  constructor(
    public readonly id: number,
    public readonly cedula: string,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly role: UserRole,
    public readonly user_email?: string,
    public readonly telefono?: string,
    public readonly valido: boolean = true,
    public readonly division?: string,
    public readonly cargo?: string,
    public readonly dependencia?: string,
    public readonly recinto?: string,
    public readonly estado?: string,
  ) {}

  /**
   * Obtiene el nombre completo del usuario
   */
  getFullName(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  /**
   * Verifica si el usuario está activo
   */
  isActive(): boolean {
    return this.valido && this.estado === 'ACTIVO';
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.role === 'Admin' || this.role === 'Administrator';
  }

  /**
   * Verifica si el usuario puede crear solicitudes
   */
  canCreateRequests(): boolean {
    return this.isActive() && (this.hasRole('Usuario') || this.isAdmin());
  }

  /**
   * Verifica si el usuario puede aprobar solicitudes
   */
  canApproveRequests(): boolean {
    return this.isActive() && (this.hasRole('Supervisor') || this.hasRole('Manager') || this.isAdmin());
  }

  /**
   * Crea una nueva instancia de User con datos actualizados
   */
  update(data: Partial<Omit<User, 'id' | 'cedula'>>): User {
    return new User(
      this.id,
      this.cedula,
      data.nombre ?? this.nombre,
      data.apellido ?? this.apellido,
      data.role ?? this.role,
      data.user_email ?? this.user_email,
      data.telefono ?? this.telefono,
      data.valido ?? this.valido,
      data.division ?? this.division,
      data.cargo ?? this.cargo,
      data.dependencia ?? this.dependencia,
      data.recinto ?? this.recinto,
      data.estado ?? this.estado,
    );
  }

  /**
   * Marca el usuario como inactivo
   */
  deactivate(): User {
    return this.update({ valido: false });
  }

  /**
   * Marca el usuario como activo
   */
  activate(): User {
    return this.update({ valido: true, estado: 'ACTIVO' });
  }
} 