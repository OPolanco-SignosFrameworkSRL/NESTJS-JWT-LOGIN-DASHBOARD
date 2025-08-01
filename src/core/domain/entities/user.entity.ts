export class User {
  constructor(
    public readonly id: number,
    public readonly cedula: string,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly codigo: string,
    public readonly role: string,
    public readonly user_email: string,
    public readonly telefono: string,
    public readonly valido: string,
    public readonly division: string,
    public readonly cargo: string,
    public readonly dependencia: string,
    public readonly recinto: string,
    public readonly estado: string,
  ) {}

  getFullName(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  getApellido(): string {
    return `${this.apellido}`.trim();
  }

  isActive(): boolean {
    return this.valido === '1' && this.estado === 'ACTIVO';
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }
} 