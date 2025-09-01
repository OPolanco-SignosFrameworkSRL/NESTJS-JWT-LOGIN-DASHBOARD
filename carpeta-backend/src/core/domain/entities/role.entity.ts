/**
 * Entidad de dominio Role
 * Representa un rol en el sistema de negocio
 * No depende de frameworks externos (TypeORM, etc.)
 */
export class Role {
  constructor(
    public readonly id: number,
    public readonly role_name: string,
    public readonly role_desc: string,
    public readonly valido: boolean = true,
  ) {}

  /**
   * Verifica si el rol está activo
   */
  isActive(): boolean {
    return this.valido;
  }

  /**
   * Verifica si es un rol administrativo
   */
  isAdministrativeRole(): boolean {
    const adminRoles = ['Administrador', 'Administrator', 'Admin'];
    return adminRoles.includes(this.role_name);
  }

  /**
   * Verifica si es un rol de supervisión
   */
  isSupervisorRole(): boolean {
    return this.role_name === 'Supervisor';
  }

  /**
   * Verifica si puede manejar operaciones de caja
   */
  canHandleCashOperations(): boolean {
    return this.role_name === 'Auxiliar de caja' || this.isAdministrativeRole();
  }

  /**
   * Verifica si puede realizar operaciones básicas
   */
  canPerformBasicOperations(): boolean {
    return this.role_name === 'Operador' || this.canHandleCashOperations() || this.isSupervisorRole();
  }

  /**
   * Crea una nueva instancia de Role con datos actualizados
   */
  update(data: Partial<Omit<Role, 'id'>>): Role {
    return new Role(
      this.id,
      data.role_name ?? this.role_name,
      data.role_desc ?? this.role_desc,
      data.valido ?? this.valido,
    );
  }

  /**
   * Marca el rol como inactivo
   */
  deactivate(): Role {
    return this.update({ valido: false });
  }

  /**
   * Marca el rol como activo
   */
  activate(): Role {
    return this.update({ valido: true });
  }

  /**
   * Obtiene la representación string del rol
   */
  toString(): string {
    return `${this.role_name} - ${this.role_desc}`;
  }
}
