export class UserWrite {
  constructor(
    public readonly id: number,
    public readonly cedula: string,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly codigo: string,
    public readonly password: string,
    public readonly role: string,
    public readonly user_email: string,
    public readonly telefono: string,
    public readonly direccion: string,
    public readonly celular: string,
    public readonly user_status: number,
    public readonly caja_id: string,
    public readonly tienda_id: string,
    public readonly allow_multi_tienda: string,
    public readonly max_descuento: string,
    public readonly close_caja: string,
    public readonly lastlogindatetime: Date,
    public readonly lastloginip: string,
    public readonly user_ip: string,
    public readonly user_account_email: string,
    public readonly user_account_email_passw: string,
    public readonly comision_porciento: string,
    public readonly default_portalid: string,
    public readonly nuevocampo: string,
    public readonly encargadoId: string,
    public readonly passwchanged: string,
    public readonly valido: string,
  ) {}

  getFullName(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  getApellido(): string {
    return `${this.apellido}`.trim();
  }

  isActive(): boolean {
    return this.valido === '1';
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }
} 